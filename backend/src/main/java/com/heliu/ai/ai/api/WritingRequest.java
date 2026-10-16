package com.heliu.ai.ai.api;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record WritingRequest(@NotBlank String prompt, List<String> contextIds, String style) {
    public WritingRequest {
        contextIds = contextIds == null ? List.of() : List.copyOf(contextIds);
        style = style == null || style.isBlank() ? "专业" : style;
    }
}
