package com.heliu.ai.knowledge.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.knowledge.service.KnowledgeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class GlobalSearchController {
    private final KnowledgeService knowledgeService;

    public GlobalSearchController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping
    public ApiResponse<KnowledgeDtos.SearchResponse> search(
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.ok(knowledgeService.search(query, limit));
    }
}
