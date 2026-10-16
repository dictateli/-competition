package com.heliu.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "heliu.seed-demo-data=false",
        "spring.datasource.url=jdbc:h2:mem:heliu-test;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class HeliuAiApplicationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void meetingCanBeTranscribedSummarizedAndConvertedToActions() throws Exception {
        String workspace = "ws-meeting";
        String createBody = "{\"title\":\"星海计划需求评审\"}";
        String response = mockMvc.perform(post("/api/v1/meetings")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();

        JsonNode root = objectMapper.readTree(response);
        String meetingId = root.path("data").path("id").asText();
        assertThat(meetingId).startsWith("mtg-");

        mockMvc.perform(post("/api/v1/meetings/{id}/segments", meetingId)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"speaker\":\"陈默\",\"content\":\"数据导出会影响资源排期，需要评估风险\",\"startMs\":0,\"endMs\":1800,\"confidence\":0.95}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.speaker").value("陈默"));

        mockMvc.perform(post("/api/v1/meetings/{id}/finish", meetingId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.summary").isNotEmpty())
                .andExpect(jsonPath("$.data.actionItems").isArray())
                .andExpect(jsonPath("$.data.actionItems.length()").value(2));

        mockMvc.perform(post("/api/v1/meetings/{id}/actions/convert", meetingId)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"projectId\":\"project-meeting\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].status").value("TODO"));

        mockMvc.perform(get("/api/v1/projects/project-meeting/tasks")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void overdueUrgentTaskIsReturnedByRiskRadar() throws Exception {
        String workspace = "ws-risk";
        String body = objectMapper.writeValueAsString(new TestTask(
                "补齐客户续约 ROI 数据",
                "缺少 2 项关键数据",
                "李慧",
                "URGENT",
                LocalDate.now().minusDays(2)
        ));
        mockMvc.perform(post("/api/v1/projects/project-xinghai/tasks")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.riskScore").isNumber());

        mockMvc.perform(get("/api/v1/projects/project-xinghai/risks")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].level").value("HIGH"))
                .andExpect(jsonPath("$.data[0].reasons").isArray());
    }

    @Test
    void projectLifecycleSupportsMilestonesAndWorkload() throws Exception {
        String workspace = "ws-project";
        String projectResponse = mockMvc.perform(post("/api/v1/projects")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"项目测试\",\"description\":\"验证项目生命周期\",\"owner\":\"林然\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("ACTIVE"))
                .andReturn().getResponse().getContentAsString();
        String projectId = objectMapper.readTree(projectResponse).path("data").path("id").asText();

        String taskResponse = mockMvc.perform(post("/api/v1/projects/{id}/tasks", projectId)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"完成里程碑\",\"description\":\"验证依赖与风险计算\",\"owner\":\"陈默\",\"priority\":\"HIGH\",\"dueDate\":\"" + LocalDate.now().plusDays(1) + "\",\"milestone\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.milestone").value(true))
                .andReturn().getResponse().getContentAsString();
        String taskId = objectMapper.readTree(taskResponse).path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/projects/{id}/workload", projectId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].owner").value("陈默"))
                .andExpect(jsonPath("$.data[0].loadPercent").isNumber());

        mockMvc.perform(patch("/api/v1/tasks/{id}/status", taskId)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DONE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("DONE"));

        mockMvc.perform(get("/api/v1/projects/{id}", projectId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.progress").value(100))
                .andExpect(jsonPath("$.data.status").value("COMPLETED"));
    }

    @Test
    void documentAnalysisKnowledgeSearchAndNotificationsWork() throws Exception {
        String workspace = "ws-knowledge";
        byte[] content = "本季度反馈增长 23%，首次配置流失率 28%。数据导出需求增长 180%，续约概率提升至 84%。"
                .getBytes(StandardCharsets.UTF_8);
        String uploadResponse = mockMvc.perform(multipart("/api/v1/documents")
                        .file(new MockMultipartFile("file", "客户反馈分析.txt", "text/plain", content))
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("READY"))
                .andReturn().getResponse().getContentAsString();
        String documentId = objectMapper.readTree(uploadResponse).path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/documents/{id}/analysis", documentId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.keyData").isArray())
                .andExpect(jsonPath("$.data.risks").isArray())
                .andExpect(jsonPath("$.data.actions").isArray());

        mockMvc.perform(get("/api/v1/knowledge/search")
                        .param("q", "续约")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").isNumber())
                .andExpect(jsonPath("$.data.items[0].title").isNotEmpty());

        mockMvc.perform(get("/api/v1/knowledge/stats")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.documents").value(1))
                .andExpect(jsonPath("$.data.traceability").value("100%"));

        mockMvc.perform(get("/api/v1/notifications/unread-count")
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.count").value(1));
    }

    @Test
    void workflowCanBeCreatedFromPromptAndRun() throws Exception {
        String workspace = "ws-workflow";
        String workflowResponse = mockMvc.perform(post("/api/v1/workflows/from-prompt")
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"prompt\":\"每天检查高价值客户活跃度，有下降风险就通知负责人并创建跟进任务\",\"triggerType\":\"SCHEDULE_DAILY\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.enabled").value(true))
                .andReturn().getResponse().getContentAsString();
        String workflowId = objectMapper.readTree(workflowResponse).path("data").path("id").asText();

        String runResponse = mockMvc.perform(post("/api/v1/workflows/{id}/run", workflowId)
                        .header("X-Workspace-Id", workspace)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"inputJson\":\"{\\\"customer\\\":\\\"acme\\\"}\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"))
                .andExpect(jsonPath("$.data.durationMs").isNumber())
                .andReturn().getResponse().getContentAsString();
        String runId = objectMapper.readTree(runResponse).path("data").path("id").asText();

        mockMvc.perform(get("/api/v1/workflows/{id}/runs", workflowId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.runs[0].id").value(runId));

        mockMvc.perform(post("/api/v1/workflows/runs/{id}/retry", runId)
                        .header("X-Workspace-Id", workspace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUCCESS"));
    }

    @Test
    void identityEndpointsReturnDemoSession() throws Exception {
        mockMvc.perform(get("/api/v1/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("林然"))
                .andExpect(jsonPath("$.data.workspaceId").value("ws-demo"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"林然\",\"password\":\"demo\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.permissions").isArray());
    }

    private record TestTask(String title, String description, String owner, String priority, LocalDate dueDate) {}
}
