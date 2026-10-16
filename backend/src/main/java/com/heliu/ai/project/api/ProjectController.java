package com.heliu.ai.project.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.project.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProjectController {
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public ApiResponse<List<ProjectDtos.ProjectResponse>> projects() {
        return ApiResponse.ok(projectService.listProjects());
    }

    @PostMapping("/projects")
    public ApiResponse<ProjectDtos.ProjectResponse> createProject(@Valid @RequestBody ProjectDtos.CreateProjectRequest request) {
        return ApiResponse.ok(projectService.createProject(request));
    }

    @GetMapping("/projects/{projectId}")
    public ApiResponse<ProjectDtos.ProjectResponse> project(@PathVariable String projectId) {
        return ApiResponse.ok(projectService.getProject(projectId));
    }

    @PatchMapping("/projects/{projectId}")
    public ApiResponse<ProjectDtos.ProjectResponse> updateProject(
            @PathVariable String projectId,
            @RequestBody ProjectDtos.UpdateProjectRequest request
    ) {
        return ApiResponse.ok(projectService.updateProject(projectId, request));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ApiResponse<List<ProjectDtos.TaskResponse>> tasks(@PathVariable String projectId) {
        return ApiResponse.ok(projectService.list(projectId));
    }

    @PostMapping("/projects/{projectId}/tasks")
    public ApiResponse<ProjectDtos.TaskResponse> create(@PathVariable String projectId, @Valid @RequestBody ProjectDtos.CreateTaskRequest request) {
        return ApiResponse.ok(projectService.createTask(projectId, request));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ApiResponse<ProjectDtos.TaskResponse> changeStatus(@PathVariable String taskId, @RequestBody ProjectDtos.ChangeStatusRequest request) {
        return ApiResponse.ok(projectService.changeStatus(taskId, request.status()));
    }

    @GetMapping("/projects/{projectId}/risks")
    public ApiResponse<List<ProjectDtos.RiskResponse>> risks(@PathVariable String projectId) {
        return ApiResponse.ok(projectService.risks(projectId));
    }

    @GetMapping("/projects/{projectId}/workload")
    public ApiResponse<List<ProjectDtos.WorkloadResponse>> workload(@PathVariable String projectId) {
        return ApiResponse.ok(projectService.workload(projectId));
    }
}
