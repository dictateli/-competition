package com.heliu.ai.knowledge.api;

import java.util.List;

public final class KnowledgeGraphDtos {
    private KnowledgeGraphDtos() {}

    public record Node(
            String id,
            String type,
            String title,
            String subtitle,
            String sourceId,
            double weight
    ) {}

    public record Edge(
            String id,
            String from,
            String to,
            String relation,
            double confidence,
            String evidenceId
    ) {}

    public record GraphResponse(String focusId, int depth, int nodeCount, int edgeCount, List<Node> nodes, List<Edge> edges) {}
}
