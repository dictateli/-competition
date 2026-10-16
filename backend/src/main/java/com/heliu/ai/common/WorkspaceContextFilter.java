package com.heliu.ai.common;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class WorkspaceContextFilter extends OncePerRequestFilter {
    public static final String HEADER = "X-Workspace-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        TraceId.reset();
        String workspaceId = request.getHeader(HEADER);
        WorkspaceContext.set(workspaceId == null || workspaceId.isBlank() ? WorkspaceContext.DEFAULT_WORKSPACE : workspaceId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            WorkspaceContext.clear();
            TraceId.clear();
        }
    }
}
