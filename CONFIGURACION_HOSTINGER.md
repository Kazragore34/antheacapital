# Configuración del Backend en Hostinger

## Problema
Hostinger solo permite subir archivos, no tiene acceso a consola SSH.

## Solución Implementada

He configurado el proyecto para que:
1. ✅ `node_modules` se incluye en el deploy automático
2. ✅ Scripts de inicio creados (`start.sh`, `start.bat`)
3. ✅ `package.json` configurado con `"start": "node dist/main.js"`

## Configuración en Hostinger

### Opción 1: Panel de Node.js (Recomendado)

Si Hostinger tiene un panel de Node.js:

1. **Ve al panel de Node.js en Hostinger**
2. **Crea una nueva aplicación Node.js** (si no existe)
3. **Configuración:**
   - **Directorio raíz:** `/public_html/backend`
   - **Archivo de inicio:** `dist/main.js`
   - **Comando de inicio:** `npm start` o `node dist/main.js`
   - **Puerto:** `3001` (o el que Hostinger asigne)
   - **Variables de entorno:** (si las necesitas)
     - `PORT=3001`
     - `NODE_ENV=production`

4. **Inicia/Reinicia la aplicación**

### Opción 2: Archivo de Configuración Automática

Si Hostinger detecta automáticamente aplicaciones Node.js:

1. El archivo `package.json` ya tiene `"main": "dist/main.js"` y `"start": "node dist/main.js"`
2. Hostinger debería detectarlo automáticamente
3. Si no funciona, contacta al soporte de Hostinger y diles:
   - "Tengo una aplicación Node.js en `/public_html/backend`"
   - "El archivo principal es `dist/main.js`"
   - "El comando de inicio es `npm start`"

### Opción 3: Usar el Script de Inicio

Si Hostinger permite ejecutar scripts:

1. Sube el archivo `backend/start.sh` al servidor
2. Hazlo ejecutable (si es posible desde el panel)
3. Configura Hostinger para ejecutar `start.sh` al iniciar

## Verificación

Después de configurar, verifica:

1. **Endpoint de debug:**
   ```
   https://antheacapital.com/api/properties/debug
   ```
   Debería devolver un JSON con información sobre las propiedades.

2. **API de propiedades:**
   ```
   https://antheacapital.com/api/properties
   ```
   Debería devolver un array JSON con las propiedades del XML.

3. **Logs del backend:**
   Si Hostinger tiene logs disponibles, revisa que no haya errores.

## Si No Funciona

Si después de configurar aún no funciona:

1. **Verifica que el backend esté ejecutándose:**
   - Revisa el panel de Node.js en Hostinger
   - Verifica que la aplicación esté "Running" o "Activa"

2. **Verifica los logs:**
   - Busca errores relacionados con `xml2js`
   - Busca errores de conexión a MongoDB
   - Busca errores de carga del XML

3. **Contacta a Hostinger:**
   - Pregunta cómo ejecutar aplicaciones Node.js
   - Pregunta si necesitas configuración especial
   - Comparte que tienes una aplicación NestJS que necesita ejecutarse

## Archivos Importantes

- `backend/package.json` - Configuración de la aplicación
- `backend/dist/main.js` - Archivo principal compilado
- `backend/start.sh` - Script de inicio para Linux
- `backend/start.bat` - Script de inicio para Windows
- `backend/node_modules/` - Dependencias (incluyendo xml2js)
