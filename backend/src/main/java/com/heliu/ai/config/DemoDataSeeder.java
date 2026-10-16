package com.heliu.ai.config;

import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import com.heliu.ai.meeting.domain.MeetingRepository;
import com.heliu.ai.meeting.service.MeetingService;
import com.heliu.ai.notification.domain.NotificationRepository;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.project.api.ProjectDtos;
import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.ProjectRepository;
import com.heliu.ai.project.domain.TaskPriority;
import com.heliu.ai.project.domain.TaskRepository;
import com.heliu.ai.project.service.ProjectService;
import com.heliu.ai.workflow.api.WorkflowDtos;
import com.heliu.ai.workflow.domain.WorkflowDefinitionEntity;
import com.heliu.ai.workflow.domain.WorkflowDefinitionRepository;
import com.heliu.ai.workflow.service.WorkflowService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@ConditionalOnProperty(name = "heliu.seed-demo-data", havingValue = "true", matchIfMissing = true)
public class DemoDataSeeder implements ApplicationRunner {
    private static final String WORKSPACE = "ws-demo";

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MeetingRepository meetingRepository;
    private final DocumentRepository documentRepository;
    private final WorkflowDefinitionRepository workflowRepository;
    private final NotificationRepository notificationRepository;
    private final ProjectService projectService;
    private final MeetingService meetingService;
    private final WorkflowService workflowService;
    private final NotificationService notificationService;

    public DemoDataSeeder(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            MeetingRepository meetingRepository,
            DocumentRepository documentRepository,
            WorkflowDefinitionRepository workflowRepository,
            NotificationRepository notificationRepository,
            ProjectService projectService,
            MeetingService meetingService,
            WorkflowService workflowService,
            NotificationService notificationService
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.meetingRepository = meetingRepository;
        this.documentRepository = documentRepository;
        this.workflowRepository = workflowRepository;
        this.notificationRepository = notificationRepository;
        this.projectService = projectService;
        this.meetingService = meetingService;
        this.workflowService = workflowService;
        this.notificationService = notificationService;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedProject();
        seedTasks();
        seedMeeting();
        seedDocument();
        seedWorkflows();
        seedNotifications();
    }

    private void seedProject() {
        if (projectRepository.countByWorkspaceId(WORKSPACE) > 0) return;
        projectRepository.save(new ProjectEntity(
                "project-xinghai",
                WORKSPACE,
                "星海计划",
                "围绕客户留存与关键工作流提效的第二阶段产品计划。",
                "林然",
                LocalDate.now().minusDays(42),
                LocalDate.now().plusDays(18)
        ));
    }

