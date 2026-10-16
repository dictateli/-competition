@echo off
setlocal
set "DIR=%~dp0"
if exist "%DIR%jdk-17\bin\java.exe" (
  set "JAVA_CMD=%DIR%jdk-17\bin\java.exe"
) else (
  set "JAVA_CMD=java"
)
"%JAVA_CMD%" -jar "%DIR%app.jar" %*
endlocal
