# 合流 AI 后端服务

Spring Boot 3 模块化单体，对应技术架构中的 Java 业务服务层与 AI 能力服务层适配层。比赛版默认使用 H2 与 Demo AI 适配器，启动后即可完整演示 MVP 闭环，不依赖模型密钥。

AI 技术选型理由、集成方式、优化策略和生产替换路径见 [`../docs/ai-technology.md`](../docs/ai-technology.md)。

## 已实现接口

### 工作台

```http
GET /api/v1/dashboard
GET /api/v1/dashboard/focus
GET /api/v1/dashboard/signals
```

### 身份与工作空间

```http
GET  /api/v1/me
GET  /api/v1/workspaces
GET  /api/v1/workspaces/current
POST /api/v1/auth/login
```

### 会议、实时转写与行动项

```http
GET    /api/v1/meetings
POST   /api/v1/meetings
POST   /api/v1/meetings/{meetingId}/segments
POST   /api/v1/meetings/{meetingId}/finish
GET    /api/v1/meetings/{meetingId}/minutes
POST   /api/v1/meetings/{meetingId}/actions/convert
POST   /api/v1/meetings/{meetingId}/actions/{actionId}/convert
PATCH  /api/v1/actions/{actionId}/status
WS     /ws/meetings/{meetingId}
```

WebSocket 文本消息示例：

```json
{
  "speaker": "陈默",
  "content": "数据导出会影响资源排期，需要评估风险",
  "startMs": 0,
  "endMs": 1800,
  "confidence": 0.95
}
```

会议行动项可通过 `actions/convert` 一键写入项目任务，系统会保存行动项与任务的双向关联。

### 文档与 RAG

```http
GET    /api/v1/documents
GET    /api/v1/documents/{documentId}
GET    /api/v1/documents/{documentId}/analysis
GET    /api/v1/documents/compare?ids={id1}&ids={id2}
POST   /api/v1/documents
POST   /api/v1/documents/{documentId}/ask
DELETE /api/v1/documents/{documentId}
```

`POST /ask` 返回 `text/event-stream`，依次发送 `meta`、`token` 和 `done` 事件。

### 项目、任务与风险

```http
GET   /api/v1/projects
POST  /api/v1/projects
GET   /api/v1/projects/{projectId}
PATCH /api/v1/projects/{projectId}
GET   /api/v1/projects/{projectId}/tasks
POST  /api/v1/projects/{projectId}/tasks
PATCH /api/v1/tasks/{taskId}/status
GET   /api/v1/projects/{projectId}/risks
GET   /api/v1/projects/{projectId}/workload
```

任务支持优先级、截止时间、里程碑和依赖 ID。风险评分综合逾期、优先级、阻塞状态、缺失数据和上游依赖。

### 知识中枢与全局搜索

```http
GET  /api/v1/knowledge/search?q={keyword}
GET  /api/v1/knowledge/stats
POST /api/v1/knowledge/ask
POST /api/v1/knowledge/ask/stream
GET  /api/v1/search?q={keyword}
```

知识中枢统一检索文档、会议、任务、项目和工作流，所有结果携带来源、位置与置信度。

### 通知中心

```http
GET  /api/v1/notifications?unreadOnly=false
GET  /api/v1/notifications/unread-count
POST /api/v1/notifications/{notificationId}/read
POST /api/v1/notifications/read-all
```

文档分析、会议纪要、高风险任务和工作流执行都会自动生成通知。

### 工作流

```http
GET   /api/v1/workflows
POST  /api/v1/workflows
POST  /api/v1/workflows/from-prompt
GET   /api/v1/workflows/{workflowId}
PATCH /api/v1/workflows/{workflowId}/toggle
POST  /api/v1/workflows/{workflowId}/run
GET   /api/v1/workflows/{workflowId}/runs
POST  /api/v1/workflows/runs/{runId}/retry
GET   /api/v1/workflows/runs/recent
```

### AI 写作

```http
POST /api/v1/ai/writing/stream
```

### AI 协同闭环

```http
GET    /api/v1/writing/drafts
POST   /api/v1/writing/drafts
GET    /api/v1/writing/drafts/{id}
PATCH  /api/v1/writing/drafts/{id}
DELETE /api/v1/writing/drafts/{id}

POST   /api/v1/copilot/chat
GET    /api/v1/copilot/conversations/{conversationId}

GET    /api/v1/knowledge/graph
POST   /api/v1/knowledge/graph/refresh
```

