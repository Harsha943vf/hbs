package com.hotelbooking.repository;

import com.hotelbooking.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ChatMessage> findBySenderAndUserIdOrderByCreatedAtDesc(String sender, Long userId);

    List<ChatMessage> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
