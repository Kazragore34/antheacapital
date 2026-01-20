# 🚀 Cómo Iniciar el Backend en Hostinger

## ⚠️ Problema Actual

El error que estás viendo:
```
Failed to connect to localhost port 3001 after 0 ms: Could not connect to server
```

Significa que **el backend de Node.js no está corriendo** en el servidor.

## ✅ Solución: Iniciar el Backend

### Opción 1: Usando el Panel de Hostinger (Recomendado)

1. **Accede al panel de control de Hostinger**
2. **Ve a la sección "Node.js"**
3. **Busca tu aplicación** (probablemente llamada "anthea-backend" o similar)
4. **Verifica el estado:**
   - Si está **"Detenido"** o **"Stopped"**, haz clic en **"Iniciar"** o **"Start"**
   - Si está **"Corriendo"** o **"Running"**, verifica los logs para ver si hay errores

5. **Verifica la configuración:**
   - **Puerto:** Debe ser `3001` (o el puerto que configuraste)
   - **Directorio de inicio:** Debe apuntar a `backend/` o `public_html/backend/`
   - **Archivo de inicio:** Debe ser `dist/main.js` o `main.js`

### Opción 2: Usando SSH (Si tienes acceso)

1. **Conéctate por SSH** a tu servidor Hostinger
2. **Navega al directorio del backend:**
   ```bash
   cd ~/domains/antheacapital.com/public_html/backend
   # O la ruta donde esté tu backend
   ```

3. **Verifica que el backend esté compilado:**
   ```bash
   ls -la dist/
   ```
   Deberías ver `main.js` y otros archivos compilados.

4. **Inicia el backend:**
   
   **Si usas PM2:**
   ```bash
   pm2 start dist/main.js --name anthea-backend
   pm2 save
   ```
   
   **Si usas Node directamente:**
   ```bash
   node dist/main.js
   ```
   (Nota: Esto se detendrá cuando cierres la conexión SSH. Usa PM2 para que siga corriendo)

5. **Verifica que esté corriendo:**
   ```bash
   # Si usas PM2:
   pm2 list
   pm2 logs anthea-backend
   
   # O verifica el puerto:
   netstat -tuln | grep 3001
   ```

### Opción 3: Verificar Variables de Entorno

Asegúrate de que el archivo `.env` existe en `backend/` con:

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=contacto@antheacapital.com
EMAIL_PASS=AC@pital2025-contacto#
EMAIL_FROM=contacto@antheacapital.com
PORT=3001
```

## 🔍 Verificar que el Backend Está Funcionando

### Desde el Panel de Hostinger:

1. Ve a **Node.js > Logs**
2. Deberías ver mensajes como:
   ```
   🚀 Backend running on http://0.0.0.0:3001
   📡 API available at http://localhost:3001/api
   ✅ Conexión con servidor de correo verificada correctamente
   ```

### Desde el Navegador:

Abre la consola (F12) y ejecuta:
```javascript
fetch('/api/contact/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Si el backend está corriendo**, deberías ver:
```json
{
  "success": true,
  "message": "Correo de prueba enviado correctamente. Revisa contacto@antheacapital.com"
}
```

**Si el backend NO está corriendo**, verás un error 503 o de conexión.

## ❌ Problemas Comunes

### "El backend se detiene después de unos minutos"

**Solución:** Usa PM2 para mantener el proceso activo:
```bash
pm2 start dist/main.js --name anthea-backend
pm2 startup
pm2 save
```

### "Error: Cannot find module"

**Solución:** Instala las dependencias:
```bash
cd backend
npm install
npm run build
```

### "Error: Port 3001 is already in use"

**Solución:** Otro proceso está usando el puerto. Detén el proceso anterior:
```bash
# Encontrar el proceso:
lsof -i :3001
# O con PM2:
pm2 stop all
pm2 delete all
# Luego reinicia:
pm2 start dist/main.js --name anthea-backend
```

### "El backend inicia pero luego se detiene"

**Solución:** Revisa los logs para ver el error:
```bash
pm2 logs anthea-backend
# O desde el panel de Hostinger > Node.js > Logs
```

## 📝 Checklist

- [ ] El backend está compilado (`backend/dist/main.js` existe)
- [ ] Las dependencias están instaladas (`backend/node_modules/` existe)
- [ ] El archivo `.env` está configurado con las credenciales de correo
- [ ] El backend está corriendo (verificado en el panel de Hostinger o con `pm2 list`)
- [ ] El puerto 3001 está abierto y accesible
- [ ] Los logs muestran que el backend inició correctamente

## 🆘 Si Nada Funciona

1. **Contacta al soporte de Hostinger** y pregunta:
   - ¿Cómo iniciar una aplicación Node.js en mi hosting?
   - ¿Necesito algún plan específico para Node.js?
   - ¿Hay alguna configuración especial que deba hacer?

2. **Verifica que tu plan de Hostinger soporte Node.js:**
   - Algunos planes básicos no incluyen Node.js
   - Puede que necesites actualizar tu plan

3. **Revisa la documentación de Hostinger** sobre Node.js:
   - Busca "Node.js" en el panel de ayuda
   - Sigue las instrucciones específicas de Hostinger
