package com.heliu.ai.identity.service;

import com.heliu.ai.identity.domain.UserEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 演示环境的 Token 存储：内存 Map + 过期时间。
 * 单实例演示足够；生产环境应改用 Redis 或数据库持久化。
 */
@Service
public class TokenStore {
    private static final long TTL_SECONDS = 8 * 3600L;

    private final Map<String, Entry> tokens = new ConcurrentHashMap<>();

    public String issue(UserEntity user) {
        String token = "tok-" + java.util.UUID.randomUUID().toString().replace("-", "");
        tokens.put(token, new Entry(user, Instant.now().plusSeconds(TTL_SECONDS)));
        return token;
    }

    public Optional<UserEntity> lookup(String token) {
        if (token == null) return Optional.empty();
        Entry e = tokens.get(token);
        if (e == null) return Optional.empty();
        if (Instant.now().isAfter(e.expiresAt)) {
            tokens.remove(token);
            return Optional.empty();
        }
        return Optional.of(e.user);
    }

    public void revoke(String token) {
        if (token != null) tokens.remove(token);
    }

    private static final class Entry {
        final UserEntity user;
        final Instant expiresAt;
        Entry(UserEntity user, Instant expiresAt) { this.user = user; this.expiresAt = expiresAt; }
    }
}
