package com.heliu.ai.common;

import java.time.Instant;

public record ApiResponse<T>(boolean success, String traceId, T data, String message, Instant timestamp) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, TraceId.current(), data, "ok", Instant.now());
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, TraceId.current(), null, message, Instant.now());
    }
}
