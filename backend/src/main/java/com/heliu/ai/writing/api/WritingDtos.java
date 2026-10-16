package com.heliu.ai.writing.api;

import com.heliu.ai.writing.domain.WritingDraftEntity;

import java.time.Instant;

public final class WritingDtos {
    private WritingDtos() {}

    public record SaveDraftRequest(String title, String content, String style) {}

    public record DraftResponse(
            String id,
            String title,
            String content,
            String style,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static DraftResponse from(WritingDraftEntity entity) {
            return new DraftResponse(
                    entity.getId(), entity.getTitle(), entity.getContent(), entity.getStyle(),
                    entity.getCreatedAt(), entity.getUpdatedAt()
            );
        }
    }
}
