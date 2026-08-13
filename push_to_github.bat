@echo off
setlocal
echo ====================================================
echo Pushing Masvingo Teachers' College Portal to GitHub
echo Repository: https://github.com/geraldsamso10-jpg/MTC-Website
echo ====================================================
echo.

set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    set "GIT_CMD=C:\Users\Jedza\.gemini\antigravity\scratch\git_portable\cmd\git.exe"
)

"%GIT_CMD%" branch -M main
"%GIT_CMD%" remote remove origin 2>nul
"%GIT_CMD%" remote add origin https://github.com/geraldsamso10-jpg/MTC-Website.git
"%GIT_CMD%" push -u origin main

echo.
echo ====================================================
echo Push command executed!
echo ====================================================
pause
