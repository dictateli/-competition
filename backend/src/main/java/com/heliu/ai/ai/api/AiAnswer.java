package com.heliu.ai.ai.api;

import java.util.List;

public record AiAnswer(String content, String model, List<AiCitation> citations) {
    public AiAnswer {
        citations = citations == null ? List.of() : List.copyOf(citations);
    }
}
