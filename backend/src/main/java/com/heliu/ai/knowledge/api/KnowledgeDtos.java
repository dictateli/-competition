package com.heliu.ai.knowledge.api;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

public final class KnowledgeDtos {
    private KnowledgeDtos() {}

    public record KnowledgeItem(
            String type,
            String id,
            String title,
            String snippet,
            double score,
            String source,
            String location,
            Instant timestamp
    ) {}

    public record SearchResponse(String query, int total, List<KnowledgeItem> items, List<String> suggestions) {}

    public record KnowledgeStats(
            int documents,
            int meetings,
            int tasks,
            int projects,
            int workflows,
            int connections,
            long unreadNotifications,
            String traceability,
            List<Insight> insights
    ) {}

    public record Insight(String question, String answer, String source) {}

    public record AskRequest(@NotBlank String question, List<String> contextIds) {
        public AskRequest {
            contextIds = contextIds == null ? List.of() : List.copyOf(contextIds);
        }
    }

    public record AskResponse(String answer, String model, List<Citation> citations) {}

    public record Citation(String sourceId, String sourceName, String location, double score) {}
}
