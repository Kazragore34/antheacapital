#!/bin/bash

echo "🔨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "🔨 Building Backend..."
cd backend
npm install
npm run build
cd ..

echo "✅ Build completed!"
echo "📦 Frontend build: frontend/dist"
echo "📦 Backend build: backend/dist"

