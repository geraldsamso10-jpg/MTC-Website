@echo off
echo ====================================================
echo Pushing Masvingo Teachers' College Portal to GitHub
echo Repository: https://github.com/geraldsamso10-jpg/MTC-Website
echo ====================================================
echo.

git init
git add .
git commit -m "Initial commit: Masvingo Teachers' College Academic Web Portal"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/geraldsamso10-jpg/MTC-Website.git
git push -u origin main

echo.
echo ====================================================
echo Push completed!
echo ====================================================
pause
