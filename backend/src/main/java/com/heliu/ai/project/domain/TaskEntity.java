package com.heliu.ai.project.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "project_tasks", indexes = {
        @Index(name = "idx_task_workspace_project", columnList = "workspaceId,projectId"),
        @Index(name = "idx_task_owner", columnList = "owner")
})
public class TaskEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 64)
    private String projectId;

    @Column(nullable = false, length = 240)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 64)
    private String owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private TaskPriority priority;

    private LocalDate dueDate;

    @Column(length = 1000)
    private String dependencyIds;

    private Boolean milestone;

    @Column(nullable = false)
    private int riskScore;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    protected TaskEntity() {}

    public TaskEntity(String id, String workspaceId, String projectId, String title, String description, String owner, TaskPriority priority, LocalDate dueDate) {
        this(id, workspaceId, projectId, title, description, owner, priority, dueDate, List.of(), false);
    }

    public TaskEntity(
            String id,
            String workspaceId,
            String projectId,
            String title,
            String description,
            String owner,
            TaskPriority priority,
            LocalDate dueDate,
            List<String> dependencyIds,
            boolean milestone
    ) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.owner = owner;
        this.priority = priority == null ? TaskPriority.MEDIUM : priority;
        this.dueDate = dueDate;
        this.dependencyIds = dependencyIds == null || dependencyIds.isEmpty() ? null : String.join(",", dependencyIds);
        this.milestone = milestone;
        this.status = TaskStatus.TODO;
        this.riskScore = 0;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void changeStatus(TaskStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getProjectId() { return projectId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getOwner() { return owner; }
    public TaskStatus getStatus() { return status; }
    public TaskPriority getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public List<String> getDependencyIds() {
        return dependencyIds == null || dependencyIds.isBlank() ? List.of() : List.of(dependencyIds.split(","));
    }
    public boolean isMilestone() { return Boolean.TRUE.equals(milestone); }
    public int getRiskScore() { return riskScore; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
