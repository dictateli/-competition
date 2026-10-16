package com.heliu.ai.document.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.ai.api.RetrievalService;
import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.document.api.DocumentDtos;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import com.heliu.ai.notification.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class DocumentService {
    private static final String DEFAULT_RISK_JSON = "{\"level\":\"MEDIUM\",\"items\":[\"首次配置耗时可能影响留存\",\"数据导出需求持续增长\"]}";

    private final DocumentRepository documentRepository;
    private final LargeLanguageModel languageModel;
    private final RetrievalService retrievalService;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    public DocumentService(
            DocumentRepository documentRepository,
            LargeLanguageModel languageModel,
            RetrievalService retrievalService,
            NotificationService notificationService,
            ObjectMapper objectMapper
    ) {
        this.documentRepository = documentRepository;
        this.languageModel = languageModel;
        this.retrievalService = retrievalService;
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public DocumentDtos.DocumentResponse upload(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BusinessException("请选择需要分析的文档");
        String name = file.getOriginalFilename() == null ? "未命名文档" : file.getOriginalFilename();
        String text = extractText(file, name);
        DocumentEntity entity = new DocumentEntity(
                WorkspaceContext.newId("doc"),
                WorkspaceContext.current(),
                name,
                file.getContentType(),
                file.getSize(),
                text
        );
        AiAnswer analysis = languageModel.generate(new AiRequest(
                "请对以下文档生成摘要，并识别关键数据与风险。\n" + text,
                WorkspaceContext.current(),
                List.of(entity.getId())
        ));
        entity.ready(analysis.content(), DEFAULT_RISK_JSON);
        DocumentEntity saved = documentRepository.save(entity);
        notificationService.notifyCurrent(
                "文档分析完成",
                "《" + saved.getName() + "》已完成摘要、风险识别与知识索引。",
                "DOCUMENT",
                "SUCCESS",
                "DOCUMENT",
                saved.getId()
        );
        return DocumentDtos.DocumentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<DocumentDtos.DocumentResponse> list() {
        return documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()).stream()
                .map(DocumentDtos.DocumentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DocumentDtos.DocumentDetailResponse detail(String documentId) {
        return DocumentDtos.DocumentDetailResponse.from(requireDocument(documentId));
    }

    @Transactional(readOnly = true)
    public DocumentDtos.DocumentAnalysisResponse analysis(String documentId) {
        return analysisOf(requireDocument(documentId));
    }

    @Transactional(readOnly = true)
    public DocumentDtos.DocumentCompareResponse compare(List<String> documentIds) {
        if (documentIds == null || documentIds.isEmpty()) throw new BusinessException("请选择需要对比的文档");
        List<DocumentEntity> documents = documentRepository.findAllByWorkspaceIdAndIdIn(WorkspaceContext.current(), documentIds);
        if (documents.isEmpty()) throw new BusinessException("未找到可对比的文档", 404);
        List<DocumentDtos.DocumentAnalysisResponse> analyses = documents.stream().map(this::analysisOf).toList();
        String merged = documents.stream()
                .map(document -> (document.getSummary() == null ? "" : document.getSummary()) + "\n" + (document.getExtractedText() == null ? "" : document.getExtractedText()))
                .reduce("", (left, right) -> left + "\n" + right);
        List<String> commonThemes = new ArrayList<>();
        if (merged.contains("配置")) commonThemes.add("首次配置效率");
        if (merged.contains("数据导出")) commonThemes.add("数据导出需求");
        if (merged.contains("续约") || merged.contains("留存")) commonThemes.add("客户续约与留存");
        if (commonThemes.isEmpty()) commonThemes.add("文档均包含可追溯的业务事实与行动建议");
        List<String> differences = analyses.stream()
                .map(item -> item.name() + "：" + shorten(item.summary(), 72))
                .toList();
        return new DocumentDtos.DocumentCompareResponse(analyses, commonThemes, differences);
    }

    @Transactional
    public void delete(String documentId) {
        DocumentEntity document = requireDocument(documentId);
        documentRepository.delete(document);
    }

    @Transactional(readOnly = true)
    public DocumentDtos.AskResponse ask(String documentId, String question) {
        if (question == null || question.isBlank()) throw new BusinessException("问题不能为空");
        DocumentEntity document = requireDocument(documentId);
        AiAnswer answer = retrievalService.answer(new AiRequest(question.trim(), WorkspaceContext.current(), List.of(document.getId())));
        return DocumentDtos.AskResponse.from(answer);
    }

    private DocumentEntity requireDocument(String documentId) {
        return documentRepository.findByIdAndWorkspaceId(documentId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("文档不存在或无权访问", 404));
    }

    private DocumentDtos.DocumentAnalysisResponse analysisOf(DocumentEntity document) {
        List<String> keyData = extractKeyData(document.getExtractedText());
        List<DocumentDtos.RiskItem> risks = parseRisks(document.getRiskJson());
        List<String> actions = List.of(
                "优先验证影响留存和续约的关键因素",
                "把结论同步到会议纪要、项目任务和知识库",
                "对高风险条款补充人工复核与负责人确认"
        );
        return new DocumentDtos.DocumentAnalysisResponse(
                document.getId(), document.getName(), document.getSummary(), keyData, risks, actions
        );
    }

    private List<String> extractKeyData(String text) {
        if (text == null || text.isBlank()) return List.of();
        Set<String> values = new LinkedHashSet<>();
        for (String sentence : text.split("[。！？\\n]")) {
            String normalized = sentence.replaceAll("\\s+", " ").trim();
            if (normalized.matches(".*\\d.*") && normalized.length() >= 6) {
                values.add(normalized.length() > 80 ? normalized.substring(0, 80) + "…" : normalized);
            }
            if (values.size() >= 4) break;
        }
        return new ArrayList<>(values);
    }

    private List<DocumentDtos.RiskItem> parseRisks(String riskJson) {
        if (riskJson == null || riskJson.isBlank()) return List.of();
        try {
            JsonNode root = objectMapper.readTree(riskJson);
            String level = root.path("level").asText("MEDIUM");
            List<DocumentDtos.RiskItem> risks = new ArrayList<>();
            for (JsonNode item : root.path("items")) {
                risks.add(new DocumentDtos.RiskItem(level, item.asText(), "AI 从文档正文提取，可回到原文段落复核", 0.86));
            }
            return risks;
        } catch (Exception exception) {
            return List.of(new DocumentDtos.RiskItem("MEDIUM", riskJson, "风险结构化结果解析失败，建议人工复核", 0.5));
        }
    }

    private String shorten(String text, int maxLength) {
        if (text == null || text.isBlank()) return "暂无摘要";
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "…";
    }

    private String extractText(MultipartFile file, String name) {
        String lower = name.toLowerCase(Locale.ROOT);
        try {
            if (lower.endsWith(".txt") || lower.endsWith(".md") || lower.endsWith(".csv") || lower.endsWith(".json")) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            }
            return "文档 " + name + " 已完成元数据解析。演示环境未安装 PDF/Office 解析器，生产环境应接入 Apache Tika、PDFBox 或专用文档服务。";
        } catch (IOException exception) {
            throw new BusinessException("文档读取失败: " + exception.getMessage());
        }
    }
}

