# 🔧 Solución: Carpetas `dist/` y `node_modules/` No Están en el Servidor

## ✅ Es Normal que NO Estén en GitHub

Las carpetas `dist/` y `node_modules/` **NO deben estar en Git** porque:
- `dist/` se genera al compilar (build)
- `node_modules/` se genera al instalar dependencias
- Están en `.gitignore` (correcto)

## ❌ El Problema Real

Las carpetas **SÍ se construyen en GitHub Actions**, pero **NO se están subiendo al servidor**.

## 🔍 Verificación en GitHub Actions

1. Ve a: https://github.com/Kazragore34/antheacapital/actions
2. Abre el workflow más reciente
3. Busca el paso **"Verificar estructura antes de deploy"**
4. Deberías ver:
   ```
   ✅ dist/ existe
   ✅ node_modules/ existe
   ```

Si ves esto, las carpetas se construyeron correctamente.

5. Luego busca el paso **"Deploy to Hostinger"**
6. Busca mensajes como:
   ```
   Uploading: backend/dist/main.js
   Uploading: backend/node_modules/xml2js/...
   ```

Si NO ves estos mensajes, el FTP no está subiendo las carpetas.

## 🚀 Solución Inmediata: Crear Carpetas Manualmente en el Servidor

Como tienes acceso a WinSCP, la solución más rápida es crear las carpetas directamente en el servidor:

### Paso 1: Abre Terminal en WinSCP

1. Haz clic derecho en la carpeta `backend`
2. Selecciona **"Abrir en Terminal"** o presiona `Ctrl+P`

### Paso 2: Instala Dependencias y Compila

```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Instalar todas las dependencias (crea node_modules/)
npm install

# Compilar el backend (crea dist/)
npm run build
```

### Paso 3: Verifica que se Crearon

```bash
# Verificar dist/
ls -la dist/
# Deberías ver main.js y otros archivos

# Verificar node_modules/
ls -la node_modules/ | head -20
# Deberías ver muchas carpetas incluyendo xml2js

# Verificar xml2js específicamente
ls -la node_modules/xml2js/
# Deberías ver los archivos de xml2js
```

### Paso 4: Inicia el Backend

```bash
# Ejecutar en segundo plano
nohup node dist/main.js > backend.log 2>&1 &

# Ver logs
tail -f backend.log
```

## 🔍 Verificar que Funciona

Después de iniciar, prueba en tu navegador:
- `https://antheacapital.com/api/properties/debug`
- `https://antheacapital.com/api/properties`

Deberían devolver JSON con datos.

## 📋 Estructura Final Esperada en el Servidor

Después de ejecutar los comandos, deberías tener:

```
/home/u571508109/domains/antheacapital.com/public_html/backend/
├── dist/                    ← Creado con npm run build
│   ├── main.js              ← Archivo principal
│   └── ...                  ← Otros archivos compilados
├── node_modules/            ← Creado con npm install
│   ├── xml2js/              ← Dependencia crítica
│   └── ...                  ← Otras dependencias
├── src/                     ← Ya existe (código fuente)
├── package.json             ← Ya existe
├── package-lock.json        ← Ya existe
└── start.sh                 ← Ya existe
```

## ⚠️ Si npm install Falla

Si `npm install` falla, puede ser por:
1. **Espacio en disco insuficiente** → Contacta a Hostinger
2. **Permisos incorrectos** → Verifica permisos de la carpeta
3. **Node.js no disponible** → Verifica versión de Node.js

Para verificar Node.js:
```bash
node --version
npm --version
```

## 🔄 Solución Permanente

Una vez que las carpetas estén creadas manualmente, el backend debería funcionar. Para futuros deploys:

1. El workflow de GitHub Actions seguirá intentando subir las carpetas
2. Si falla, siempre puedes ejecutar `npm install` y `npm run build` manualmente desde WinSCP
3. O contacta al soporte de Hostinger para que configuren el deploy automático correctamente

## 📞 Si Necesitas Ayuda

Si los comandos fallan, comparte:
1. El error exacto que aparece
2. La salida de `node --version` y `npm --version`
3. Los logs de GitHub Actions del paso "Deploy to Hostinger"
