package com.heliu.ai.meeting.domain;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "action_items", indexes = @Index(name = "idx_action_meeting", columnList = "meetingId"))
public class ActionItemEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String meetingId;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, length = 64)
    private String owner;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private ActionStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    protected ActionItemEntity() {}

    public ActionItemEntity(String id, String meetingId, String title, String owner, LocalDate dueDate) {
        this.id = id;
        this.meetingId = meetingId;
        this.title = title;
        this.owner = owner;
        this.dueDate = dueDate;
        this.status = ActionStatus.OPEN;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public String getMeetingId() { return meetingId; }
    public String getTitle() { return title; }
    public String getOwner() { return owner; }
    public LocalDate getDueDate() { return dueDate; }
    public ActionStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }

    public void complete() { this.status = ActionStatus.DONE; }
    public void reopen() { this.status = ActionStatus.OPEN; }
    public void changeStatus(ActionStatus status) { this.status = status; }
}
