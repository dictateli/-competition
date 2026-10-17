# 合流 AI · 协同办公工作流中枢

> 把散落的工作，汇成一条清晰的工作流。

合流 AI 不是“再加一个聊天框”，而是连接会议、文档、任务与项目上下文的 AI 协同办公工作流中枢。AI 持续理解组织内的工作状态，主动发现风险、生成交付物并推动下一步行动。

## 快速预览

前端位于 `frontend/`（Vue 3 + Vite + TypeScript），需要本机安装 Node.js 16+：

```powershell
cd D:\competition\frontend
npm install      # 首次需要联网安装依赖
npm run dev      # 启动开发服务器：http://localhost:5173
```

打开 `http://localhost:5173` 进入登录页，使用内置账号登录后进入工作台（演示账号：`linran / heliu123`、`zhao / heliu123`、`demo / demo1234`）。构建生产包：

```powershell
npm run build    # 产物输出到 frontend/dist/（login.html / app.html 双入口）
npm run preview  # 本地预览构建产物
```

会议工作台已接入 Jitsi Meet：点击“开始新会议”后直接在当前页面创建并进入官方 `meet.jit.si` 会议室，不需要跳转官网，也没有额外的登录或主持控制流程。回听使用浏览器语音合成按转写时间轴播放，并支持点击任意发言从该处继续回听。

## 连接后端（可选）

前端默认可离线演示，使用内置演示数据。开发服务器已配置代理，`/api` 与 `/ws` 请求会自动转发到 `http://localhost:8080` 后端；如需显式指定后端地址，可在页面运行时设置 `window.HELIU_API_BASE`：

```text
window.HELIU_API_BASE = 'http://localhost:8080/api/v1'
```

启用后，工作台与项目任务、任务状态流转、“会议 → 行动 → 项目”闭环、文档上传与分析、知识检索与统计、自动化工作流的创建 / 启停 / 执行都会走后端接口；后端不可用时自动回退到内置演示数据，不会白屏。

## 原型包含

- **AI 工作台**：今日聚焦、工作流概览、项目健康度、AI 信号雷达。
- **AI 会议**：Jitsi Meet 视频会议室、实时转写、说话人分离、决策提取、行动项分配、原声证据定位与转写回听。
- **智能写作**：结合项目、会议和历史文档生成内容，支持改写、校验与引用。
- **AI 项目管理**：看板、任务依赖、风险雷达、团队负载与主动提醒。
- **智能文档分析**：文档摘要、关键数据、风险条款、跨文档对比与 RAG 问答。
- **知识中枢**：会议、文档和项目知识自动沉淀，形成可追溯知识网络。
- **自动化工作流**：用自然语言连接触发、AI 分析、业务服务和外部通知。

## 四层技术架构

```text
用户端（Web）
      |
      v
前端应用层（Vue 3 + TypeScript）
      |
      v
业务服务层（Java）
      |
      v
AI 能力服务层（大语言模型 / RAG / 语音识别）
```

详细设计见 [`docs/architecture.md`](docs/architecture.md)，AI 技术选型、集成与优化说明见 [`docs/ai-technology.md`](docs/ai-technology.md)，产品与比赛方案见 [`docs/product-proposal.md`](docs/product-proposal.md)。

## 目录结构

```text
.
├─ frontend/                  # Vue 3 + Vite + TypeScript 前端
│  ├─ login.html              # 登录入口
│  ├─ app.html                # 主应用入口（index.html 自动跳转到 login.html）
│  ├─ public/                 # 全局样式（styles.css / runtime.css / style.css）
│  ├─ src/                    # 组件、视图与 API 客户端（TypeScript）
│  └─ vite.config.ts          # 构建与开发代理配置
├─ backend/                   # Spring Boot 3 后端
│  ├─ src/                    # 源码
│  └─ dist/                   # 免安装运行包（app.jar + run.cmd）
├─ archive/                   # 历史原型归档（不再维护）
└─ docs/                      # 架构与产品方案
```

## 核心业务闭环

```text
多源输入 → 上下文理解 → AI 分析与生成 → 人工确认 → 业务动作 → 结果回流知识库
```

每一次会议、文档处理和项目变更都会进入统一权限感知的知识网络，形成越用越聪明的组织智能。

## 关键指标

- 人均每周节省协同时间 ≥ 6 小时。
- 会议纪要生成时间从 30 分钟降低到 1 分钟以内。
- 文档分析平均耗时降低 ≥ 70%。
- AI 建议行动项采纳率 ≥ 35%。
- 高风险任务提前发现率 ≥ 80%。
- 所有 AI 结论支持来源引用与权限校验。

---

## 后端服务

`backend` 目录已追加 Spring Boot 3 模块化单体，对应：

```text
Vue 前端应用层
      ↓ REST / SSE / WebSocket
Java 业务服务层
      ↓ AI Orchestration
大语言模型 / RAG / ASR 能力层
```

已实现 Dashboard、身份与工作空间、会议实时转写与行动项转任务、文档分析/RAG/对比、项目/任务/依赖/负载/风险、知识中枢与全局搜索、通知中心、自动化工作流和 AI 写作接口。默认启动会写入一套可演示数据，无需模型密钥即可走通“会议 → 行动 → 项目”“文档 → 知识 → 问答”“自然语言 → 自动化”三条核心闭环。

本地运行有两种方式：

**方式一：免安装运行包（推荐用于演示或断网环境）**

不需要 Maven，也不需要联网，只要装了 Java 17 即可：

```powershell
cd D:\competition\backend\dist
.\run.cmd
```

`backend/dist/` 内含单文件可执行包 `app.jar`，并附带 `run.cmd` / `run.sh`，说明见 `backend/dist/README.txt`。

**方式二：从源码构建（首次需要联网下载 Maven 与依赖）**

```powershell
cd D:\competition\backend
.\mvnw.cmd spring-boot:run
```

Swagger：

```text
http://localhost:8080/swagger-ui.html
```

详细接口见 `backend/README.md`。`backend/target/` 是 Maven 的临时构建目录（已在 `.gitignore` 中忽略），离线演示统一使用 `backend/dist/app.jar`；源码构建后可运行 `backend/scripts/sync-dist.ps1` 更新离线包。

## AI 模型切换

默认离线运行 Demo 模型。接入 DeepSeek：

```powershell
$env:HELIU_AI_PROVIDER='deepseek'
$env:DEEPSEEK_API_KEY='你的 API Key'
.\backend\dist\run.cmd
```

AI 写作、Copilot、知识问答和工作流生成都会使用同一个模型适配层；没有 Key 时自动回退 Demo。