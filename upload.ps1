# Script de Despliegue Automático a GitHub
Write-Host "🚀 Iniciando proceso de subida a GitHub..." -ForegroundColor Cyan

# Verificar si Git está instalado
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Git no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "👉 Descárgalo de: https://git-scm.com/" -ForegroundColor Yellow
    exit
}

# Ejecutar comandos de Git
git init
git add .
git commit -m "Initial commit: Industrial Multi-tenant WaaS Platform"
git branch -M main

# Intentar agregar el remoto (si ya existe, lo actualiza)
git remote add origin https://github.com/SFcristofer/StoresOnlineDashboard.git 2>$null
if ($LASTEXITCODE -ne 0) {
    git remote set-url origin https://github.com/SFcristofer/StoresOnlineDashboard.git
}

Write-Host "📦 Subiendo archivos a GitHub..." -ForegroundColor Blue
git push -u origin main --force

Write-Host "✅ ¡Éxito! Tu código ya está en GitHub." -ForegroundColor Green
