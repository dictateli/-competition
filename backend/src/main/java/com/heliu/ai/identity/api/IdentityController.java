package com.heliu.ai.identity.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.identity.domain.UserEntity;
import com.heliu.ai.identity.domain.UserRepository;
import com.heliu.ai.identity.service.TokenStore;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {
    private static final List<String> DEFAULT_PERMISSIONS = List.of(
            "dashboard:read", "meeting:write", "document:write", "project:write", "workflow:write"
    );

    private final UserRepository userRepository;
    private final TokenStore tokenStore;
    private final PasswordEncoder passwordEncoder;

    public IdentityController(UserRepository userRepository, TokenStore tokenStore, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenStore = tokenStore;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@RequestHeader(value = "Authorization", required = false) String auth) {
        return ApiResponse.ok(currentUser(requireToken(auth)));
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
        if (request == null || request.username() == null || request.username().isBlank()) {
            throw new BusinessException("请输入账号");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new BusinessException("请输入密码");
        }
        UserEntity user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new BusinessException("账号或密码错误", 401));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BusinessException("账号或密码错误", 401);
        }
        String token = tokenStore.issue(user);
        return ApiResponse.ok(new LoginResponse(token, toResponse(user), DEFAULT_PERMISSIONS));
    }

    @PostMapping("/auth/logout")
    public ApiResponse<Void> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        tokenStore.revoke(rawToken(auth));
        return ApiResponse.ok(null);
    }

    @PostMapping("/auth/register")
    public ApiResponse<LoginResponse> register(@RequestBody RegisterRequest request) {
        if (request == null || request.username() == null || request.username().isBlank()) {
            throw new BusinessException("请输入账号");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new BusinessException("密码至少 6 位");
        }
        if (userRepository.existsByUsername(request.username().trim())) {
            throw new BusinessException("账号已被占用", 409);
        }
        String name = request.name() == null || request.name().isBlank() ? request.username().trim() : request.name().trim();
        UserEntity user = new UserEntity(
                "user-" + java.util.UUID.randomUUID().toString().substring(0, 8),
                WorkspaceContext.DEFAULT_WORKSPACE,
                request.username().trim(),
                passwordEncoder.encode(request.password()),
                name,
                request.role() == null || request.role().isBlank() ? "成员" : request.role().trim(),
                request.email()
        );
        userRepository.save(user);
        String token = tokenStore.issue(user);
        return ApiResponse.ok(new LoginResponse(token, toResponse(user), DEFAULT_PERMISSIONS));
    }

    private String requireToken(String auth) {
        String raw = rawToken(auth);
        return tokenStore.lookup(raw)
                .map(UserEntity::getUsername)
                .orElseThrow(() -> new BusinessException("未登录或登录已过期", 401));
    }

    private String rawToken(String auth) {
        if (auth == null) return null;
        if (auth.startsWith("Bearer ")) return auth.substring(7).trim();
        return auth.trim();
    }

    private UserResponse currentUser(String username) {
        return userRepository.findByUsername(username)
                .map(this::toResponse)
                .orElseGet(() -> new UserResponse("user-linran", username, "产品负责人", "linran@heliu.ai", WorkspaceContext.current()));
    }

    private UserResponse toResponse(UserEntity user) {
        return new UserResponse(user.getId(), user.getName(), user.getRole(), user.getEmail(), user.getWorkspaceId());
    }

    public record LoginRequest(String username, String password) {}
    public record RegisterRequest(String username, String password, String name, String role, String email) {}
    public record LoginResponse(String token, UserResponse user, List<String> permissions) {}
    public record UserResponse(String id, String name, String role, String email, String workspaceId) {}
    public record WorkspaceResponse(String id, String name, String meta, boolean current) {}
}
