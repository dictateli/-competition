package com.heliu.ai.identity.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.common.WorkspaceContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {
    @GetMapping("/me")
    public ApiResponse<UserResponse> me() {
        return ApiResponse.ok(currentUser());
    }

    @GetMapping("/workspaces")
    public ApiResponse<List<WorkspaceResponse>> workspaces() {
        return ApiResponse.ok(List.of(
                new WorkspaceResponse("ws-demo", "星海产品中心", "企业空间 · 24 位成员", true),
                new WorkspaceResponse("ws-growth", "增长实验室", "企业空间 · 9 位成员", false)
        ));
    }

    @GetMapping("/workspaces/current")
    public ApiResponse<WorkspaceResponse> currentWorkspace() {
        return ApiResponse.ok(new WorkspaceResponse(
                WorkspaceContext.current(), "星海产品中心", "企业空间 · 24 位成员", true
        ));
    }

    @PostMapping("/auth/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        String name = request.username() == null || request.username().isBlank() ? "林然" : request.username().trim();
        return ApiResponse.ok(new LoginResponse(
                "demo-token-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16),
                new UserResponse("user-linran", name, "产品负责人", "linran@heliu.ai", WorkspaceContext.DEFAULT_WORKSPACE),
                List.of("dashboard:read", "meeting:write", "document:write", "project:write", "workflow:write")
        ));
    }

    private UserResponse currentUser() {
        return new UserResponse("user-linran", "林然", "产品负责人", "linran@heliu.ai", WorkspaceContext.current());
    }

    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String token, UserResponse user, List<String> permissions) {}
    public record UserResponse(String id, String name, String role, String email, String workspaceId) {}
    public record WorkspaceResponse(String id, String name, String meta, boolean current) {}
}
