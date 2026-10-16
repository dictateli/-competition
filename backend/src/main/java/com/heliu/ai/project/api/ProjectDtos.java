package com.heliu.ai.project.api;

import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.ProjectStatus;
import com.heliu.ai.project.domain.TaskEntity;
import com.heliu.ai.project.domain.TaskPriority;
import com.heliu.ai.project.domain.TaskStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class ProjectDtos {
    private ProjectDtos() {}

    public record CreateProjectRequest(
            @NotBlank String name,
            String description,
            String owner,
            LocalDate startDate,
            LocalDate dueDate
    ) {}

    public record UpdateProjectRequest(
            String name,
            String description,
            String owner,
            ProjectStatus status,
            LocalDate startDate,
            LocalDate dueDate
    ) {}

    public record ProjectResponse(
            String id,
            String name,
            String description,
            String owner,
            String status,
            int progress,
            LocalDate startDate,
            LocalDate dueDate,
            Instant createdAt,
            Instant updatedAt,
            int totalTasks,
            int doneTasks,
            int riskTasks
    ) {
        public static ProjectResponse from(ProjectEntity entity, int totalTasks, int doneTasks, int riskTasks) {
            return new ProjectResponse(
                    entity.getId(), entity.getName(), entity.getDescription(), entity.getOwner(),
                    entity.getStatus().name(), entity.getProgress(), entity.getStartDate(), entity.getDueDate(),
                    entity.getCreatedAt(), entity.getUpdatedAt(), totalTasks, doneTasks, riskTasks
            );
        }
    }

    public record CreateTaskRequest(
            @NotBlank String title,
            String description,
            @NotBlank String owner,
            TaskPriority priority,
            LocalDate dueDate,
            List<String> dependencyIds,
            Boolean milestone
    ) {
        public CreateTaskRequest {
            dependencyIds = dependencyIds == null ? List.of() : List.copyOf(dependencyIds);
        }
    }

    public record ChangeStatusRequest(TaskStatus status) {}

    public record TaskResponse(
            String id,
            String projectId,
            String title,
            String description,
            String owner,
            String status,
            String priority,
            LocalDate dueDate,
            int riskScore,
            boolean milestone,
            List<String> dependencyIds,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static TaskResponse from(TaskEntity entity) {
            return new TaskResponse(
                    entity.getId(), entity.getProjectId(), entity.getTitle(), entity.getDescription(),
                    entity.getOwner(), entity.getStatus().name(), entity.getPriority().name(), entity.getDueDate(),
                    entity.getRiskScore(), entity.isMilestone(), entity.getDependencyIds(),
                    entity.getCreatedAt(), entity.getUpdatedAt()
            );
        }
    }

    public record RiskResponse(String taskId, String title, String owner, int score, String level, List<String> reasons) {}

    public record WorkloadResponse(
            String owner,
            int totalTasks,
            int activeTasks,
            int urgentTasks,
            int doneTasks,
            int loadPercent,
            String suggestion
    ) {}
}
