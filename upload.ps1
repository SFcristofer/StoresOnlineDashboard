# Script de Despliegue Automatico a GitHub
Write-Host "Iniciando proceso de subida a GitHub..." -ForegroundColor Cyan

# Ejecutar comandos de Git
git add .
git commit -m "Update: AI Architecture improvements and Professional Blocks"
git branch -M main

# Intentar agregar el remoto (si ya existe, lo actualiza)
git remote add origin https://github.com/SFcristofer/StoresOnlineDashboard.git 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin https://github.com/SFcristofer/StoresOnlineDashboard.git
}

Write-Host "Subiendo archivos a GitHub..." -ForegroundColor Blue
git push -u origin main --force

Write-Host "Exito! Tu codigo ya esta en GitHub." -ForegroundColor Green
