package com.heliu.ai.notification.api;

import com.heliu.ai.notification.domain.NotificationEntity;

import java.time.Instant;

public final class NotificationDtos {
    private NotificationDtos() {}

    public record NotificationResponse(
            String id,
            String title,
            String message,
            String type,
            String level,
            String sourceType,
            String sourceId,
            boolean read,
            Instant createdAt
    ) {
        public static NotificationResponse from(NotificationEntity entity) {
            return new NotificationResponse(
                    entity.getId(), entity.getTitle(), entity.getMessage(), entity.getType(), entity.getLevel(),
                    entity.getSourceType(), entity.getSourceId(), entity.isRead(), entity.getCreatedAt()
            );
        }
    }

    public record UnreadCountResponse(long count) {}
}
