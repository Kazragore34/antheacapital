# Configuración del Servicio de Correo

## ⚠️ IMPORTANTE: El correo se envía a contacto@antheacapital.com

El código está configurado para enviar todos los mensajes de contacto a **contacto@antheacapital.com**.

## Variables de Entorno Requeridas

Para que el formulario de contacto funcione correctamente, necesitas configurar las siguientes variables de entorno en tu servidor:

```env
EMAIL_HOST=smtp.tu-servidor.com
EMAIL_PORT=587
EMAIL_USER=tu-usuario@tu-servidor.com
EMAIL_PASS=tu-contraseña
EMAIL_FROM=contacto@antheacapital.com
```

## Configuración para Hostinger

Si estás usando Hostinger, puedes usar el servidor SMTP de Hostinger:

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=contacto@antheacapital.com
EMAIL_PASS=tu-contraseña-de-correo-de-hostinger
EMAIL_FROM=contacto@antheacapital.com
```

**NOTA:** El `EMAIL_USER` debe ser el correo completo (contacto@antheacapital.com) y `EMAIL_PASS` debe ser la contraseña de ese correo en Hostinger.

## Configuración para Gmail (Solo para pruebas)

Si quieres usar Gmail para pruebas (NO recomendado para producción):

1. Genera una "Contraseña de aplicación" en tu cuenta de Google
2. Configura las variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
EMAIL_FROM=tu-email@gmail.com
```

## Cómo Configurar en Hostinger

### Opción 1: Usando el Administrador de Archivos

1. Accede al panel de control de Hostinger
2. Ve a "Archivos" > "Administrador de archivos"
3. Navega a la carpeta `backend/` o `public_html/backend/`
4. Crea o edita el archivo `.env` (si no existe, créalo)
5. Agrega las variables de entorno con tus credenciales:
   ```
   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=587
   EMAIL_USER=contacto@antheacapital.com
   EMAIL_PASS=tu-contraseña-aqui
   EMAIL_FROM=contacto@antheacapital.com
   ```
6. Guarda el archivo
7. Reinicia el backend (si está corriendo con PM2: `pm2 restart all`)

### Opción 2: Usando SSH

1. Conecta por SSH a tu servidor Hostinger
2. Navega a la carpeta del backend:
   ```bash
   cd ~/domains/antheacapital.com/public_html/backend
   ```
3. Crea o edita el archivo `.env`:
   ```bash
   nano .env
   ```
4. Agrega las variables de entorno (mismo formato que arriba)
5. Guarda y cierra (Ctrl+X, luego Y, luego Enter)
6. Reinicia el backend

## Verificación

### 1. Verificar que el backend esté corriendo

El backend debe estar corriendo para que el formulario funcione. Verifica los logs del backend al iniciar:

- ✅ Si la configuración es correcta: `✅ Conexión con servidor de correo verificada correctamente`
- ❌ Si hay problemas: `❌ Error al verificar conexión con servidor de correo: [mensaje de error]`
- ⚠️ Si faltan variables: Verás un error listando qué variables faltan

### 2. Probar el endpoint de prueba

Puedes probar el envío de correo usando el endpoint de prueba:

```bash
curl -X POST https://antheacapital.com/api/contact/test
```

O desde el navegador, abre la consola (F12) y ejecuta:

```javascript
fetch('/api/contact/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Si funciona, deberías recibir un correo de prueba en contacto@antheacapital.com

## Solución de Problemas

### El correo no se envía pero no hay error

1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs del backend para ver si hay errores
3. Verifica que el puerto y el host sean correctos
4. Asegúrate de que la contraseña sea correcta

### Error de autenticación

- Verifica que el usuario y la contraseña sean correctos
- Si usas Gmail, asegúrate de usar una "Contraseña de aplicación", no tu contraseña normal
- Verifica que el servidor SMTP permita conexiones desde tu IP

### Error de conexión

- Verifica que el host y el puerto sean correctos
- Verifica que el firewall permita conexiones salientes en el puerto SMTP
- Prueba conectarte manualmente al servidor SMTP usando telnet o un cliente de correo

## Logs y Diagnóstico

El backend ahora registra información detallada sobre el envío de correos:

- Cuando se recibe un mensaje de contacto: `Nuevo mensaje de contacto recibido de: [email]`
- Cuando se envía el correo exitosamente: `✅ Correo enviado correctamente. MessageId: [id]`
- Cualquier error que ocurra durante el proceso: `❌ Error al enviar correo: [mensaje]`

### Cómo revisar los logs

**Si usas PM2:**
```bash
pm2 logs
```

**Si usas Node directamente:**
Los logs aparecerán en la consola donde ejecutaste el backend.

**Si usas Hostinger con Node.js:**
Revisa los logs en el panel de control de Hostinger > Node.js > Logs

## Problemas Comunes

### El formulario muestra "enviado" pero no llega el correo

1. **Verifica que las variables de entorno estén configuradas:**
   - Revisa los logs del backend al iniciar
   - Debe mostrar `✅ Conexión con servidor de correo verificada correctamente`

2. **Verifica que el correo no esté en spam:**
   - Revisa la carpeta de spam de contacto@antheacapital.com
   - Los correos pueden tardar unos minutos en llegar

3. **Verifica los logs del backend:**
   - Cuando envíes un formulario, revisa los logs
   - Busca mensajes de error que indiquen qué está fallando

4. **Prueba el endpoint de prueba:**
   - Usa el endpoint `/api/contact/test` para verificar que el correo funciona

### Error: "Variables de entorno de correo no configuradas"

Esto significa que falta alguna variable. Revisa el archivo `.env` y asegúrate de que todas las variables estén presentes.

### Error de autenticación SMTP

- Verifica que el usuario y contraseña sean correctos
- Asegúrate de usar la contraseña del correo, no la contraseña del panel de Hostinger
- Si usas Gmail, necesitas una "Contraseña de aplicación"
