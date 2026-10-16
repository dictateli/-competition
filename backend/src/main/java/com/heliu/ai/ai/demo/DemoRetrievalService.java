package com.heliu.ai.ai.demo;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiCitation;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.RetrievalService;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
public class DemoRetrievalService implements RetrievalService {
    private final DocumentRepository documentRepository;

    public DemoRetrievalService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AiAnswer answer(AiRequest request) {
        List<DocumentEntity> documents = request.contextIds().isEmpty()
                ? List.of()
                : documentRepository.findAllById(request.contextIds());
        if (documents.isEmpty()) {
            return new AiAnswer("当前知识库中还没有可检索的文档。请先上传资料，我会基于原文页码或段落提供可追溯回答。", "demo-rag-v1", List.of());
        }

        String question = request.prompt() == null ? "" : request.prompt();
        DocumentEntity best = documents.stream()
                .max(Comparator.comparingInt(document -> score(question, document.getExtractedText())))
                .orElse(documents.get(0));
        String excerpt = excerpt(best.getExtractedText(), question);
        String content = "根据《" + best.getName() + "》：\n\n" + excerpt + "\n\n结论：" + synthesize(question, excerpt);
        List<AiCitation> citations = documents.stream()
                .limit(3)
                .map(document -> new AiCitation(document.getId(), document.getName(), "解析全文 · 段落 1", score(question, document.getExtractedText()) / 100.0))
                .toList();
        return new AiAnswer(content, "demo-rag-v1", citations);
    }

    private int score(String question, String text) {
        if (text == null || text.isBlank()) return 0;
        int score = 0;
        for (String token : question.replaceAll("[，。！？、,.!?\\s]+", "").split("")) {
            if (!token.isBlank() && text.contains(token)) score++;
        }
        return score;
    }

    private String excerpt(String text, String question) {
        if (text == null || text.isBlank()) return "文档正文为空。";
        String normalized = text.replaceAll("\\s+", " ").trim();
        String[] tokens = question.split("[，。！？、,.!?\\s]+");
        int index = -1;
        for (String token : tokens) {
            if (token.length() >= 2) index = normalized.indexOf(token);
            if (index >= 0) break;
        }
        if (index < 0) index = 0;
        int start = Math.max(0, index - 80);
        int end = Math.min(normalized.length(), start + 360);
        return normalized.substring(start, end) + (end < normalized.length() ? "…" : "");
    }

    private String synthesize(String question, String excerpt) {
        if (question.contains("风险") || question.contains("问题")) {
            return "当前最值得关注的是配置效率、数据导出需求和权限接入成本，建议优先验证这些因素对留存和续约的影响。";
        }
        return "该回答基于已上传文档生成，正式环境会返回页码、段落坐标和权限校验结果。";
    }
}
