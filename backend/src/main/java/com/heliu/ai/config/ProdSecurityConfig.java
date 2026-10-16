package com.heliu.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * 生产环境（profile = prod）：默认拒绝，接口需要认证，并收敛管理端点与接口文档。
 * 当前使用 HTTP Basic + 环境变量中的账号密码作为占位实现，
 * 正式部署应替换为 OAuth2 / OIDC + JWT，详见 docs/architecture.md 的安全与合规章节。
 */
@Configuration
@Profile("prod")
public class ProdSecurityConfig {
    @Bean
    SecurityFilterChain prodSecurityFilterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.frameOptions(frame -> frame.deny()));
        return http.build();
    }
}
