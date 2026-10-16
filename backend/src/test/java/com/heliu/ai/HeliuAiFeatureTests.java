package com.heliu.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "heliu.seed-demo-data=false",
        "spring.datasource.url=jdbc:h2:mem:heliu-feature-test;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class HeliuAiFeatureTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void writingDraftCanBeCreatedUpdatedAndLoaded() throws Exception {
        String workspace = "ws-writing-test";
        String created = mockMvc.perform(post("/api/v1/writing/drafts")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"项目复盘\",\"content\":\"第一版内容\",\"style\":\"专业\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").isNotEmpty())
                .andReturn().getResponse().getContentAsString();
        String id = objectMapper.readTree(created).path("data").path("id").asText();

        mockMvc.perform(patch("/api/v1/writing/drafts/{id}", id)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"项目复盘 V2\",\"content\":\"更新后的内容\",\"style\":\"克制\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("项目复盘 V2"));

        mockMvc.perform(get("/api/v1/writing/drafts")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].content").value("更新后的内容"));
    }

    @Test
    void copilotCanCreateTaskAndReturnCitations() throws Exception {
        String workspace = "ws-copilot-test";
        mockMvc.perform(get("/api/v1/dashboard").header("X-Workspace-Id", workspace)).andExpect(status().isOk());

        mockMvc.perform(post("/api/v1/copilot/chat")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"创建任务：验证 Copilot 创建任务闭环\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.answer").isNotEmpty())
                .andExpect(jsonPath("$.data.action.type").value("task_created"))
                .andExpect(jsonPath("$.data.action.taskId").isNotEmpty());
    }

    @Test
    void knowledgeGraphBuildsNodesAndEdgesFromBusinessData() throws Exception {
        String workspace = "ws-graph-test";
        mockMvc.perform(post("/api/v1/projects")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"图谱项目\",\"owner\":\"林然\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/v1/projects/project-graph/tasks")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"图谱任务\",\"owner\":\"周可\",\"priority\":\"HIGH\",\"dueDate\":\"2026-12-31\"}"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/knowledge/graph")
                        .param("depth", "2")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nodeCount").isNumber())
                .andExpect(jsonPath("$.data.edgeCount").isNumber())
                .andExpect(jsonPath("$.data.nodes").isArray())
                .andExpect(jsonPath("$.data.edges").isArray());
    }
}
