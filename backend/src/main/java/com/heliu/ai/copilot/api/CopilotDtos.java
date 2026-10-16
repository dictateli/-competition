package com.heliu.ai.copilot.api;

import com.heliu.ai.copilot.domain.CopilotMessageEntity;
import com.heliu.ai.knowledge.api.KnowledgeDtos;

import java.time.Instant;
import java.util.List;

public final class CopilotDtos {
    private CopilotDtos() {}

    public record ChatRequest(String message, String conversationId, String projectId) {}

    public record ChatResponse(
            String conversationId,
            String answer,
            String model,
            List<KnowledgeDtos.Citation> citations,
            Action action
    ) {}

    public record Action(String type, String title, List<String> items, String taskId) {}

    public record MessageResponse(String role, String content, Instant createdAt) {
        public static MessageResponse from(CopilotMessageEntity entity) {
            return new MessageResponse(entity.getRole(), entity.getContent(), entity.getCreatedAt());
        }
    }
}
