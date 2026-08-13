Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Pushing Masvingo Teachers' College Portal to GitHub" -ForegroundColor Green
Write-Host "Repository: https://github.com/geraldsamso10-jpg/MTC-Website" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

git init
git add .
git commit -m "Initial commit: Masvingo Teachers' College Academic Web Portal"
git branch -M main
git remote remove origin 2>$null
git remote add origin https://github.com/geraldsamso10-jpg/MTC-Website.git
git push -u origin main

Write-Host "Push complete!" -ForegroundColor Green
