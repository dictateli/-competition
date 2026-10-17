package com.heliu.ai.config;

import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.identity.domain.UserEntity;
import com.heliu.ai.identity.service.TokenStore;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
public class AuthConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 解析 Authorization: Bearer <token>，把用户写进 SecurityContext 和 WorkspaceContext。
     */
    @Bean
    public OncePerRequestFilter tokenAuthenticationFilter(TokenStore tokenStore) {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                    throws ServletException, IOException {
                String auth = request.getHeader("Authorization");
                if (auth != null && auth.startsWith("Bearer ")) {
                    String token = auth.substring(7).trim();
                    tokenStore.lookup(token).ifPresent(user -> {
                        WorkspaceContext.set(user.getWorkspaceId());
                        UsernamePasswordAuthenticationToken principal = new UsernamePasswordAuthenticationToken(
                                user.getUsername(), null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
                        principal.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(principal);
                    });
                }
                try {
                    chain.doFilter(request, response);
                } finally {
                    WorkspaceContext.clear();
                }
            }
        };
    }
}
