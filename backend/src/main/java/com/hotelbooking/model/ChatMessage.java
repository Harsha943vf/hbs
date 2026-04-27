package com.hotelbooking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "sender", nullable = false)
    private String sender; // "user" or "bot"

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "context_data", columnDefinition = "TEXT")
    private String contextData; // Store relevant hotel/booking data used for response

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "embedding", columnDefinition = "LONGTEXT")
    private String embedding; // Store embedding for vector search

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
