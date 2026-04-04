@echo off
REM Launch serve.ps1 in a new PowerShell window and keep it open so you can read logs
REM Uses -ExecutionPolicy Bypass only for the launched process (doesn't change system policy)

cd /d "%~dp0"
powershell -NoExit -ExecutionPolicy Bypass -Command "$env:PORT='55000'; Set-Location '%~dp0'; .\serve.ps1"

pause