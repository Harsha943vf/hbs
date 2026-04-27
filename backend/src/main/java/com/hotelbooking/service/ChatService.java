package com.hotelbooking.service;

import com.hotelbooking.dto.request.ChatRequest;
import com.hotelbooking.dto.response.ChatResponse;
import com.hotelbooking.model.ChatMessage;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.Room;
import com.hotelbooking.repository.ChatMessageRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final GroqService groqService;
    private final EmbeddingService embeddingService;

    /**
     * Process user message and generate bot response using RAG approach
     */
    public ChatResponse processMessage(ChatRequest request) {
        try {
            // Validate request early to avoid NPEs
            if (request == null || request.getMessage() == null || request.getMessage().isBlank()) {
                return createErrorResponse("Please provide a non-empty message.");
            }

            // Store user message
            ChatMessage userMessage = new ChatMessage();
            userMessage.setUserId(request.getUserId());
            userMessage.setSender("user");
            userMessage.setMessage(request.getMessage());
            chatMessageRepository.save(userMessage);

            // Normalize user input
            String userInput = request.getMessage().trim().toLowerCase(Locale.ROOT);

            if (isCancellationQuery(userInput)) {
                return storeBotResponseAndCreateResponse(
                        request.getUserId(),
                        generateBookingCancellationResponse(),
                        ""
                );
            }

            Integer requestedStarRating = extractStarRating(userInput);
            if (requestedStarRating != null && isQueryAboutHotels(userInput)) {
                String relevantContext = retrieveHotelContext(userInput);
                return storeBotResponseAndCreateResponse(
                        request.getUserId(),
                        generateStarRatingHotelResponse(requestedStarRating, relevantContext),
                        relevantContext
                );
            }

            // Analyze user intent and retrieve relevant context
            String relevantContext = retrieveRelevantContext(userInput);
            
            // Generate response using RAG
            String botResponse = generateResponse(userInput, relevantContext);
            return storeBotResponseAndCreateResponse(request.getUserId(), botResponse, relevantContext);
        } catch (Exception e) {
            log.error("Error processing chat message: ", e);
            return createErrorResponse("I apologize, but I encountered an error processing your request. Please try again.");
        }
    }

    private ChatResponse storeBotResponseAndCreateResponse(Long userId, String botResponse, String relevantContext) {
        ChatMessage botMessage = new ChatMessage();
        botMessage.setUserId(userId);
        botMessage.setSender("bot");
        botMessage.setMessage(botResponse);
        botMessage.setContextData(relevantContext);
        ChatMessage savedMessage = chatMessageRepository.save(botMessage);

        ChatResponse response = new ChatResponse();
        response.setMessage(botResponse);
        response.setSender("bot");
        response.setChatMessageId(savedMessage.getId());
        response.setRelevantContext(relevantContext);
        return response;
    }

    private String retrieveHotelContext(String userInput) {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            
            // Extract location if mentioned
            String location = extractLocation(userInput);
            Integer starRating = extractStarRating(userInput);
            
            if (!location.isEmpty()) {
                hotels = hotels.stream()
                    .filter(h -> h.getLocation() != null && h.getLocation().toLowerCase().contains(location))
                    .collect(Collectors.toList());
            }

            if (starRating != null) {
                hotels = hotels.stream()
                    .filter(h -> h.getStarRating() == starRating)
                    .collect(Collectors.toList());
            }

            if (hotels.isEmpty()) {
                return "";
            }

            StringBuilder contextBuilder = new StringBuilder();
            // Return concise, factual snippets with source tags for RAG
            hotels.stream().limit(5).forEach(hotel -> {
                String desc = hotel.getDescription() != null ? hotel.getDescription() : "";
                String snippet = String.format("[HOTEL:%d] %s | %d-stars | %s | Phone: %s | Check-in: %s | Check-out: %s",
                        hotel.getId(),
                        hotel.getName(),
                        hotel.getStarRating(),
                        sanitizeForPrompt(desc),
                        safe(hotel.getPhoneNumber()),
                        safe(hotel.getCheckInTime()),
                        safe(hotel.getCheckOutTime())
                );
                contextBuilder.append(snippet).append("\n");
            });

            return contextBuilder.toString();
        } catch (Exception e) {
            log.error("Error retrieving hotel context: ", e);
            return "";
        }
    }

    private String retrieveRoomContext(String userInput) {
        try {
            List<Room> rooms = roomRepository.findByIsAvailableTrue();

            if (rooms.isEmpty()) {
                return "";
            }

            StringBuilder contextBuilder = new StringBuilder();
            rooms.stream().limit(8).forEach(room -> {
                String amenities = room.getAmenities() != null ? String.join(", ", room.getAmenities()) : "";
                String snippet = String.format("[ROOM:%d] HotelId:%d | Room %s (%s) | $%s/night | Occupancy:%d | Amenities:%s",
                        room.getId(),
                        room.getHotel() != null ? room.getHotel().getId() : -1,
                        safe(room.getRoomNumber()),
                        safe(room.getRoomType()),
                        safe(room.getPricePerNight()),
                        safe(room.getMaxOccupancy()),
                        sanitizeForPrompt(amenities)
                );
                contextBuilder.append(snippet).append("\n");
            });

            return contextBuilder.toString();
        } catch (Exception e) {
            log.error("Error retrieving room context: ", e);
            return "";
        }
    }

    private String retrieveAmenitiesContext(String userInput) {
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            StringBuilder contextBuilder = new StringBuilder();

            hotels.stream().limit(6).forEach(hotel -> {
                if (hotel.getAmenities() != null && !hotel.getAmenities().isEmpty()) {
                    String snippet = String.format("[HOTEL:%d] %s amenities: %s",
                        hotel.getId(),
                        hotel.getName(),
                        sanitizeForPrompt(String.join(", ", hotel.getAmenities()))
                    );
                    contextBuilder.append(snippet).append("\n");
                }
            });

            return contextBuilder.toString();
        } catch (Exception e) {
            log.error("Error retrieving amenities context: ", e);
            return "";
        }
    }

    private String retrieveRelevantContext(String userInput) {
        // Collect structured snippets into a list
        List<String> snippets = new ArrayList<>();

        boolean intentHotels = isQueryAboutHotels(userInput);
        boolean intentRooms = isQueryAboutRooms(userInput);
        boolean intentAmenities = isQueryAboutAmenities(userInput);

        if (intentHotels) {
            String hotels = retrieveHotelContext(userInput);
            if (hotels != null && !hotels.isBlank()) {
                for (String line : hotels.split("\\n")) if (!line.isBlank()) snippets.add(line.trim());
            }
        }

        if (intentRooms) {
            String rooms = retrieveRoomContext(userInput);
            if (rooms != null && !rooms.isBlank()) {
                for (String line : rooms.split("\\n")) if (!line.isBlank()) snippets.add(line.trim());
            }
        }

        if (intentAmenities) {
            String amenities = retrieveAmenitiesContext(userInput);
            if (amenities != null && !amenities.isBlank()) {
                for (String line : amenities.split("\\n")) if (!line.isBlank()) snippets.add(line.trim());
            }
        }

        // Always include a small general snippet
        snippets.add("[GENERAL] " + getGeneralBookingInfo());

        // Score snippets using embeddingService and pick top-k
        int k = 6;
        // Only allow graceful fallback to top-k when the user's intent explicitly targets hotels/rooms/amenities
        boolean allowFallback = intentHotels || intentRooms || intentAmenities;
        List<String> top = getTopSnippets(userInput, snippets, k, allowFallback);
        if (top.isEmpty()) {
            // If caller didn't allow fallback (no explicit hotel/room/amenity intent), return empty context to avoid irrelevant hotel lists
            if (!allowFallback) {
                return "";
            }
            // fallback: return concatenation of first N snippets (only when intent requested context)
            StringBuilder fallback = new StringBuilder();
            for (int i = 0; i < Math.min(k, snippets.size()); i++) fallback.append(snippets.get(i)).append("\n");
            return truncateContext(fallback.toString(), 3000);
        }

        StringBuilder result = new StringBuilder();
        for (String s : top) result.append(s).append("\n");
        return truncateContext(result.toString(), 3000);
    }

    private List<String> getTopSnippets(String userInput, List<String> snippets, int k, boolean allowFallbackIfNoFiltered) {
        if (snippets == null || snippets.isEmpty()) return List.of();
        Map<String, Double> scores = new HashMap<>();
        for (String s : snippets) {
            double sim = 0.0;
            try {
                sim = embeddingService.similarity(userInput, s);
                if (Double.isNaN(sim) || Double.isInfinite(sim)) sim = 0.0;
            } catch (Exception ex) {
                log.warn("Embedding similarity call failed for snippet: {} - {}", s, ex.getMessage());
                sim = 0.0;
            }
            scores.put(s, sim);
        }
        // Filter out very weak matches to avoid irrelevant hotel lists for non-hotel queries
        double minAcceptable = 0.05; // slightly higher threshold to reduce noise
        List<Map.Entry<String, Double>> filtered = scores.entrySet().stream()
                .filter(e -> e.getValue() >= minAcceptable)
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .limit(k)
                .collect(Collectors.toList());

        if (filtered.isEmpty()) {
            if (allowFallbackIfNoFiltered) {
                // if caller requires context (explicit hotel/room/amenity intent), still return top-k by score
                return scores.entrySet().stream()
                        .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                        .limit(k)
                        .map(Map.Entry::getKey)
                        .collect(Collectors.toList());
            }
            // otherwise return empty to indicate no relevant context
            return List.of();
        }

        return filtered.stream().map(Map.Entry::getKey).collect(Collectors.toList());
    }

    // Helpers to sanitize and truncate
    private String sanitizeForPrompt(Object obj) {
        if (obj == null) return "";
        String s = String.valueOf(obj);
        // remove newlines and excessive whitespace
        return s.replaceAll("\\s+", " ").trim();
    }

    private String safe(Object obj) {
        return obj == null ? "" : String.valueOf(obj);
    }

    private String truncateContext(String text, int maxChars) {
        if (text == null) return "";
        if (maxChars <= 0) return "";
        if (text.length() <= maxChars) return text;

        // Prefer cutting at the last newline before maxChars, then last space; avoid cutting inside tags
        int cutAt = -1;
        String candidate = text.substring(0, Math.min(text.length(), maxChars));
        int lastNewline = candidate.lastIndexOf('\n');
        if (lastNewline > Math.max(0, maxChars - 200)) { // prefer recent newline but avoid extremely early cut
            cutAt = lastNewline;
        } else {
            int lastSpace = candidate.lastIndexOf(' ');
            if (lastSpace > 0) cutAt = lastSpace;
        }

        if (cutAt <= 0) {
            // fallback to hard cut
            return candidate + "...";
        }

        String trimmed = candidate.substring(0, cutAt).trim();
        return trimmed + "...";
    }

    private String renderReadableContext(String context) {
        if (context == null || context.isBlank()) return "";
        StringBuilder sb = new StringBuilder();
        for (String line : context.split("\\n")) {
            if (line.isBlank()) continue;
            if (line.startsWith("[GENERAL]")) continue;
            // remove leading source tag like [HOTEL:123]
            String cleaned = line.replaceFirst("^\\[[^]]+\\]\\s*", "");
            sb.append("- ").append(cleaned).append("\n");
        }
        return sb.toString();
    }

    private String filterHotelContextByStarRating(String context, int starRating) {
        if (context == null || context.isBlank()) return "";

        String expectedToken = "|" + " " + starRating + "-stars" + " |";
        StringBuilder filtered = new StringBuilder();
        for (String line : context.split("\\n")) {
            if (line.isBlank() || line.startsWith("[GENERAL]")) continue;
            if (line.contains(expectedToken)) {
                filtered.append(line).append("\n");
            }
        }
        return filtered.toString().trim();
    }

    private String generateHotelResponse(String context) {
        if (context == null || context.isBlank()) {
            return "I couldn't find any hotels matching your query.";
        }
        // If context contains source-tagged snippets, render them nicely
        if (context.contains("[HOTEL:") || context.contains("[ROOM:")) {
            String readable = renderReadableContext(context);
            return "Great! Here are the hotels we found based on your search:\n" + readable + "\nWould you like more information about any specific hotel or help with booking?";
        }

        if (context.contains("Available Hotels")) {
            return "Great! Here are the hotels we found based on your search:\n" + context + "\n\nWould you like more information about any specific hotel or help with booking?";
        }
        return "I found hotel information in our system. " + context + "\n\nWould you like to make a booking or need more details?";
    }

    private String generateStarRatingHotelResponse(int starRating, String context) {
        String filteredContext = filterHotelContextByStarRating(context, starRating);
        if (filteredContext.isBlank()) {
            return "I couldn't find any " + starRating + "-star hotels matching your query.";
        }

        String readable = renderReadableContext(filteredContext);
        return "Here are the " + starRating + "-star hotels we found:\n" + readable
                + "\nWould you like more information about any specific hotel or help with booking?";
    }

    private String generateRoomResponse(String context) {
        if (context.contains("Available Rooms")) {
            return "Here are the available rooms:\n" + context + "\n\nWould you like to book one of these rooms or need more information?";
        }
        return "We have several room options available. " + context + "\n\nLet me know if you'd like to proceed with a booking!";
    }

    private String generateBookingHelpResponse() {
        return "To book a hotel, first search by city or location. Then choose a hotel, select an available room, enter your check-in and check-out dates, add the number of guests, and confirm the booking. If you want, I can also help you find hotels or available rooms first.";
    }

    private String generateBookingCancellationResponse() {
        return "To cancel a booking, go to your bookings section, open the booking you want to cancel, and choose the cancel option. In the backend, the booking status is updated to CANCELLED. If you want, I can also help explain how to find your booking before cancelling it.";
    }

    private ChatResponse createErrorResponse(String message) {
        ChatResponse response = new ChatResponse();
        response.setMessage(message);
        response.setSender("bot");
        return response;
    }

    public List<ChatMessage> getChatHistory(Long userId) {
        return chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void clearChatHistory(Long userId) {
        List<ChatMessage> messages = chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId);
        chatMessageRepository.deleteAll(messages);
    }

    private String extractLocation(String userInput) {
        // Extended list including US and Indian cities
        String[] commonLocations = {
            // US Cities
            "new york", "los angeles", "chicago", "houston", "phoenix", "las vegas", "miami", "san francisco",
            // Indian Cities
            "hyderabad", "mumbai", "delhi", "bangalore", "bengaluru", "kolkata", "chennai", "pune", "gurgaon", "noida",
            // Others
            "london", "paris", "berlin", "tokyo", "singapore"
        };

        for (String loc : commonLocations) {
            if (userInput.contains(loc)) return loc;
        }
        return "";
    }

    private Integer extractStarRating(String userInput) {
        if (userInput == null || userInput.isBlank()) {
            return null;
        }

        String normalized = userInput.toLowerCase(Locale.ROOT);
        for (int rating = 1; rating <= 5; rating++) {
            if (normalized.contains(rating + " star")
                    || normalized.contains(rating + "-star")
                    || normalized.contains(rating + " stars")
                    || normalized.contains(rating + "-stars")) {
                return rating;
            }
        }

        if (normalized.contains("one star")) return 1;
        if (normalized.contains("two star")) return 2;
        if (normalized.contains("three star")) return 3;
        if (normalized.contains("four star")) return 4;
        if (normalized.contains("five star")) return 5;

        return null;
    }

    private boolean isCancellationQuery(String input) {
        if (input == null || input.isBlank()) return false;
        String s = input.toLowerCase(Locale.ROOT);
        return s.contains("cancel booking")
                || s.contains("cancel my booking")
                || s.contains("how to cancel")
                || s.contains("cancellation")
                || s.contains("cancel reservation")
                || s.contains("cancel a reservation");
    }

    // Simple keyword-based intent classification with some heuristics
    private boolean isQueryAboutHotels(String input) {
        if (input == null || input.isBlank()) return false;
        String s = input.toLowerCase(Locale.ROOT);

        if (extractStarRating(s) != null) {
            return true;
        }

        // Direct hotel mentions or hotel search actions -> strong signal
        if (s.contains("hotel") || s.contains("hotels") || s.contains("availability") || s.contains("available")) {
            return true;
        }

        // Phrases asking where to stay or looking for recommendations with a location -> hotel intent
        if ((s.contains("where to stay") || s.contains("where should i stay") || s.contains("best hotels") || s.contains("top hotels") || s.contains("recommend a hotel") || s.contains("recommend hotels"))) {
            if (extractLocation(s).length() > 0) return true;
        }

        // 'near' or 'nearby' alone is weak; require location to count
        if ((s.contains("nearby") || s.contains("near"))) {
            if (extractLocation(s).length() > 0) return true;
        }

        // 'stay' by itself is weak; require location or explicit hotel term
        if (s.contains("stay") || s.contains("staying")) {
            if (extractLocation(s).length() > 0 || s.contains("hotel")) return true;
        }

        return false;
    }

    private boolean isQueryAboutRooms(String input) {
        if (input == null || input.isBlank()) return false;
        String s = input.toLowerCase(Locale.ROOT);
        // Rooms intent should include room-specific words or ask about price/occupancy/availability
        if (s.contains(" room ") || s.contains("rooms") || s.contains("suite") || s.contains("bed ") || s.contains("occupancy") || s.contains("per night") || s.contains("rate") || s.contains("price") || s.contains("available rooms") || s.contains("availability")) return true;
        // also if user mentions a hotel id and room
        if (s.matches(".*\\[hotel:\\d+\\].*room.*")) return true;
        return false;
    }

    private boolean isQueryAboutAmenities(String input) {
        if (input == null || input.isBlank()) return false;
        String s = input.toLowerCase(Locale.ROOT);
        String[] amenKeywords = {"pool", "spa", "wifi", "breakfast", "gym", "parking", "amenit", "restaurant", "dining", "bar", "pet"};
        for (String k : amenKeywords) if (s.contains(k)) return true;
        // also if user asks "what does [HOTEL:123] offer" or similar
        if (s.matches(".*what.*offer.*\\[hotel:\\d+\\].*")) return true;
        return false;
    }

    private String getGeneralBookingInfo() {
        return "We offer hotel listings, rooms with pricing and availability, and amenities information. To book, tell me the hotel id or ask to search by city/date.";
    }

    /**
     * Generate final response. Prefer Groq/RAG when enabled. Fall back to rule-based renderers.
     */
    private String generateResponse(String userMessage, String context) {
        String intent = determineIntent(userMessage);

        // Prefer LLM RAG when enabled
        try {
            if (groqService != null && groqService.isEnabled()) {
                String groqResp = groqService.generateResponse(userMessage, context, intent);
                if (groqResp != null && !groqResp.isBlank()) return groqResp;
            }
        } catch (Exception e) {
            log.warn("Groq call failed or disabled, falling back to rule-based response: {}", e.getMessage());
        }

        if ("BOOKING".equalsIgnoreCase(intent)) {
            return generateBookingHelpResponse();
        }

        // If embeddings/context indicate low relevance and intent is not about hotels/rooms/amenities, avoid returning hotel lists
        boolean wantsHotel = isQueryAboutHotels(userMessage);
        boolean wantsRoom = isQueryAboutRooms(userMessage);
        boolean wantsAmen = isQueryAboutAmenities(userMessage);

        if (wantsHotel) {
            return generateHotelResponse(context);
        }
        if (wantsRoom) {
            return generateRoomResponse(context);
        }
        if (wantsAmen) {
            return "Here are some amenities from our listings:\n" + renderReadableContext(context);
        }

        // Generic fallback: if context contains strong hotel/room tags but user didn't ask for it, give a short neutral answer and offer help
        if (context != null && (context.contains("[HOTEL:") || context.contains("[ROOM:"))) {
            return "I found some hotel information, but I'm not sure what you're asking. Could you clarify (e.g., 'show hotels in Mumbai' or 'what amenities does hotel [HOTEL:123] have')?";
        }

        // Last resort: echo general info
        return "I'm here to help with hotel searches, bookings, rooms, and amenities. Could you give more details or ask a specific question?";
    }

    private String determineIntent(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return "INFO";
        }

        String normalized = userMessage.toLowerCase(Locale.ROOT);
        if (isCancellationQuery(normalized)) {
            return "BOOKING";
        }

        if (normalized.contains("how to book")
                || normalized.contains("booking process")
                || normalized.contains("reschedule")
                || normalized.contains("payment")) {
            return "BOOKING";
        }

        if (isQueryAboutHotels(normalized) || isQueryAboutRooms(normalized) || isQueryAboutAmenities(normalized)) {
            return "SEARCH";
        }

        return "INFO";
    }

}
