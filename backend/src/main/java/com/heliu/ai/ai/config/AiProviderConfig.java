package com.heliu.ai.ai.config;

import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.ai.deepseek.DeepSeekLargeLanguageModel;
import com.heliu.ai.ai.demo.DemoLargeLanguageModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiProviderConfig {
    private static final Logger log = LoggerFactory.getLogger(AiProviderConfig.class);

    @Bean
    @ConditionalOnProperty(name = "heliu.ai.provider", havingValue = "deepseek")
    public LargeLanguageModel deepSeekLargeLanguageModel(
            ObjectMapper objectMapper,
            @Value("${heliu.ai.deepseek.base-url:https://api.deepseek.com}") String baseUrl,
            @Value("${heliu.ai.deepseek.api-key:}") String apiKey,
            @Value("${heliu.ai.deepseek.model:deepseek-chat}") String model
    ) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("heliu.ai.provider=deepseek 但 DEEPSEEK_API_KEY 为空，自动降级为离线 Demo 模型");
            return new DemoLargeLanguageModel();
        }
        return new DeepSeekLargeLanguageModel(objectMapper, baseUrl, apiKey, model);
    }

    @Bean
    @ConditionalOnProperty(name = "heliu.ai.provider", havingValue = "demo", matchIfMissing = true)
    public LargeLanguageModel demoLargeLanguageModel() {
        return new DemoLargeLanguageModel();
    }
}
