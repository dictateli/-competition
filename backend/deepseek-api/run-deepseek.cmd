@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-deepseek.ps1" %*
endlocal
