package com.heliu.ai.common;

import java.util.UUID;

public final class TraceId {
    private static final ThreadLocal<String> VALUE = ThreadLocal.withInitial(() -> UUID.randomUUID().toString().replace("-", ""));
    private TraceId() {}
    public static String current() { return VALUE.get(); }
    public static void reset() { VALUE.set(UUID.randomUUID().toString().replace("-", "")); }
    public static void clear() { VALUE.remove(); }
}
