@echo off

echo 🔨 Building Frontend...
cd frontend
call npm install
call npm run build
cd ..

echo 🔨 Building Backend...
cd backend
call npm install
call npm run build
cd ..

echo ✅ Build completed!
echo 📦 Frontend build: frontend/dist
echo 📦 Backend build: backend/dist

pause

