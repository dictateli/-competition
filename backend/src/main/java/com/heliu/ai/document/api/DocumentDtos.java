package com.heliu.ai.document.api;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.document.domain.DocumentEntity;

import java.time.Instant;
import java.util.List;

public final class DocumentDtos {
    private DocumentDtos() {}

    public record DocumentResponse(
            String id,
            String name,
            String contentType,
            long sizeBytes,
            String status,
            String summary,
            Instant createdAt
    ) {
        public static DocumentResponse from(DocumentEntity entity) {
            return new DocumentResponse(
                    entity.getId(), entity.getName(), entity.getContentType(), entity.getSizeBytes(),
                    entity.getStatus().name(), entity.getSummary(), entity.getCreatedAt()
            );
        }
    }

    public record DocumentDetailResponse(
            String id,
            String name,
            String contentType,
            long sizeBytes,
            String status,
            String summary,
            String extractedText,
            Instant createdAt
    ) {
        public static DocumentDetailResponse from(DocumentEntity entity) {
            return new DocumentDetailResponse(
                    entity.getId(), entity.getName(), entity.getContentType(), entity.getSizeBytes(),
                    entity.getStatus().name(), entity.getSummary(), entity.getExtractedText(), entity.getCreatedAt()
            );
        }
    }

    public record DocumentAnalysisResponse(
            String documentId,
            String name,
            String summary,
            List<String> keyData,
            List<RiskItem> risks,
            List<String> actions
    ) {}

    public record RiskItem(String level, String title, String evidence, double confidence) {}

    public record DocumentCompareResponse(List<DocumentAnalysisResponse> documents, List<String> commonThemes, List<String> differences) {}

    public record AskRequest(String question) {}

    public record AskResponse(String answer, String model, List<CitationResponse> citations) {
        public static AskResponse from(AiAnswer answer) {
            List<CitationResponse> citations = answer.citations().stream()
                    .map(citation -> new CitationResponse(citation.sourceId(), citation.sourceName(), citation.location(), citation.score()))
                    .toList();
            return new AskResponse(answer.content(), answer.model(), citations);
        }
    }

    public record CitationResponse(String sourceId, String sourceName, String location, double score) {}
}
