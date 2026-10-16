package com.heliu.ai.ai.deepseek;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiCitation;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.common.BusinessException;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DeepSeekLargeLanguageModel implements LargeLanguageModel {
    private final ObjectMapper objectMapper;
    private final RestClient client;
    private final String model;

    public DeepSeekLargeLanguageModel(ObjectMapper objectMapper, String baseUrl, String apiKey, String model) {
        this.objectMapper = objectMapper;
        this.model = model == null || model.isBlank() ? "deepseek-chat" : model;
        this.client = RestClient.builder()
                .baseUrl(baseUrl == null || baseUrl.isBlank() ? "https://api.deepseek.com" : baseUrl.replaceAll("/+$", ""))
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Override
    public AiAnswer generate(AiRequest request) {
        String prompt = request == null || request.prompt() == null ? "" : request.prompt();
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", "你是合流 AI 协同办公助手。请使用简洁、专业的中文回答；只基于给定上下文，无法确认时明确说明。"),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.3,
                "stream", false
        );
        try {
            String raw = client.post()
                    .uri("/chat/completions")
                    .body(body)
                    .retrieve()
                    .body(String.class);
            JsonNode root = objectMapper.readTree(raw == null ? "{}" : raw);
            JsonNode contentNode = root.path("choices").path(0).path("message").path("content");
            String content = contentNode.isMissingNode() ? "" : contentNode.asText();
            if (content.isBlank()) throw new BusinessException("DeepSeek 未返回有效内容", 502);
            List<AiCitation> citations = new ArrayList<>();
            List<String> contextIds = request == null ? List.of() : request.contextIds();
            for (int i = 0; i < contextIds.size(); i++) {
                String id = contextIds.get(i);
                citations.add(new AiCitation(id, id, "上下文引用", Math.max(0.5, 0.9 - i * 0.08)));
            }
            return new AiAnswer(content, root.path("model").asText(model), citations);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BusinessException("DeepSeek 调用失败：" + exception.getMessage(), 502);
        }
    }
}
