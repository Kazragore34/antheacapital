@echo off

echo 🔨 Building Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo 📦 Copying files to root (like relucia)...
REM Copiar index.html a la raíz
copy frontend\dist\index.html index.html /Y

REM Copiar assets a la raíz
if exist assets rmdir /s /q assets
xcopy frontend\dist\assets assets /E /I /Y

REM Copiar .htaccess si no existe
if not exist .htaccess (
  copy frontend\dist\.htaccess .htaccess /Y 2>nul
)

echo ✅ Frontend ready in root directory!
echo 📦 Files in root:
echo    - index.html
echo    - assets/
echo    - .htaccess

pause

