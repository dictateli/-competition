package com.heliu.ai.meeting.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "meetings", indexes = @Index(name = "idx_meeting_workspace", columnList = "workspaceId"))
public class MeetingEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private MeetingStatus status;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String transcriptText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant startedAt;
    private Instant endedAt;

    protected MeetingEntity() {}

    public MeetingEntity(String id, String workspaceId, String title) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.title = title;
        this.status = MeetingStatus.CREATED;
        this.transcriptText = "";
        this.createdAt = Instant.now();
    }

    public void appendTranscript(String text) {
        this.transcriptText = (this.transcriptText == null ? "" : this.transcriptText + "\n") + text;
        if (this.startedAt == null) this.startedAt = Instant.now();
        this.status = MeetingStatus.IN_PROGRESS;
    }

    public void complete(String summary) {
        this.summary = summary;
        this.status = MeetingStatus.FINISHED;
        this.endedAt = Instant.now();
        if (this.startedAt == null) this.startedAt = this.createdAt;
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getTitle() { return title; }
    public MeetingStatus getStatus() { return status; }
    public String getTranscriptText() { return transcriptText; }
    public String getSummary() { return summary; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getEndedAt() { return endedAt; }
}
