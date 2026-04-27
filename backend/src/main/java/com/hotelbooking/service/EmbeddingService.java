package com.hotelbooking.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class EmbeddingService {

    // Simple token-frequency based similarity for demo RAG (no external embeddings)
    public double similarity(String a, String b) {
        if (a == null || b == null) return 0.0;
        Map<String, Integer> ma = termFreq(a);
        Map<String, Integer> mb = termFreq(b);

        double dot = 0.0;
        double na = 0.0;
        double nb = 0.0;

        // compute dot and norms
        for (String token : ma.keySet()) {
            double va = ma.getOrDefault(token, 0);
            double vb = mb.getOrDefault(token, 0);
            dot += va * vb;
            na += va * va;
        }
        for (double v : mb.values()) {
            nb += v * v;
        }
        if (na == 0 || nb == 0) return 0.0;
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    private Map<String, Integer> termFreq(String s) {
        Map<String, Integer> freq = new HashMap<>();
        if (s == null || s.isBlank()) return freq;
        String normalized = s.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]", " ");
        String[] tokens = normalized.split("\\s+");
        for (String t : tokens) {
            if (t.isBlank() || t.length() < 2) continue;
            freq.put(t, freq.getOrDefault(t, 0) + 1);
        }
        return freq;
    }
}
