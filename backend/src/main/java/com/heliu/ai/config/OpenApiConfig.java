package com.heliu.ai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenAPI heliuOpenApi() {
        return new OpenAPI().info(new Info()
                .title("合流 AI 后端 API")
                .description("工作台、会议行动项、文档 RAG、项目风险、知识中枢、通知、自动化工作流和 AI 写作服务")
                .version("1.0.0"));
    }
}
