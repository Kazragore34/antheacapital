@echo off
REM Script de inicio para Windows (desarrollo local)
echo Starting Anthea Capital Backend...

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

if not exist "node_modules\xml2js" (
  echo Installing xml2js...
  call npm install xml2js
)

if not exist "dist" (
  echo Building...
  call npm run build
)

echo Starting application...
node dist/main.js
