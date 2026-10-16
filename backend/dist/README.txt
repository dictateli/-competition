合流 AI 后端 · 免安装运行包
================================

这个目录不依赖 Maven、不需要联网，只要有 Java 17 或更高版本即可运行。
程序与全部依赖已经合并到单个 app.jar 中，不再需要 app\ 或 lib\ 目录。

运行
----
Windows:
    run.cmd

macOS / Linux:
    sh run.sh

默认端口 8080，启动后可访问：
    http://localhost:8080/swagger-ui.html
    http://localhost:8080/h2-console

目录说明
--------
    app.jar   单文件 Spring Boot 可执行包
    run.cmd   Windows 启动脚本
    run.sh    macOS / Linux 启动脚本

常见参数（透传给 Spring Boot）
------------------------------
    run.cmd --server.port=9090
    run.cmd --spring.profiles.active=prod
    run.cmd --heliu.seed-demo-data=false

说明
----
- 数据默认保存到 ./data/heliu.mv.db（H2 文件数据库），删除该目录即可重置演示数据。
- app.jar 是当前离线演示版本的唯一后端运行产物。
- 修改 Java 源码后先执行 mvnw.cmd clean package，再运行 scripts\sync-dist.ps1 同步 app.jar。
- 如需从源码构建，见上一级 README.md。
