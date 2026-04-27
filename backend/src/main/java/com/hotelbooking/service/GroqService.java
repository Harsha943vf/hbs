package com.hotelbooking.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    @Value("${groq.api.enabled:false}")
    private boolean groqEnabled;

    @Value("${groq.api.model:}")
    private String groqModel;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

    private final Gson gson = new Gson();

    /**
     * Call Groq API to generate AI response
     */
    public String generateResponse(String userMessage, String context, String intent) {
        if (!isEnabled()) {
            return null; // Fall back to pattern matching
        }

        try {
            String systemPrompt = buildSystemPrompt(context, intent);
            String response = callGroqAPI(systemPrompt, userMessage);
            log.info("Generated response from Groq: {}", response.substring(0, Math.min(100, response.length())));
            return response;
        } catch (Exception e) {
            log.error("Error calling Groq API, falling back to pattern matching: ", e);
            return null; // Fall back to pattern matching
        }
    }

    private String buildSystemPrompt(String context, String intent) {
        String header = "You are a helpful hotel booking assistant.";
        String guidanceSearch = "If intent is SEARCH, ONLY use the provided context and never invent facts. When you state facts, include the source tag in square brackets exactly as provided (e.g. [HOTEL:123], [ROOM:456]) after the sentence. If the answer cannot be supported by the provided context, reply: 'I don't know; the information is not available in the provided context.'";
        String guidanceInfo = "If intent is INFO or BOOKING, you may answer from general knowledge (procedural steps, definitions). Do not invent facts about specific hotels; if the user requests specifics about a hotel and that information is not in the provided context, say you don't know and offer to search.";

        String fewShotSearch = "EXAMPLE (SEARCH):\nContext:\n[HOTEL:1] The Grand Hotel | 5-stars | Mumbai | Phone: +91-22-111111\nUser: 'Show hotels in Mumbai'\nAssistant: 'The Grand Hotel in Mumbai is a 5-star property. [HOTEL:1]'\n";
        String fewShotInfo = "EXAMPLE (INFO):\nUser: 'How to book a hotel?'\nAssistant: 'To book a hotel: 1) Search by city and dates. 2) Select a hotel and room. 3) Enter guest details and payment information. 4) Confirm booking and receive a confirmation number.'\n";

        StringBuilder prompt = new StringBuilder();
        prompt.append(header).append("\n\n");
        prompt.append("Intent: ").append(intent == null ? "SEARCH" : intent).append("\n\n");

        if ("SEARCH".equalsIgnoreCase(intent)) {
            prompt.append(guidanceSearch).append("\n\n");
            prompt.append("Available Information (do not invent anything):\n").append(context == null ? "" : context).append("\n\n");
            prompt.append(fewShotSearch);
        } else {
            prompt.append(guidanceInfo).append("\n\n");
            prompt.append("Available Information (only use if directly asked):\n").append(context == null ? "" : context).append("\n\n");
            prompt.append(fewShotInfo);
        }

        prompt.append("Guidelines:\n");
        prompt.append("- Be concise and factual (under 200 words)\n");
        prompt.append("- Prefer exact snippets from the context and cite their source tags when intent is SEARCH\n");
        prompt.append("- If asked for booking actions, explain next steps clearly\n");
        prompt.append("- If the context is long, prioritize the most relevant snippets\n");

        return prompt.toString();
    }

    private String callGroqAPI(String systemPrompt, String userMessage) throws IOException {
        String url = "https://api.groq.com/openai/v1/chat/completions";

        // Build request payload
        JsonObject messageObj = new JsonObject();
        messageObj.addProperty("role", "user");
        messageObj.addProperty("content", userMessage);

        JsonObject systemMsgObj = new JsonObject();
        systemMsgObj.addProperty("role", "system");
        systemMsgObj.addProperty("content", systemPrompt);

        JsonArray messages = new JsonArray();
        messages.add(systemMsgObj);
        messages.add(messageObj);

        JsonObject requestBody = new JsonObject();
        requestBody.add("messages", messages);
        requestBody.addProperty("model", groqModel);
        requestBody.addProperty("temperature", 0.2); // lower to reduce hallucination
        requestBody.addProperty("max_tokens", 300);
        requestBody.addProperty("top_p", 1);
        requestBody.add("stop", new JsonArray());

        RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + groqApiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response == null || !response.isSuccessful()) {
                String bodyStr = response != null && response.body() != null ? response.body().string() : "";
                log.error("Groq API error: {} - {}", response != null ? response.code() : "<no-response>", bodyStr);
                throw new IOException("Groq API returned " + (response != null ? response.code() : "<no-response>"));
            }

            String responseBody = response.body() != null ? response.body().string() : "";
            JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

            if (jsonResponse != null && jsonResponse.has("choices") && jsonResponse.getAsJsonArray("choices").size() > 0) {
                JsonObject choice = jsonResponse.getAsJsonArray("choices").get(0).getAsJsonObject();
                if (choice.has("message") && choice.getAsJsonObject("message").has("content")) {
                    return choice.getAsJsonObject("message").get("content").getAsString().trim();
                }
            }

            log.warn("Unexpected Groq response structure: {}", responseBody);
            throw new IOException("Invalid response structure from Groq");
        }
    }

    public boolean isEnabled() {
        return groqEnabled
                && groqApiKey != null
                && !groqApiKey.isBlank()
                && !groqApiKey.equals("GROQ_API_KEY")
                && groqModel != null
                && !groqModel.isBlank();
    }
}
