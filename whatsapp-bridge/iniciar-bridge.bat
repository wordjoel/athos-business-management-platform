@echo off
title WhatsApp Bridge - ATHOS
cd /d "%~dp0"
echo ============================================
echo    WhatsApp Bridge - ATHOS Platform
echo ============================================
echo.
echo Instalando dependencias (primeira vez apenas)...
call npm install
echo.
echo Conectando ao WhatsApp...
echo Escaneie o QR Code com seu WhatsApp
echo.
node index.js
pause
