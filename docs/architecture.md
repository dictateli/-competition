# 合流 AI 技术架构设计

## 1. 总体分层

```text
┌─────────────────────────────────────────────────────────────┐
│ 用户端 Web                                                   │
│ Chrome / Edge / 企业浏览器 / 移动端 H5                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS / SSE / WebSocket
┌───────────────────────────▼─────────────────────────────────┐
│ 前端应用层（Vue）                                            │
│ Vue Router · Pinia · Axios · SSE Client · WebSocket Client   │
│ 编辑器 · 看板 · 会议工作台 · 文档分析 · Copilot              │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST / SSE / WebSocket
┌───────────────────────────▼─────────────────────────────────┐
│ 接入与网关层（可选）                                         │
│ Nginx / Spring Cloud Gateway · SSO · 限流 · 审计             │
└───────────────────────────┬─────────────────────────────────┘
                            │ 内部 RPC / HTTP
┌───────────────────────────▼─────────────────────────────────┐
│ 业务服务层（Java / Spring Boot）                             │
│ 用户与租户 · 工作空间 · 会议 · 文档 · 项目任务 · 工作流      │
│ 通知中心 · 权限中心 · 审计中心 · 文件中心                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ AI Orchestration API
┌───────────────────────────▼─────────────────────────────────┐
│ AI 能力服务层                                                │
│ 大语言模型 · RAG · 语音识别 ASR · 向量检索 · 工具调用        │
│ Prompt 管理 · 模型路由 · 内容安全 · 评测与可观测性           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ 数据与基础设施层                                             │
│ MySQL · Redis · MinIO · Elasticsearch · 向量数据库 · MQ      │
└─────────────────────────────────────────────────────────────┘
```

## 2. 前端应用层（Vue）

### 2.1 职责

- 承载全部 Web 交互与工作流可视化。
- 通过 SSE 展示大模型流式输出，通过 WebSocket 接收会议实时转写。
- 管理页面状态、缓存、权限路由、主题和输入草稿。
- 不直接接触模型密钥，所有 AI 请求统一转发至 Java 业务服务。
- 对 AI 结果提供“引用、确认、修改、撤销”的人机协同交互。

### 2.2 推荐技术栈

| 能力 | 选型 |
|---|---|
| 核心框架 | Vue 3 + TypeScript |
| 构建工具 | Vite |
| 路由 | Vue Router |
| 状态管理 | Pinia |
| 请求 | Axios + Fetch EventSource |
| 实时通信 | WebSocket + SSE |
| 富文本 | Tiptap / ProseMirror |
| 看板 | Vue Draggable / 自研虚拟列表 |
| 组件体系 | 自研设计系统 + 可访问性组件 |
| 测试 | Vitest + Playwright |

### 2.3 页面与组件边界

```text
AppShell
├─ SidebarNavigation
├─ GlobalSearch
├─ WorkbenchView
│  ├─ TodayFocus
│  ├─ WorkflowMetrics
│  ├─ ProjectHealth
│  └─ SignalRadar
├─ MeetingView
│  ├─ LiveTranscript
│  ├─ DecisionExtractor
│  └─ ActionAssignment
├─ WritingView
│  ├─ Editor
│  ├─ RewriteToolbar
│  └─ CitationPanel
├─ ProjectView
│  ├─ KanbanBoard
│  ├─ RiskRadar
│  └─ WorkloadChart
├─ DocumentView
│  ├─ FileExplorer
│  ├─ DocumentPreview
│  └─ RagQuestionPanel
├─ KnowledgeView
├─ AutomationView
└─ CopilotPanel
```

### 2.4 关键交互原则

1. **AI 建议必须可确认**：创建任务、发送通知、修改文档等动作由用户确认后执行。
2. **结论必须可追溯**：回答旁展示原文、会议时间点、文档页码或任务记录。
3. **上下文必须可见**：Copilot 面板持续显示当前关联的项目、文档和会议。
4. **失败必须可恢复**：流式响应中断后支持重试，工作流动作支持撤销。
5. **权限必须前移**：前端只展示有权访问的数据，Java 服务端进行最终鉴权。

## 3. 业务服务层（Java）

### 3.1 服务拆分

建议先采用模块化单体，确保比赛周期内可交付；验证后按域拆分微服务。

| 服务模块 | 主要职责 |
|---|---|
| 用户与租户服务 | 登录、SSO、组织、角色、成员、租户隔离 |
| 工作空间服务 | 工作空间、应用授权、偏好、最近访问 |
| 会议服务 | 会议生命周期、实时转写、纪要、决策与行动项 |
| 文档服务 | 上传、解析任务、版本、权限、摘要与风险结果 |
| 项目任务服务 | 项目、任务、依赖、里程碑、风险、负载 |
| 写作服务 | 文档编辑、模板、版本、AI 生成与引用 |
| 工作流服务 | 触发器、节点编排、执行记录、失败重试 |
| 通知服务 | 站内通知、企业微信、钉钉、飞书、邮件 |
| 权限与审计服务 | RBAC/ABAC、数据权限、AI 调用审计、操作日志 |
| 文件服务 | 对象存储、分片上传、病毒扫描、签名 URL |

### 3.2 推荐技术栈

