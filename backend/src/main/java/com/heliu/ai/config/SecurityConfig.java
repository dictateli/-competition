package com.heliu.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * 跨域等与环境无关的安全基础设施。
 * 具体的放行策略按环境拆分：dev/demo 见 {@link DevSecurityConfig}，prod 见 {@link ProdSecurityConfig}。
 */
@Configuration
public class SecurityConfig {
    private final List<String> allowedOrigins;

    public SecurityConfig(@Value("${heliu.security.allowed-origins:*}") List<String> allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("X-Trace-Id"));
        // 前端以 fetch 直连、不依赖 Cookie，因此关闭凭据，
        // 避免「允许任意来源」与「允许携带凭据」同时出现的安全隐患。
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
