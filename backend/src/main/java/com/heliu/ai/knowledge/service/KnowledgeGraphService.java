package com.heliu.ai.knowledge.service;

import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import com.heliu.ai.knowledge.api.KnowledgeGraphDtos;
import com.heliu.ai.knowledge.domain.KnowledgeEdgeEntity;
import com.heliu.ai.knowledge.domain.KnowledgeEdgeRepository;
import com.heliu.ai.knowledge.domain.KnowledgeNodeEntity;
import com.heliu.ai.knowledge.domain.KnowledgeNodeRepository;
import com.heliu.ai.meeting.domain.MeetingEntity;
import com.heliu.ai.meeting.domain.MeetingRepository;
import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.ProjectRepository;
import com.heliu.ai.project.domain.TaskEntity;
import com.heliu.ai.project.domain.TaskRepository;
import com.heliu.ai.workflow.domain.WorkflowDefinitionEntity;
import com.heliu.ai.workflow.domain.WorkflowDefinitionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class KnowledgeGraphService {
    private final KnowledgeNodeRepository nodeRepository;
    private final KnowledgeEdgeRepository edgeRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final DocumentRepository documentRepository;
    private final MeetingRepository meetingRepository;
    private final WorkflowDefinitionRepository workflowRepository;

    public KnowledgeGraphService(
            KnowledgeNodeRepository nodeRepository,
            KnowledgeEdgeRepository edgeRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            DocumentRepository documentRepository,
            MeetingRepository meetingRepository,
            WorkflowDefinitionRepository workflowRepository
    ) {
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.documentRepository = documentRepository;
        this.meetingRepository = meetingRepository;
        this.workflowRepository = workflowRepository;
    }

    @Transactional
    public KnowledgeGraphDtos.GraphResponse graph(String focusId, int requestedDepth, String types) {
        String workspaceId = WorkspaceContext.current();
        refresh(workspaceId);
        Set<String> allowedTypes = types == null || types.isBlank()
                ? Set.of()
                : Arrays.stream(types.split(",")).map(String::trim).filter(value -> !value.isBlank()).map(String::toUpperCase).collect(Collectors.toSet());
        List<KnowledgeNodeEntity> allNodes = nodeRepository.findAllByWorkspaceId(workspaceId).stream()
                .filter(node -> allowedTypes.isEmpty() || allowedTypes.contains(node.getType()))
                .toList();
        Map<String, KnowledgeNodeEntity> nodeById = allNodes.stream().collect(Collectors.toMap(KnowledgeNodeEntity::getId, Function.identity()));
        List<KnowledgeEdgeEntity> allEdges = edgeRepository.findAllByWorkspaceId(workspaceId).stream()
                .filter(edge -> nodeById.containsKey(edge.getFromNodeId()) && nodeById.containsKey(edge.getToNodeId()))
                .toList();
        int depth = Math.max(0, Math.min(requestedDepth, 3));
        Set<String> selectedIds = selectIds(allNodes, allEdges, focusId, depth);
        List<KnowledgeNodeEntity> nodes = allNodes.stream().filter(node -> selectedIds.contains(node.getId())).limit(60).toList();
        Set<String> selected = nodes.stream().map(KnowledgeNodeEntity::getId).collect(Collectors.toSet());
        List<KnowledgeEdgeEntity> edges = allEdges.stream()
                .filter(edge -> selected.contains(edge.getFromNodeId()) && selected.contains(edge.getToNodeId()))
                .limit(120)
                .toList();
        Map<String, Long> degrees = edges.stream()
                .flatMap(edge -> java.util.stream.Stream.of(edge.getFromNodeId(), edge.getToNodeId()))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        List<KnowledgeGraphDtos.Node> nodeResponses = nodes.stream()
                .map(node -> new KnowledgeGraphDtos.Node(
                        node.getId(), node.getType(), node.getTitle(), node.getSubtitle(), node.getSourceId(),
                        1.0 + Math.min(4, degrees.getOrDefault(node.getId(), 0L)) * 0.35
                ))
                .toList();
        List<KnowledgeGraphDtos.Edge> edgeResponses = edges.stream()
                .map(edge -> new KnowledgeGraphDtos.Edge(
                        edge.getId(), edge.getFromNodeId(), edge.getToNodeId(), edge.getRelation(), edge.getConfidence(), edge.getEvidenceId()
                ))
                .toList();
        return new KnowledgeGraphDtos.GraphResponse(focusId, depth, nodeResponses.size(), edgeResponses.size(), nodeResponses, edgeResponses);
    }

    @Transactional
    public void refresh() {
        refresh(WorkspaceContext.current());
    }

    private void refresh(String workspaceId) {
        List<ProjectEntity> projects = projectRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        Map<String, ProjectEntity> projectById = projects.stream().collect(Collectors.toMap(ProjectEntity::getId, Function.identity()));
        for (ProjectEntity project : projects) {
            KnowledgeNodeEntity projectNode = upsertNode(workspaceId, "PROJECT", project.getId(), project.getName(), project.getStatus().name());
            KnowledgeNodeEntity ownerNode = upsertNode(workspaceId, "PERSON", project.getOwner(), project.getOwner(), "项目负责人");
            upsertEdge(workspaceId, projectNode.getId(), ownerNode.getId(), "OWNED_BY", 0.95, project.getId());
        }
        List<TaskEntity> tasks = taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        for (TaskEntity task : tasks) {
            KnowledgeNodeEntity taskNode = upsertNode(workspaceId, "TASK", task.getId(), task.getTitle(), task.getStatus().name());
            ProjectEntity project = projectById.get(task.getProjectId());
            if (project != null) {
                KnowledgeNodeEntity projectNode = upsertNode(workspaceId, "PROJECT", project.getId(), project.getName(), project.getStatus().name());
                upsertEdge(workspaceId, taskNode.getId(), projectNode.getId(), "BELONGS_TO", 1.0, task.getId());
            }
            KnowledgeNodeEntity personNode = upsertNode(workspaceId, "PERSON", task.getOwner(), task.getOwner(), "任务成员");
            upsertEdge(workspaceId, taskNode.getId(), personNode.getId(), "ASSIGNED_TO", 0.96, task.getId());
        }
        for (DocumentEntity document : documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            KnowledgeNodeEntity documentNode = upsertNode(workspaceId, "DOCUMENT", document.getId(), document.getName(), document.getStatus().name());
            connectMentions(workspaceId, documentNode, projects, document.getSummary(), document.getExtractedText(), document.getId());
        }
        for (MeetingEntity meeting : meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            KnowledgeNodeEntity meetingNode = upsertNode(workspaceId, "MEETING", meeting.getId(), meeting.getTitle(), meeting.getStatus().name());
            connectMentions(workspaceId, meetingNode, projects, meeting.getSummary(), meeting.getTranscriptText(), meeting.getId());
        }
        for (WorkflowDefinitionEntity workflow : workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            KnowledgeNodeEntity workflowNode = upsertNode(workspaceId, "WORKFLOW", workflow.getId(), workflow.getName(), workflow.getTriggerType());
            connectMentions(workspaceId, workflowNode, projects, workflow.getDescription(), workflow.getPrompt() + " " + workflow.getActionsJson(), workflow.getId());
        }
    }

    private void connectMentions(String workspaceId, KnowledgeNodeEntity source, List<ProjectEntity> projects, String first, String second, String evidenceId) {
        String text = ((first == null ? "" : first) + " " + (second == null ? "" : second));
        for (ProjectEntity project : projects) {
            if (project.getName() != null && !project.getName().isBlank() && text.contains(project.getName())) {
                KnowledgeNodeEntity projectNode = upsertNode(workspaceId, "PROJECT", project.getId(), project.getName(), project.getStatus().name());
                upsertEdge(workspaceId, source.getId(), projectNode.getId(), "MENTIONS", 0.82, evidenceId);
            }
        }
    }

    private KnowledgeNodeEntity upsertNode(String workspaceId, String type, String sourceId, String title, String subtitle) {
        String safeSourceId = sourceId == null || sourceId.isBlank() ? UUID.randomUUID().toString() : sourceId;
        String nodeKey = deterministicId(type + "|" + safeSourceId);
        return nodeRepository.findByWorkspaceIdAndNodeKey(workspaceId, nodeKey).map(node -> {
            node.update(title, subtitle);
            return nodeRepository.save(node);
        }).orElseGet(() -> nodeRepository.save(new KnowledgeNodeEntity(
                deterministicId(workspaceId + "|" + nodeKey), workspaceId, nodeKey, type, title, subtitle, safeSourceId
        )));
    }

    private void upsertEdge(String workspaceId, String from, String to, String relation, double confidence, String evidenceId) {
        String edgeKey = deterministicId(from + "|" + relation + "|" + to);
        if (edgeRepository.findByWorkspaceIdAndEdgeKey(workspaceId, edgeKey).isPresent()) return;
        edgeRepository.save(new KnowledgeEdgeEntity(
                deterministicId(workspaceId + "|" + edgeKey), workspaceId, edgeKey, from, to, relation, confidence, evidenceId
        ));
    }

    private Set<String> selectIds(List<KnowledgeNodeEntity> nodes, List<KnowledgeEdgeEntity> edges, String focusId, int depth) {
        if (focusId == null || focusId.isBlank()) return nodes.stream().map(KnowledgeNodeEntity::getId).collect(Collectors.toSet());
        String start = nodes.stream()
                .filter(node -> focusId.equals(node.getId()) || focusId.equals(node.getSourceId()))
                .map(KnowledgeNodeEntity::getId)
                .findFirst().orElse(null);
        if (start == null) return nodes.stream().map(KnowledgeNodeEntity::getId).collect(Collectors.toSet());
        Map<String, Set<String>> adjacency = new HashMap<>();
        for (KnowledgeEdgeEntity edge : edges) {
            adjacency.computeIfAbsent(edge.getFromNodeId(), key -> new HashSet<>()).add(edge.getToNodeId());
            adjacency.computeIfAbsent(edge.getToNodeId(), key -> new HashSet<>()).add(edge.getFromNodeId());
        }
        Set<String> visited = new HashSet<>();
        Deque<String> queue = new ArrayDeque<>();
        Map<String, Integer> levels = new HashMap<>();
        queue.add(start);
        visited.add(start);
        levels.put(start, 0);
        while (!queue.isEmpty()) {
            String current = queue.removeFirst();
            int level = levels.getOrDefault(current, 0);
            if (level >= depth) continue;
            for (String next : adjacency.getOrDefault(current, Set.of())) {
                if (visited.add(next)) {
                    levels.put(next, level + 1);
                    queue.add(next);
                }
            }
        }
        return visited;
    }

    private String deterministicId(String value) {
        return UUID.nameUUIDFromBytes(value.getBytes(StandardCharsets.UTF_8)).toString();
    }
}

