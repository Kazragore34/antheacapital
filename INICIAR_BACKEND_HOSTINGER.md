# 🚀 Iniciar Backend en Hostinger

## ✅ Verificación: Las Carpetas Existen

Veo que las carpetas `dist/` y `node_modules/` ya están en el servidor. ¡Perfecto!

## ❌ Problema: El Backend No Está Ejecutándose

Cuando accedes a `/api/properties/debug` o `/api/properties`, la página está vacía porque el backend no está ejecutándose como proceso.

## 🔧 Solución: Iniciar el Backend

### Opción 1: Desde el Panel de Hostinger (Recomendado)

Si Hostinger tiene panel de Node.js:

1. **Ve al panel de Hostinger**
2. **Busca "Node.js" o "Aplicaciones"**
3. **Crea una nueva aplicación Node.js:**
   - **Nombre:** `anthea-backend`
   - **Directorio raíz:** `/home/u571508109/domains/antheacapital.com/public_html/backend`
   - **Archivo de inicio:** `dist/main.js`
   - **Comando de inicio:** `node dist/main.js`
   - **Puerto:** `3001` (o el que Hostinger asigne)
   - **Variables de entorno (opcional):**
     - `INMOVILLA_XML_URL=https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
     - `PORT=3001`
     - `NODE_ENV=production`
4. **Inicia/Activa la aplicación**

### Opción 2: Desde Terminal SSH (Si Tienes Acceso)

Si tienes acceso SSH o terminal desde el panel:

```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Verificar que dist existe
ls -la dist/main.js

# Iniciar backend en segundo plano
nohup node dist/main.js > backend.log 2>&1 &

# Verificar que está ejecutándose
ps aux | grep node

# Ver logs
tail -f backend.log
```

### Opción 3: Usar PM2 (Si Está Disponible)

Si PM2 está instalado en el servidor:

```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Iniciar con PM2
pm2 start dist/main.js --name anthea-backend

# Verificar estado
pm2 status

# Ver logs
pm2 logs anthea-backend
```

## 🔍 Verificación Después de Iniciar

Una vez iniciado el backend, prueba:

1. **Endpoint de debug:**
   ```
   https://antheacapital.com/api/properties/debug
   ```
   Debería mostrar JSON con información sobre las propiedades.

2. **API de propiedades:**
   ```
   https://antheacapital.com/api/properties
   ```
   Debería devolver un array JSON con las propiedades del XML.

3. **Ver logs del backend:**
   - Si usaste `nohup`: `tail -f backend.log`
   - Si usaste PM2: `pm2 logs anthea-backend`
   - Si usaste el panel de Hostinger: revisa los logs en el panel

## 📋 Lo Que Deberías Ver en los Logs

Si el backend está funcionando correctamente, deberías ver:

```
🚀 Backend running on http://0.0.0.0:3001
📡 API available at http://localhost:3001/api
🔍 Debug endpoint: http://localhost:3001/api/properties/debug
[PropertiesService] Loading fresh XML data (cache disabled)
[PropertiesService] Found X propiedades in XML
```

## ⚠️ Si No Puedes Iniciar el Backend

Si no tienes acceso a terminal SSH ni panel de Node.js:

1. **Contacta al soporte de Hostinger** y pídeles que:
   - Ejecuten: `cd /home/u571508109/domains/antheacapital.com/public_html/backend && node dist/main.js`
   - O configuren una aplicación Node.js para que se ejecute automáticamente

2. **O pregunta a Hostinger:**
   - "¿Cómo puedo ejecutar una aplicación Node.js en mi hosting?"
   - "¿Tienen panel de Node.js disponible?"
   - "¿Pueden ejecutar `node dist/main.js` en la carpeta backend?"

## 🎯 Próximos Pasos

1. **Inicia el backend** usando una de las opciones arriba
2. **Verifica los endpoints** `/api/properties/debug` y `/api/properties`
3. **Revisa los logs** para ver si hay errores
4. **Comparte los resultados** para diagnosticar cualquier problema
