package com.heliu.ai.project.service;

import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.project.api.ProjectDtos;
import com.heliu.ai.project.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    public ProjectService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            NotificationService notificationService
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectResponse> listProjects() {
        return projectRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDtos.ProjectResponse getProject(String projectId) {
        return toResponse(requireProject(projectId));
    }

    @Transactional
    public ProjectDtos.ProjectResponse createProject(ProjectDtos.CreateProjectRequest request) {
        ProjectEntity entity = new ProjectEntity(
                WorkspaceContext.newId("project"),
                WorkspaceContext.current(),
                request.name().trim(),
                request.description(),
                request.owner() == null || request.owner().isBlank() ? "林然" : request.owner().trim(),
                request.startDate() == null ? LocalDate.now() : request.startDate(),
                request.dueDate() == null ? LocalDate.now().plusDays(30) : request.dueDate()
        );
        return toResponse(projectRepository.save(entity));
    }

    @Transactional
    public ProjectDtos.ProjectResponse updateProject(String projectId, ProjectDtos.UpdateProjectRequest request) {
        ProjectEntity entity = requireProject(projectId);
        entity.update(
                request.name(),
                request.description(),
                request.owner(),
                request.status(),
                request.startDate(),
                request.dueDate()
        );
        return toResponse(projectRepository.save(entity));
    }

    @Transactional
    public ProjectEntity ensureProject(String projectId, String name) {
        return projectRepository.findByIdAndWorkspaceId(projectId, WorkspaceContext.current())
                .orElseGet(() -> projectRepository.save(new ProjectEntity(
                        projectId,
                        WorkspaceContext.current(),
                        name == null || name.isBlank() ? projectId : name,
                        "由会议行动项自动创建的项目上下文",
                        "林然",
                        LocalDate.now(),
                        LocalDate.now().plusDays(30)
                )));
    }

    @Transactional
    public ProjectDtos.TaskResponse createTask(String projectId, ProjectDtos.CreateTaskRequest request) {
        ensureProject(projectId, projectId);
        TaskEntity task = new TaskEntity(
                WorkspaceContext.newId("task"),
                WorkspaceContext.current(),
                projectId,
                request.title().trim(),
                request.description(),
                request.owner().trim(),
                request.priority(),
                request.dueDate(),
                request.dependencyIds(),
                Boolean.TRUE.equals(request.milestone())
        );
        Risk risk = calculateRisk(task);
        task.setRiskScore(risk.score());
        TaskEntity saved = taskRepository.save(task);
        refreshProjectMetrics(projectId);
        if (risk.score() >= 60) {
            notificationService.notifyCurrent(
                    "发现高风险任务",
                    saved.getTitle() + "：" + String.join("、", risk.reasons()),
                    "RISK",
                    risk.score() >= 80 ? "HIGH" : "MEDIUM",
                    "TASK",
                    saved.getId()
            );
        }
        return ProjectDtos.TaskResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public ProjectDtos.TaskResponse getTask(String taskId) {
        return ProjectDtos.TaskResponse.from(taskRepository.findByIdAndWorkspaceId(taskId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("任务不存在或无权访问", 404)));
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.TaskResponse> list(String projectId) {
        requireProjectIfPresent(projectId);
        return taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), projectId).stream()
                .map(ProjectDtos.TaskResponse::from)
                .toList();
    }

    @Transactional
    public ProjectDtos.TaskResponse changeStatus(String taskId, TaskStatus status) {
        if (status == null) throw new BusinessException("任务状态不能为空");
        TaskEntity task = taskRepository.findByIdAndWorkspaceId(taskId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("任务不存在或无权访问", 404));
        task.changeStatus(status);
        task.setRiskScore(calculateRisk(task).score());
        TaskEntity saved = taskRepository.save(task);
        refreshProjectMetrics(saved.getProjectId());
        return ProjectDtos.TaskResponse.from(saved);
    }

    @Transactional
    public List<ProjectDtos.RiskResponse> risks(String projectId) {
        return taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), projectId).stream()
                .map(task -> {
                    Risk risk = calculateRisk(task);
                    task.setRiskScore(risk.score());
                    taskRepository.save(task);
                    return new ProjectDtos.RiskResponse(task.getId(), task.getTitle(), task.getOwner(), risk.score(), risk.level(), risk.reasons());
                })
                .filter(risk -> risk.score() > 0)
                .sorted(Comparator.comparingInt(ProjectDtos.RiskResponse::score).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.WorkloadResponse> workload(String projectId) {
        List<TaskEntity> tasks = taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), projectId);
        Map<String, List<TaskEntity>> grouped = tasks.stream().collect(Collectors.groupingBy(TaskEntity::getOwner, LinkedHashMap::new, Collectors.toList()));
        return grouped.entrySet().stream()
                .map(entry -> {
                    List<TaskEntity> ownerTasks = entry.getValue();
                    long active = ownerTasks.stream().filter(task -> task.getStatus() != TaskStatus.DONE).count();
                    long urgent = ownerTasks.stream().filter(task -> task.getPriority() == TaskPriority.URGENT && task.getStatus() != TaskStatus.DONE).count();
                    long done = ownerTasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
                    int load = (int) Math.min(130, active * 18 + urgent * 15 + ownerTasks.size() * 4);
                    String suggestion = load > 100
                            ? "负荷过高，建议转移 1 项低优先级任务"
                            : load < 70 ? "负荷健康，可承接额外协调工作" : "负荷适中，建议关注临近截止任务";
                    return new ProjectDtos.WorkloadResponse(entry.getKey(), ownerTasks.size(), (int) active, (int) urgent, (int) done, load, suggestion);
                })
                .sorted(Comparator.comparingInt(ProjectDtos.WorkloadResponse::loadPercent).reversed())
                .toList();
    }

    private void refreshProjectMetrics(String projectId) {
        ProjectEntity project = projectRepository.findByIdAndWorkspaceId(projectId, WorkspaceContext.current()).orElse(null);
        if (project == null) return;
        List<TaskEntity> tasks = taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), projectId);
        if (tasks.isEmpty()) {
            project.updateMetrics(0, ProjectStatus.PLANNING);
            projectRepository.save(project);
            return;
        }
        long done = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long riskCount = tasks.stream().filter(task -> calculateRisk(task).score() >= 60).count();
        int progress = (int) Math.round(done * 100.0 / tasks.size());
        ProjectStatus status = progress == 100 ? ProjectStatus.COMPLETED : riskCount >= 2 ? ProjectStatus.AT_RISK : ProjectStatus.ACTIVE;
        project.updateMetrics(progress, status);
        projectRepository.save(project);
    }

    private ProjectDtos.ProjectResponse toResponse(ProjectEntity project) {
        List<TaskEntity> tasks = taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), project.getId());
        long done = tasks.stream().filter(task -> task.getStatus() == TaskStatus.DONE).count();
        long risks = tasks.stream().filter(task -> calculateRisk(task).score() >= 60).count();
        return ProjectDtos.ProjectResponse.from(project, tasks.size(), (int) done, (int) risks);
    }

    private ProjectEntity requireProject(String projectId) {
        return projectRepository.findByIdAndWorkspaceId(projectId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("项目不存在或无权访问", 404));
    }

    private void requireProjectIfPresent(String projectId) {
        if (projectRepository.findByIdAndWorkspaceId(projectId, WorkspaceContext.current()).isEmpty()
                && taskRepository.findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(WorkspaceContext.current(), projectId).isEmpty()) {
            throw new BusinessException("项目不存在或无权访问", 404);
        }
    }

    private Risk calculateRisk(TaskEntity task) {
        if (task.getStatus() == TaskStatus.DONE) return new Risk(0, "LOW", List.of());
        int score = 0;
        List<String> reasons = new ArrayList<>();
        LocalDate today = LocalDate.now();
        if (task.getDueDate() != null) {
            long days = ChronoUnit.DAYS.between(today, task.getDueDate());
            if (days < 0) {
                score += 55;
                reasons.add("已逾期 " + Math.abs(days) + " 天");
            } else if (days <= 2) {
                score += 30;
                reasons.add("将在 " + days + " 天内到期");
            }
        }
        if (task.getPriority() == TaskPriority.URGENT) {
            score += 30;
            reasons.add("紧急优先级");
        } else if (task.getPriority() == TaskPriority.HIGH) {
            score += 18;
            reasons.add("高优先级");
        }
        if (task.getStatus() == TaskStatus.BLOCKED) {
            score += 35;
            reasons.add("任务处于阻塞状态");
        }
        if (task.getDescription() != null && (task.getDescription().contains("缺少") || task.getDescription().contains("依赖"))) {
            score += 15;
            reasons.add("描述中存在缺失数据或外部依赖");
        }
        for (String dependencyId : task.getDependencyIds()) {
            TaskEntity dependency = taskRepository.findByIdAndWorkspaceId(dependencyId, WorkspaceContext.current()).orElse(null);
            if (dependency == null) {
                score += 20;
                reasons.add("依赖任务不存在或不可访问");
            } else if (dependency.getStatus() != TaskStatus.DONE) {
                score += 25;
                reasons.add("受依赖任务「" + dependency.getTitle() + "」阻塞");
            }
        }
        score = Math.min(100, score);
        String level = score >= 70 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";
        return new Risk(score, level, reasons);
    }

    private record Risk(int score, String level, List<String> reasons) {}
}
