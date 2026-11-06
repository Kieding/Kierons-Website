# Easy PowerShell script for committing changes directly in VSC (Win 11)

param([string]$m = "Update site")
git add .
git commit -m "$m"
git push