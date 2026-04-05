@echo off
REM Simple batch to add, commit and push changes to GitHub from the repo root
REM Usage: double-click or run from command line. It will prompt for a commit message.

cd /d "%~dp0"

echo --- Git status ---
git status --short

set /p COMMIT_MSG=Enter commit message (leave empty to cancel): 
if "%COMMIT_MSG%"=="" (
  echo Commit cancelled.
  pause
  exit /b 1
)

echo Adding changes...
git add -A

echo Committing...
git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo Commit failed or nothing to commit.
  pause
  exit /b 1
)

echo Pulling latest from origin/main (rebase)...
git pull --rebase origin main
if errorlevel 1 (
  echo Pull failed. Resolve conflicts, then run this script again.
  pause
  exit /b 1
)

echo Pushing to origin main...
git push -u origin main
if errorlevel 1 (
  echo Push failed. Check your network/auth and try again.
  pause
  exit /b 1
)

echo Done.
pause