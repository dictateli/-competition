package com.heliu.ai.writing.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "writing_drafts", indexes = @Index(name = "idx_draft_workspace", columnList = "workspaceId"))
public class WritingDraftEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 240)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 40)
    private String style;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected WritingDraftEntity() {}

    public WritingDraftEntity(String id, String workspaceId, String title, String content, String style) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.title = title == null || title.isBlank() ? "未命名文档" : title.trim();
        this.content = content == null ? "" : content;
        this.style = style == null || style.isBlank() ? "专业" : style.trim();
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String title, String content, String style) {
        if (title != null && !title.isBlank()) this.title = title.trim();
        if (content != null) this.content = content;
        if (style != null && !style.isBlank()) this.style = style.trim();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getStyle() { return style; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
