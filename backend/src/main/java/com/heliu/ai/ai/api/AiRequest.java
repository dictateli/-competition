package com.heliu.ai.ai.api;

import java.util.List;

public record AiRequest(String prompt, String workspaceId, List<String> contextIds) {
    public AiRequest {
        contextIds = contextIds == null ? List.of() : List.copyOf(contextIds);
    }
}
