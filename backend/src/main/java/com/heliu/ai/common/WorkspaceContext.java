package com.heliu.ai.common;

import java.util.UUID;

public final class WorkspaceContext {
    public static final String DEFAULT_WORKSPACE = "ws-demo";
    private static final ThreadLocal<String> WORKSPACE = ThreadLocal.withInitial(() -> DEFAULT_WORKSPACE);
    private WorkspaceContext() {}
    public static String current() { return WORKSPACE.get(); }
    public static void set(String workspaceId) {
        if (workspaceId == null || workspaceId.isBlank()) throw new IllegalArgumentException("workspaceId must not be blank");
        WORKSPACE.set(workspaceId.trim());
    }
    public static void clear() { WORKSPACE.remove(); }
    public static String newId(String prefix) { return prefix + "-" + UUID.randomUUID().toString().substring(0, 8); }
}