- Java 21 / Spring Boot 3。
- Spring Security + OAuth2/OIDC。
- MyBatis-Plus 或 JPA，复杂查询可使用 MyBatis。
- MySQL 8 作为业务主库。
- Redis 用于会话、缓存、分布式锁和限流。
- RabbitMQ / Kafka 用于文档解析、索引、通知等异步任务。
- MinIO / S3 作为文件存储。
- Spring WebFlux 或 MVC 的 SseEmitter 提供 SSE。
- Spring Cloud Gateway 作为生产网关；比赛版可用 Nginx。

### 3.3 核心异步链路

```text
文件上传
  → 文件服务保存对象
  → 发布 DocumentUploaded 事件
  → 解析服务提取文本/表格/OCR
  → 分段与权限标签写入
  → 调用 AI 层生成 Embedding
  → 写入向量数据库
  → 推送“分析完成”通知
```

异步任务必须具备幂等键、重试次数、死信队列与状态查询能力。

## 4. AI 能力服务层

> AI 技术的选型理由、集成方式、优化策略、评测指标和生产替换路径，详见 [AI 技术说明](ai-technology.md)。本节重点说明 AI 能力在总体架构中的位置、边界和协作方式。

### 4.1 能力组成

| 能力 | 说明 |
|---|---|
| LLM Gateway | 统一接入不同大语言模型，支持路由、降级、配额与成本统计 |
| RAG | 查询改写、召回、重排、上下文拼接、引用生成 |
| ASR | 会议实时语音识别、说话人分离、时间戳与热词增强 |
| Embedding | 文档、任务、会议片段向量化，支持批量与增量更新 |
| 工具调用 | 创建任务、发通知、查项目、读文档、触发工作流 |
| Prompt 管理 | 模板版本、变量、灰度发布、效果评估与回滚 |
| 内容安全 | 输入输出过滤、敏感信息识别、越权引用阻断 |
| AI 评测 | 准确率、引用命中率、人工采纳率、延迟和 Token 成本 |

### 4.2 RAG 流程

```text
用户问题
  → 身份与权限过滤
  → Query Rewrite
  → 向量召回 + 关键词召回
  → Rerank
  → 上下文压缩
  → LLM 生成
  → 引用校验
  → SSE 流式返回
```

RAG 的文档块必须携带：`tenant_id`、`workspace_id`、`document_id`、`page`、`section`、`acl_tags`、`version`。检索前先做权限过滤，生成后再次校验引用范围。

### 4.3 会议实时链路

```text
浏览器采集音频
  → WebSocket 音频分片
  → Java 会议服务
  → ASR 流式识别
  → 时间戳与说话人结果
  → 实时推回 Vue
  → 会议结束后触发 LLM 总结
  → 决策/待办结构化
  → 用户确认后写入项目系统
```

### 4.4 AI 输出约束

- 所有结构化结果使用 JSON Schema 校验。
- 无法找到证据时必须回答“不确定”，不得编造来源。
- 高风险操作进入人工确认队列。
- 模型调用记录输入摘要、模型版本、Prompt 版本、耗时与成本，但不记录不必要的敏感明文。
- 使用租户级密钥、限流与预算阈值，避免单租户耗尽资源。

## 5. 数据设计

### 5.1 主要数据实体

```text
Tenant → User → Role → Permission
Tenant → Workspace → Member
Workspace → Project → Task → Dependency
Workspace → Meeting → TranscriptSegment → Decision → ActionItem
Workspace → Document → DocumentVersion → Chunk → Citation
Workspace → Workflow → WorkflowRun → WorkflowNodeRun
Workspace → Notification → DeliveryRecord
```

### 5.2 存储选型

| 数据类型 | 存储 |
|---|---|
| 用户、组织、任务、项目 | MySQL |
| 会话、缓存、限流、短期状态 | Redis |
| 原始文件与音视频 | MinIO / S3 |
| 全文检索 | Elasticsearch / OpenSearch |
| 向量索引 | Milvus / Qdrant / pgvector |
| 异步事件 | RabbitMQ / Kafka |
| 审计日志 | ClickHouse / Elasticsearch |

## 6. 核心 API 草案

```http
POST   /api/v1/meetings
GET    /api/v1/meetings/{id}/minutes
WS     /api/v1/meetings/{id}/transcription
POST   /api/v1/documents
POST   /api/v1/documents/{id}/ask          # SSE
POST   /api/v1/ai/writing/stream           # SSE
POST   /api/v1/projects/{id}/tasks
GET    /api/v1/projects/{id}/risks
POST   /api/v1/workflows
POST   /api/v1/workflows/{id}/run
GET    /api/v1/knowledge/search
```

统一响应包含 `trace_id`，AI 响应额外包含 `model`、`prompt_version`、`citations`、`usage`。

## 7. 安全与合规

- 租户隔离：所有数据表包含 `tenant_id`，服务层强制拼接租户条件。
- 权限模型：RBAC + 项目级 ABAC，支持文档级 ACL。
- 数据加密：传输 TLS，敏感字段加密存储，文件使用签名 URL。
- 模型安全：企业数据不用于公共训练；支持私有化模型和国产模型网关。
- 提示注入防护：文档内容视为数据而非指令，工具调用前做意图与权限校验。
- 审计：登录、查看、下载、分享、AI 调用、工作流执行全量留痕。

## 8. 部署方案

```text
CDN / WAF
  → Nginx / Gateway
  → Vue 静态资源
  → Java 服务集群
  → AI Gateway
  → 模型服务 / 向量数据库
  → MySQL / Redis / MinIO / MQ
```

比赛演示版可使用 Docker Compose 部署在一台服务器；正式版采用 Kubernetes，实现弹性扩缩容、灰度发布与故障隔离。
