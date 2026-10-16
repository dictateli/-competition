package com.heliu.ai.notification.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_workspace", columnList = "workspaceId,createdAt"),
        @Index(name = "idx_notification_unread", columnList = "workspaceId,readFlag")
})
public class NotificationEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 200)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 32)
    private String type;

    @Column(nullable = false, length = 16)
    private String level;

    @Column(length = 32)
    private String sourceType;

    @Column(length = 64)
    private String sourceId;

    @Column(name = "read_flag", nullable = false)
    private boolean read;

    @Column(nullable = false)
    private Instant createdAt;

    protected NotificationEntity() {}

    public NotificationEntity(
            String id,
            String workspaceId,
            String title,
            String message,
            String type,
            String level,
            String sourceType,
            String sourceId
    ) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.level = level;
        this.sourceType = sourceType;
        this.sourceId = sourceId;
        this.read = false;
        this.createdAt = Instant.now();
    }

    public void markRead() { this.read = true; }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public String getLevel() { return level; }
    public String getSourceType() { return sourceType; }
    public String getSourceId() { return sourceId; }
    public boolean isRead() { return read; }
    public Instant getCreatedAt() { return createdAt; }
}