    private void seedTasks() {
        if (!taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WORKSPACE).isEmpty()) return;
        projectService.createTask("project-xinghai", new ProjectDtos.CreateTaskRequest(
                "确认第二阶段范围变更", "产品评审会新增数据导出能力，需要确认范围与优先级", "林然",
                TaskPriority.URGENT, LocalDate.now(), List.of(), true
        ));
        projectService.createTask("project-xinghai", new ProjectDtos.CreateTaskRequest(
                "补齐续约方案 ROI 测算", "缺少 2 项关键数据，会阻塞 14:00 客户会", "李慧",
                TaskPriority.URGENT, LocalDate.now().minusDays(1), List.of(), true
        ));
        projectService.createTask("project-xinghai", new ProjectDtos.CreateTaskRequest(
                "评估设计与研发资源影响", "数据导出若进入本迭代，关键路径可能增加 3 天", "陈默",
                TaskPriority.HIGH, LocalDate.now().plusDays(2), List.of(), true
        ));
        projectService.createTask("project-xinghai", new ProjectDtos.CreateTaskRequest(
                "整理数据导出需求清单", "汇总 7 家重点客户访谈中的场景和优先级", "周可",
                TaskPriority.HIGH, LocalDate.now().plusDays(3), List.of(), false
        ));
        projectService.createTask("project-xinghai", new ProjectDtos.CreateTaskRequest(
                "完成客户访谈记录结构化", "已完成 7 家重点客户访谈并沉淀到知识库", "李慧",
                TaskPriority.MEDIUM, LocalDate.now().minusDays(3), List.of(), false
        ));
    }

    private void seedMeeting() {
        if (!meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WORKSPACE).isEmpty()) return;
        var meeting = meetingService.create("星海计划 · 第二阶段需求评审");
        meetingService.appendSegment(meeting.id(), "周可", "第二阶段核心目标仍然是提升客户留存，我们希望把数据导出能力放进这次迭代。", 12_000, 18_500, 0.96);
        meetingService.appendSegment(meeting.id(), "陈默", "如果数据导出必须进入本迭代，设计资源会成为关键路径，现有排期预计增加 3 天。", 41_000, 49_000, 0.95);
        meetingService.appendSegment(meeting.id(), "林然", "先确认这是高优先级客户的共性需求还是单点需求，周一前给出影响范围和替代方案。", 78_000, 86_000, 0.97);
        meetingService.appendSegment(meeting.id(), "李慧", "客户访谈中 7 家里有 5 家提到了数据导出，可以认为是高优先级普遍需求。", 125_000, 132_000, 0.94);
        meetingService.finish(meeting.id());
    }

    private void seedDocument() {
        if (!documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WORKSPACE).isEmpty()) return;
        DocumentEntity document = new DocumentEntity(
                "doc-q3-customer-feedback",
                WORKSPACE,
                "Q3 客户反馈与留存分析.md",
                "text/markdown",
                4_860,
                """
                本季度共收集有效客户反馈 1,284 条，较上季度增长 23%。
                首次配置超过 30 分钟的客户，前两周流失概率为 28%，较平均水平高 11 个百分点。
                数据导出需求近 30 天提及率增长 180%，7 家重点客户中有 5 家明确提出。
                当客户在关键工作流中形成固定使用习惯后，续约概率可提升至 84%。
                """
        );
        document.ready(
                "客户价值判断正在从“功能是否齐全”转向“工作流能否真正提效”。",
                "{\"level\":\"HIGH\",\"items\":[\"首次配置流失率偏高\",\"数据导出需求快速增长\",\"权限设置和第三方接入影响续约\"]}"
        );
        documentRepository.save(document);
    }

    private void seedWorkflows() {
        if (!workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WORKSPACE).isEmpty()) return;
        workflowService.create(new WorkflowDtos.CreateWorkflowRequest(
                "会议结束自动生成纪要与任务", "MEETING_FINISHED",
                "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"会议结束\"},{\"type\":\"AI\",\"name\":\"生成纪要\"},{\"type\":\"ACTION\",\"name\":\"写入任务\"}]}"
        ));
        workflowService.create(new WorkflowDtos.CreateWorkflowRequest(
                "文档上传后自动摘要与风险识别", "DOCUMENT_UPLOADED",
                "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"文档上传\"},{\"type\":\"AI\",\"name\":\"摘要与风险扫描\"},{\"type\":\"ACTION\",\"name\":\"写入知识库\"}]}"
        ));
        workflowService.create(new WorkflowDtos.CreateWorkflowRequest(
                "项目风险每日主动播报", "SCHEDULE_DAILY",
                "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每日 09:00\"},{\"type\":\"AI\",\"name\":\"检测风险\"},{\"type\":\"ACTION\",\"name\":\"通知负责人\"}]}"
        ));
        workflowService.create(new WorkflowDtos.CreateWorkflowRequest(
                "周报自动汇总与发送", "SCHEDULE_WEEKLY",
                "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每周五\"},{\"type\":\"AI\",\"name\":\"汇总项目进展\"},{\"type\":\"ACTION\",\"name\":\"生成周报\"}]}"
        ));
    }

    private void seedNotifications() {
        long count = notificationRepository.countByWorkspaceId(WORKSPACE);
        if (count >= 3) return;
        notificationService.create(
                WORKSPACE, "今日 10:30 产品评审", "AI 已生成会前简报，并标记数据导出需求和资源冲突两个关键议题。",
                "MEETING", "INFO", "MEETING", "seed-meeting"
        );
        notificationService.create(
                WORKSPACE, "客户续约材料缺少 ROI 数据", "该事项会阻塞 14:00 客户会，建议会前补齐测算。",
                "RISK", "HIGH", "TASK", "seed-task"
        );
        notificationService.create(
                WORKSPACE, "知识库新增可复用经验", "已提炼客户续约前置信号和项目延期原因，可在知识中枢检索。",
                "KNOWLEDGE", "SUCCESS", "DOCUMENT", "doc-q3-customer-feedback"
        );
    }
}
