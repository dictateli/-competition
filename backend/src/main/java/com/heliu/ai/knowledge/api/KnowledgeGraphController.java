package com.heliu.ai.knowledge.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.knowledge.service.KnowledgeGraphService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/knowledge/graph")
public class KnowledgeGraphController {
    private final KnowledgeGraphService service;

    public KnowledgeGraphController(KnowledgeGraphService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<KnowledgeGraphDtos.GraphResponse> graph(
            @RequestParam(required = false) String focusId,
            @RequestParam(defaultValue = "2") int depth,
            @RequestParam(required = false) String types
    ) {
        return ApiResponse.ok(service.graph(focusId, depth, types));
    }

    @PostMapping("/refresh")
    public ApiResponse<Void> refresh() {
        service.refresh();
        return ApiResponse.ok(null);
    }
}
