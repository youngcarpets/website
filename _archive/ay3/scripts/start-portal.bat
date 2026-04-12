@echo off
echo Starting AY3 Portal Dev Server...
cd /d "%~dp0..\my-portal"
npm run dev -- --host
pause
