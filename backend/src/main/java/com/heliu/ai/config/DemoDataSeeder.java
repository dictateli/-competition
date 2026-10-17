package com.heliu.ai.config;

import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.identity.domain.UserEntity;
import com.heliu.ai.identity.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private static final String WORKSPACE_DEMO = "ws-demo";
    private static final String WORKSPACE_GROWTH = "ws-growth";

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
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
            NotificationService notificationService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
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
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedUsers();
        seedWorkspace(xinghaiSeed());
        seedWorkspace(growthSeed());
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;
        userRepository.save(new UserEntity(
                "user-linran", WORKSPACE_DEMO, "linran",
                passwordEncoder.encode("heliu123"),
                "林然", "产品负责人", "linran@heliu.ai"));
        userRepository.save(new UserEntity(
                "user-zhao", WORKSPACE_DEMO, "zhao",
                passwordEncoder.encode("heliu123"),
                "赵启", "项目经理", "zhao@heliu.ai"));
        userRepository.save(new UserEntity(
                "user-demo", WORKSPACE_DEMO, "demo",
                passwordEncoder.encode("demo1234"),
                "演示账号", "成员", "demo@heliu.ai"));
    }

    // 在指定工作区上下文里执行种子逻辑（seed 通过 ApplicationRunner 运行，不经过 HTTP 过滤器，
    // 因此需要手动设置 WorkspaceContext，服务层才会把数据写到对应工作区）。
    private void seedWorkspace(WorkspaceSeed seed) {
        WorkspaceContext.set(seed.workspaceId());
        try {
            seedProject(seed);
            seedTasks(seed);
            seedMeeting(seed);
            seedDocument(seed);
            seedWorkflows(seed);
            seedNotifications(seed);
        } finally {
            WorkspaceContext.clear();
        }
    }

    private void seedProject(WorkspaceSeed seed) {
        if (projectRepository.countByWorkspaceId(seed.workspaceId()) > 0) return;
        projectRepository.save(new ProjectEntity(
                seed.projectId(),
                seed.workspaceId(),
                seed.projectName(),
                seed.projectDescription(),
                seed.projectOwner(),
                LocalDate.now().minusDays(42),
                LocalDate.now().plusDays(18)
        ));
    }

    private void seedTasks(WorkspaceSeed seed) {
        if (!taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(seed.workspaceId()).isEmpty()) return;
        for (TaskSeed task : seed.tasks()) {
            projectService.createTask(seed.projectId(), new ProjectDtos.CreateTaskRequest(
                    task.title(), task.description(), task.owner(), task.priority(), task.dueDate(), List.of(), task.milestone()
            ));
        }
    }

    private void seedMeeting(WorkspaceSeed seed) {
        if (!meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(seed.workspaceId()).isEmpty()) return;
        var meeting = meetingService.create(seed.meetingTitle());
        for (SegmentSeed segment : seed.segments()) {
            meetingService.appendSegment(meeting.id(), segment.speaker(), segment.text(),
                    segment.startMs(), segment.endMs(), segment.confidence());
        }
        meetingService.finish(meeting.id());
    }

    private void seedDocument(WorkspaceSeed seed) {
        if (!documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(seed.workspaceId()).isEmpty()) return;
        DocumentEntity document = new DocumentEntity(
                seed.documentId(),
                seed.workspaceId(),
                seed.documentName(),
                "text/markdown",
                seed.documentText().length(),
                seed.documentText()
        );
        document.ready(seed.documentSummary(), seed.documentRiskJson());
        documentRepository.save(document);
    }

    private void seedWorkflows(WorkspaceSeed seed) {
        if (!workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(seed.workspaceId()).isEmpty()) return;
        for (WorkflowSeed workflow : seed.workflows()) {
            workflowService.create(new WorkflowDtos.CreateWorkflowRequest(
                    workflow.name(), workflow.triggerType(), workflow.actionsJson()
            ));
        }
    }

    private void seedNotifications(WorkspaceSeed seed) {
        if (notificationRepository.countByWorkspaceId(seed.workspaceId()) >= seed.notifications().size()) return;
        for (NotificationSeed notification : seed.notifications()) {
            notificationService.create(
                    seed.workspaceId(), notification.title(), notification.message(), notification.type(),
                    notification.level(), notification.sourceType(), notification.sourceId()
            );
        }
    }

    // ---- 工作区 1：星海产品中心 ----
    private WorkspaceSeed xinghaiSeed() {
        return new WorkspaceSeed(
                WORKSPACE_DEMO,
                "project-xinghai",
                "星海计划",
                "围绕客户留存与关键工作流提效的第二阶段产品计划。",
                "林然",
                List.of(
                        new TaskSeed("确认第二阶段范围变更", "产品评审会新增数据导出能力，需要确认范围与优先级", "林然", TaskPriority.URGENT, LocalDate.now(), true),
                        new TaskSeed("补齐续约方案 ROI 测算", "缺少 2 项关键数据，会阻塞 14:00 客户会", "李慧", TaskPriority.URGENT, LocalDate.now().minusDays(1), true),
                        new TaskSeed("评估设计与研发资源影响", "数据导出若进入本迭代，关键路径可能增加 3 天", "陈默", TaskPriority.HIGH, LocalDate.now().plusDays(2), true),
                        new TaskSeed("整理数据导出需求清单", "汇总 7 家重点客户访谈中的场景和优先级", "周可", TaskPriority.HIGH, LocalDate.now().plusDays(3), false),
                        new TaskSeed("完成客户访谈记录结构化", "已完成 7 家重点客户访谈并沉淀到知识库", "李慧", TaskPriority.MEDIUM, LocalDate.now().minusDays(3), false)
                ),
                "星海计划 · 第二阶段需求评审",
                List.of(
                        new SegmentSeed("周可", "第二阶段核心目标仍然是提升客户留存，我们希望把数据导出能力放进这次迭代。", 12_000, 18_500, 0.96),
                        new SegmentSeed("陈默", "如果数据导出必须进入本迭代，设计资源会成为关键路径，现有排期预计增加 3 天。", 41_000, 49_000, 0.95),
                        new SegmentSeed("林然", "先确认这是高优先级客户的共性需求还是单点需求，周一前给出影响范围和替代方案。", 78_000, 86_000, 0.97),
                        new SegmentSeed("李慧", "客户访谈中 7 家里有 5 家提到了数据导出，可以认为是高优先级普遍需求。", 125_000, 132_000, 0.94)
                ),
                "doc-q3-customer-feedback",
                "Q3 客户反馈与留存分析.md",
                """
                本季度共收集有效客户反馈 1,284 条，较上季度增长 23%。
                首次配置超过 30 分钟的客户，前两周流失概率为 28%，较平均水平高 11 个百分点。
                数据导出需求近 30 天提及率增长 180%，7 家重点客户中有 5 家明确提出。
                当客户在关键工作流中形成固定使用习惯后，续约概率可提升至 84%。
                """,
                "客户价值判断正在从“功能是否齐全”转向“工作流能否真正提效”。",
                "{\"level\":\"HIGH\",\"items\":[\"首次配置流失率偏高\",\"数据导出需求快速增长\",\"权限设置和第三方接入影响续约\"]}",
                List.of(
                        new WorkflowSeed("会议结束自动生成纪要与任务", "MEETING_FINISHED", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"会议结束\"},{\"type\":\"AI\",\"name\":\"生成纪要\"},{\"type\":\"ACTION\",\"name\":\"写入任务\"}]}"),
                        new WorkflowSeed("文档上传后自动摘要与风险识别", "DOCUMENT_UPLOADED", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"文档上传\"},{\"type\":\"AI\",\"name\":\"摘要与风险扫描\"},{\"type\":\"ACTION\",\"name\":\"写入知识库\"}]}"),
                        new WorkflowSeed("项目风险每日主动播报", "SCHEDULE_DAILY", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每日 09:00\"},{\"type\":\"AI\",\"name\":\"检测风险\"},{\"type\":\"ACTION\",\"name\":\"通知负责人\"}]}"),
                        new WorkflowSeed("周报自动汇总与发送", "SCHEDULE_WEEKLY", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每周五\"},{\"type\":\"AI\",\"name\":\"汇总项目进展\"},{\"type\":\"ACTION\",\"name\":\"生成周报\"}]}")
                ),
                List.of(
                        new NotificationSeed("今日 10:30 产品评审", "AI 已生成会前简报，并标记数据导出需求和资源冲突两个关键议题。", "MEETING", "INFO", "MEETING", "seed-meeting"),
                        new NotificationSeed("客户续约材料缺少 ROI 数据", "该事项会阻塞 14:00 客户会，建议会前补齐测算。", "RISK", "HIGH", "TASK", "seed-task"),
                        new NotificationSeed("知识库新增可复用经验", "已提炼客户续约前置信号和项目延期原因，可在知识中枢检索。", "KNOWLEDGE", "SUCCESS", "DOCUMENT", "doc-q3-customer-feedback")
                )
        );
    }

    // ---- 工作区 2：增长实验室 ----
    private WorkspaceSeed growthSeed() {
        return new WorkspaceSeed(
                WORKSPACE_GROWTH,
                "project-growth",
                "增长实验室",
                "聚焦获客、激活与转化的增长实验体系。",
                "林然",
                List.of(
                        new TaskSeed("发布增长实验复盘", "本周 6 组实验数据已回收，需输出结论与下一步", "周可", TaskPriority.HIGH, LocalDate.now(), false),
                        new TaskSeed("A/B 测试注册页文案", "提升注册转化率的关键实验，需确认样本量与统计口径", "陈默", TaskPriority.URGENT, LocalDate.now().plusDays(1), false),
                        new TaskSeed("优化新手引导漏斗", "首次激活流失率偏高，需定位第三步断点", "李慧", TaskPriority.HIGH, LocalDate.now().plusDays(2), true),
                        new TaskSeed("梳理渠道投放 ROI", "分渠道归因数据待补齐，影响下周预算决策", "周可", TaskPriority.MEDIUM, LocalDate.now().minusDays(2), false)
                ),
                "增长实验室 · 周度实验复盘",
                List.of(
                        new SegmentSeed("周可", "本周注册页 A/B 测试对照组表现稳定，实验组转化率提升了 6 个百分点。", 10_000, 16_000, 0.95),
                        new SegmentSeed("陈默", "新手引导漏斗在第三步流失明显，怀疑是权限申请打断了流程。", 38_000, 45_000, 0.94),
                        new SegmentSeed("李慧", "渠道投放 ROI 还缺归因数据，建议下周先补齐再决定预算。", 80_000, 88_000, 0.96)
                ),
                "doc-growth-weekly",
                "增长实验周报.md",
                """
                本周共上线 6 组增长实验，其中 3 组达到显著水平。
                注册页文案 A/B 测试实验组转化率 18.4%，对照组 12.3%，提升 6.1 个百分点。
                新手引导漏斗第三步（权限申请）流失率 34%，是主要断点。
                渠道投放整体 ROI 为 1.7，但自然量归因存在约 22% 的缺口。
                """,
                "增长实验整体向好，但新手引导断点与归因缺口是需要优先解决的两件事。",
                "{\"level\":\"MEDIUM\",\"items\":[\"新手引导第三步流失率 34%\",\"渠道归因缺口约 22%\",\"实验样本量需统一口径\"]}",
                List.of(
                        new WorkflowSeed("实验数据异常自动告警", "SCHEDULE_DAILY", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每日 10:00\"},{\"type\":\"AI\",\"name\":\"检测异常指标\"},{\"type\":\"ACTION\",\"name\":\"通知实验负责人\"}]}"),
                        new WorkflowSeed("增长周报自动汇总", "SCHEDULE_WEEKLY", "{\"nodes\":[{\"type\":\"TRIGGER\",\"name\":\"每周五\"},{\"type\":\"AI\",\"name\":\"汇总实验结论\"},{\"type\":\"ACTION\",\"name\":\"生成周报\"}]}")
                ),
                List.of(
                        new NotificationSeed("注册页 A/B 测试已达标", "实验组转化率提升 6.1 个百分点，建议全量发布。", "EXPERIMENT", "SUCCESS", "TASK", "seed-growth-task"),
                        new NotificationSeed("新手引导漏斗流失偏高", "第三步权限申请流失率 34%，建议优先优化。", "RISK", "HIGH", "TASK", "seed-growth-task-2")
                )
        );
    }

    private record TaskSeed(String title, String description, String owner, TaskPriority priority, LocalDate dueDate, boolean milestone) {}
    private record SegmentSeed(String speaker, String text, long startMs, long endMs, double confidence) {}
    private record WorkflowSeed(String name, String triggerType, String actionsJson) {}
    private record NotificationSeed(String title, String message, String type, String level, String sourceType, String sourceId) {}
    private record WorkspaceSeed(
            String workspaceId,
            String projectId,
            String projectName,
            String projectDescription,
            String projectOwner,
            List<TaskSeed> tasks,
            String meetingTitle,
            List<SegmentSeed> segments,
            String documentId,
            String documentName,
            String documentText,
            String documentSummary,
            String documentRiskJson,
            List<WorkflowSeed> workflows,
            List<NotificationSeed> notifications
    ) {}
}
