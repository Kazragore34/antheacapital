# ⚠️ SOLUCIÓN INMEDIATA - WinSCP

## Problema Detectado
**Faltan las carpetas críticas:**
- ❌ `dist/` - Código compilado del backend
- ❌ `node_modules/` - Dependencias (incluyendo xml2js)

## Solución Rápida (Desde WinSCP Terminal)

### Paso 1: Abre Terminal en WinSCP
1. Haz clic derecho en la carpeta `backend`
2. Selecciona **"Abrir en Terminal"** o presiona `Ctrl+P`

### Paso 2: Instala Dependencias
```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend
npm install
```

**Esto instalará TODAS las dependencias, incluyendo `xml2js`**

### Paso 3: Compila el Backend
```bash
npm run build
```

**Esto creará la carpeta `dist/` con el código compilado**

### Paso 4: Verifica que Todo Esté Correcto
```bash
# Verificar que dist existe
ls -la dist/

# Verificar que xml2js está instalado
ls -la node_modules/xml2js

# Ver estructura completa
ls -la
```

Deberías ver:
- ✅ `dist/main.js` (archivo principal)
- ✅ `node_modules/xml2js/` (dependencia crítica)

### Paso 5: Inicia el Backend
```bash
node dist/main.js
```

Deberías ver:
```
🚀 Backend running on http://0.0.0.0:3001
📡 API available at http://localhost:3001/api
🔍 Debug endpoint: http://localhost:3001/api/properties/debug
```

### Paso 6: Déjalo Ejecutándose en Segundo Plano

**Opción A: Usar nohup (recomendado)**
```bash
nohup node dist/main.js > backend.log 2>&1 &
```

**Opción B: Usar screen (si está disponible)**
```bash
screen -S backend
node dist/main.js
# Presiona Ctrl+A luego D para desconectar (el proceso sigue corriendo)
```

**Opción C: Usar tmux (si está disponible)**
```bash
tmux new -s backend
node dist/main.js
# Presiona Ctrl+B luego D para desconectar
```

## Verificación Final

Después de iniciar, prueba en tu navegador:
1. `https://antheacapital.com/api/properties/debug` - Debe mostrar JSON
2. `https://antheacapital.com/api/properties` - Debe mostrar array de propiedades

## Si No Puedes Ejecutar Comandos

Si WinSCP no te permite ejecutar comandos, necesitas:

1. **Contactar a Hostinger** y pedirles que ejecuten:
   ```bash
   cd /home/u571508109/domains/antheacapital.com/public_html/backend
   npm install
   npm run build
   ```

2. **O usar el panel de Node.js** de Hostinger (si está disponible)

## Comandos Completos (Copia y Pega)

```bash
# Navegar al directorio
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Instalar dependencias
npm install

# Compilar backend
npm run build

# Verificar instalación
ls -la dist/main.js
ls -la node_modules/xml2js

# Iniciar backend (en segundo plano)
nohup node dist/main.js > backend.log 2>&1 &

# Ver logs
tail -f backend.log
```

## Estructura Final Esperada

Después de ejecutar los comandos, deberías ver:

```
backend/
├── dist/                    ← NUEVO (después de npm run build)
│   ├── main.js              ← Archivo principal
│   └── ...
├── node_modules/            ← NUEVO (después de npm install)
│   ├── xml2js/              ← Crítico para XML
│   └── ...
├── src/                     ← Código fuente (ya existe)
├── package.json             ← Ya existe
├── package-lock.json        ← Ya existe
└── ...
```
