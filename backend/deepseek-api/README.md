# 合流 AI · DeepSeek API 启动副本

这个目录是独立的 DeepSeek API 运行配置，复用 `backend/dist/app.jar`，不复制代码和依赖，避免出现两份不同步的后端。

## 使用步骤

1. 复制环境变量模板：

```powershell
Copy-Item .env.example .env
```

2. 编辑 `.env`，填入真实 Key：

```text
DEEPSEEK_API_KEY=sk-你的Key
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
HELIU_AI_PROVIDER=deepseek
```

3. Windows 启动：

```powershell
.\run-deepseek.cmd
```

macOS / Linux 启动：

```bash
sh run-deepseek.sh
```

默认端口为 8080。如果演示版后端已经占用 8080，可以指定其他端口：

```powershell
.\run-deepseek.cmd --server.port=9090
```

前端接入地址相应改为：

```text
http://localhost:9090/api/v1
```

## 文件说明

- `config/application.yml`：将模型供应商覆盖为 DeepSeek
- `.env.example`：配置模板
- `run-deepseek.ps1`：Windows PowerShell 启动逻辑，自动读取 `.env`
- `run-deepseek.cmd`：Windows 双击入口
- `run-deepseek.sh`：macOS / Linux 启动脚本

`.env` 只保存在本地，不要提交到 Git。缺少 `DEEPSEEK_API_KEY` 时启动脚本会直接报错，不会静默降级到 Demo 模型。

## 演示数据

API 副本默认不自动写入演示数据，避免启动时调用模型产生等待或费用。需要演示数据时：

```powershell
.\run-deepseek.cmd --heliu.seed-demo-data=true
```
