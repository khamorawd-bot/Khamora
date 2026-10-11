@echo off
setlocal
cd /d "%~dp0"
title Deploy Silvana Ferri - Cloudflare

echo ==================================================
echo   Deploy do site Silvana Ferri no Cloudflare
echo ==================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale em https://nodejs.org e rode de novo.
  goto :fim
)

if not exist node_modules (
  echo [1/5] Instalando dependencias...
  call npm ci
  if errorlevel 1 goto :erro
) else (
  echo [1/5] Dependencias ja instaladas.
)

echo.
echo [2/5] Verificando login no Cloudflare...
call npx wrangler whoami >nul 2>nul
if errorlevel 1 (
  echo Abrindo o navegador para voce autorizar o Cloudflare...
  call npx wrangler login
  if errorlevel 1 goto :erro
)

echo.
echo [3/5] Garantindo as tabelas no banco D1 silvana-ferri...
call npx wrangler d1 migrations apply silvana-ferri --remote
if errorlevel 1 goto :erro

echo.
echo [4/5] Gerando o build...
call npm run cf:build
if errorlevel 1 goto :erro

echo.
echo [5/5] Publicando no Cloudflare...
call npx opennextjs-cloudflare deploy
if errorlevel 1 goto :erro

echo.
echo ==================================================
echo   PRONTO! Copie o endereco *.workers.dev acima.
echo   Painel: /admin  (usuario: admin)
echo ==================================================
goto :fim

:erro
echo.
echo [ERRO] Algo falhou. Leia a mensagem acima e me mande o texto.

:fim
echo.
pause
endlocal