Copilot 会调用知识检索，并支持通过自然语言创建真实任务。知识图谱由项目、任务、成员、文档、会议和工作流自动生成节点与关系边。
## 本地运行

需要 Java 17+。

**免安装运行包（不需要 Maven，也不需要联网）**

`dist/` 目录已包含单文件可执行包 `app.jar`，不依赖 Maven 或外部依赖目录，直接运行即可：

```powershell
cd D:\competition\backend\dist
.\run.cmd
```

**从源码构建（Maven Wrapper 首次运行需要联网下载 Maven 与依赖）**

```powershell
cd D:\competition\backend
.\mvnw.cmd spring-boot:run
```

如需打包并同步到离线运行目录：

```powershell
.\mvnw.cmd clean package
.\scripts\sync-dist.ps1
```

默认使用文件型 H2，并自动写入可演示的项目、任务、会议、文档与工作流数据：

```text
http://localhost:8080/swagger-ui.html
http://localhost:8080/h2-console
JDBC URL: jdbc:h2:file:./data/heliu;MODE=MySQL;DATABASE_TO_LOWER=TRUE;AUTO_SERVER=TRUE
User: sa
Password: 空
```

如不需要演示数据，可设置：

```yaml
heliu:
  seed-demo-data: false
```

生产环境示例：

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=prod
```

## 请求头

多租户通过 `X-Workspace-Id` 传递，不传时使用 `ws-demo`：

```http
X-Workspace-Id: ws-demo
```

## 测试

```powershell
.\mvnw.cmd test
```

集成测试覆盖会议转任务、项目风险与负载、文档分析与知识检索、通知、工作流创建执行和身份接口。

## Demo AI 适配器

比赛原型默认使用 `DemoLargeLanguageModel`、`DemoRetrievalService` 和 `DemoSpeechRecognitionService`，因此不需要模型密钥即可完成演示。接入真实模型时新增 `LargeLanguageModel`、`RetrievalService` 或 `SpeechRecognitionService` 实现，并使用 Spring Profile 切换。

## 环境与安全分档

安全策略随 profile 切换，避免演示用的宽松配置被带入生产：

| 环境 | profile | 接口鉴权 | 在线接口文档 | H2 控制台 | CORS |
|---|---|---|---|---|---|
| 演示 / 开发 | `demo`（默认） | 全部放行 | 开启 | 开启 | 允许任意来源（不带凭据） |
| 生产 | `prod` | 需要认证 | 关闭 | 关闭 | 由 `CORS_ALLOWED_ORIGINS` 指定 |

启动生产配置：

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=prod
```

生产环境相关环境变量：

| 变量 | 说明 | 默认值 |
|---|---|---|
| `API_USERNAME` | 接口账号 | `heliu-admin` |
| `API_PASSWORD` | 接口密码，务必修改 | `change-me` |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | MySQL 连接 | 本地 `heliu_ai` |
| `CORS_ALLOWED_ORIGINS` | 允许访问的前端来源 | `http://localhost:8080` |

生产配置默认不写入演示数据（`heliu.seed-demo-data=false`）。

> 当前 `prod` 使用 Spring Security 的 HTTP Basic 作为鉴权占位实现，正式上线请替换为 OAuth2 / OIDC + JWT。
## 生产改造清单

- 使用 MySQL + Flyway 管理数据库迁移。
- 使用 Redis 保存会话、限流和幂等键。
- 使用 MinIO/S3 保存原始文件和音视频。
- 使用 RabbitMQ/Kafka 异步处理文档解析、向量化与通知。
- 使用 Milvus/Qdrant/pgvector 替换 Demo RAG。
- 接入真实 ASR 流式服务和 LLM Gateway。
- 使用 OAuth2/OIDC + JWT 替换当前 PermitAll 演示安全配置。
- 增加租户级审计、额度、模型成本和内容安全策略。

## DeepSeek 配置

默认使用离线 Demo 模型。切换 DeepSeek 时设置：

```powershell
$env:HELIU_AI_PROVIDER='deepseek'
$env:DEEPSEEK_API_KEY='你的 API Key'
$env:DEEPSEEK_MODEL='deepseek-chat'
.\dist\run.cmd
```

如果未提供 API Key，后端会自动降级为 Demo 模型，不会阻止比赛演示。

