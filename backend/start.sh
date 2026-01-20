#!/bin/bash
# Script de inicio para el backend en Hostinger
# Este script se ejecutará automáticamente cuando Hostinger inicie la aplicación Node.js

echo "🚀 Starting Anthea Capital Backend..."
echo "📦 Current directory: $(pwd)"
echo "📁 Contents: $(ls -la)"

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
  echo "⚠️ node_modules not found, installing dependencies..."
  npm install
fi

# Verificar que xml2js está instalado
if [ ! -d "node_modules/xml2js" ]; then
  echo "⚠️ xml2js not found, installing..."
  npm install xml2js
fi

# Verificar que dist existe
if [ ! -d "dist" ]; then
  echo "⚠️ dist folder not found, building..."
  npm run build
fi

# Iniciar la aplicación
echo "✅ Starting application..."
node dist/main.js
