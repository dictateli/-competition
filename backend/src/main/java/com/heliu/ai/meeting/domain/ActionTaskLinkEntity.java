package com.heliu.ai.meeting.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "meeting_action_task_links", uniqueConstraints = {
        @UniqueConstraint(name = "uk_action_task_action", columnNames = "actionId")
}, indexes = {
        @Index(name = "idx_action_task_workspace", columnList = "workspaceId"),
        @Index(name = "idx_action_task_meeting", columnList = "meetingId")
})
public class ActionTaskLinkEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 64)
    private String meetingId;

    @Column(nullable = false, length = 64)
    private String actionId;

    @Column(nullable = false, length = 64)
    private String projectId;

    @Column(nullable = false, length = 64)
    private String taskId;

    @Column(nullable = false)
    private Instant createdAt;

    protected ActionTaskLinkEntity() {}

    public ActionTaskLinkEntity(String id, String workspaceId, String meetingId, String actionId, String projectId, String taskId) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.meetingId = meetingId;
        this.actionId = actionId;
        this.projectId = projectId;
        this.taskId = taskId;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getMeetingId() { return meetingId; }
    public String getActionId() { return actionId; }
    public String getProjectId() { return projectId; }
    public String getTaskId() { return taskId; }
    public Instant getCreatedAt() { return createdAt; }
}
