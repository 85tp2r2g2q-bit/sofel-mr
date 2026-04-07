@echo off
REM pull-latest.bat - Pull latest changes from remote GitHub repository for the current branch.
REM Usage: double-click in repo folder or run from command line.

setlocal
cd /d "%~dp0"

:: Check for git executable
git --version >nul 2>&1
if errorlevel 1 (
  echo Git is not installed or not on PATH.
  pause
  exit /b 1
)

:: Ensure we're inside a git repository
for /f "delims=" %%i in ('git rev-parse --is-inside-work-tree 2^>nul') do set INSIDE=%%i
if "%INSIDE%" neq "true" (
  echo This folder is not a Git repository.
  pause
  exit /b 1
)

:: Get current branch name
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b
echo Current branch: %BRANCH%

:: Refresh index and check for local uncommitted changes
git update-index --refresh >nul 2>&1
set CHANGES=0
for /f "usebackq delims=" %%c in (`git status --porcelain`) do set CHANGES=1
if %CHANGES%==1 (
  echo.
  echo You have local uncommitted changes or untracked files.
  echo It's safer to commit or stash them before pulling.
  echo.
  choice /m "Do you want to FORCE overwrite local changes with remote? (This will discard local changes)"
  if errorlevel 2 (
    echo Aborting. Please commit or stash local changes and try again.
    pause
    exit /b 1
  )
  echo Forcing reset to origin/%BRANCH% ...
  git fetch --all
  git reset --hard origin/%BRANCH%
  git clean -fd
) else (
  echo Pulling latest from origin/%BRANCH% (rebase)...
  git pull --rebase origin %BRANCH%
)

echo.
echo Done.
pause
endlocal
