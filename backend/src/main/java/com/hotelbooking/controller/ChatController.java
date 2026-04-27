package com.hotelbooking.controller;

import com.hotelbooking.dto.request.ChatRequest;
import com.hotelbooking.dto.response.ChatResponse;
import com.hotelbooking.model.ChatMessage;
import com.hotelbooking.model.User;
import com.hotelbooking.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    
    private final ChatService chatService;

    /**
     * Send a message to the chatbot and get a response
     */
    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ChatResponse> sendMessage(
            @RequestBody ChatRequest request,
            @AuthenticationPrincipal User currentUser) {
        User user = requireAuthenticatedUser(currentUser);
        request.setUserId(user.getId());
        log.info("Received chat message from user: {}", user.getId());
        ChatResponse response = chatService.processMessage(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get chat history for a user
     */
    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@AuthenticationPrincipal User currentUser) {
        User user = requireAuthenticatedUser(currentUser);
        log.info("Fetching chat history for user: {}", user.getId());
        List<ChatMessage> history = chatService.getChatHistory(user.getId());
        return ResponseEntity.ok(history);
    }

    /**
     * Clear chat history for a user
     */
    @DeleteMapping("/history")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<String> clearChatHistory(@AuthenticationPrincipal User currentUser) {
        User user = requireAuthenticatedUser(currentUser);
        log.info("Clearing chat history for user: {}", user.getId());
        chatService.clearChatHistory(user.getId());
        return ResponseEntity.ok("Chat history cleared successfully");
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chatbot service is running");
    }

    private User requireAuthenticatedUser(User currentUser) {
        if (currentUser == null) {
            throw new ResponseStatusException(UNAUTHORIZED, "Unauthorized");
        }
        return currentUser;
    }
}
