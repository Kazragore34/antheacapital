#!/bin/bash

echo "🔨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "📦 Copying files to root (like relucia)..."
# Copiar index.html a la raíz
cp frontend/dist/index.html index.html

# Copiar assets a la raíz
rm -rf assets
cp -r frontend/dist/assets assets

# Copiar .htaccess si no existe
if [ ! -f .htaccess ]; then
  cp frontend/dist/.htaccess .htaccess 2>/dev/null || echo ".htaccess already exists"
fi

echo "✅ Frontend ready in root directory!"
echo "📦 Files in root:"
echo "   - index.html"
echo "   - assets/"
echo "   - .htaccess"

