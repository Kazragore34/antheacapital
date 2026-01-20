# 🔍 Diagnóstico del Problema de Correo

## Pasos para Diagnosticar

### 1. Verificar que el backend esté corriendo

El backend debe estar activo para que el formulario funcione.

### 2. Verificar las Variables de Entorno

**En el servidor Hostinger**, verifica que existe el archivo `backend/.env` con estas líneas:

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=contacto@antheacapital.com
EMAIL_PASS=AC@pital2025-contacto#
EMAIL_FROM=contacto@antheacapital.com
```

**⚠️ IMPORTANTE:** 
- El archivo debe estar en la carpeta `backend/` del servidor
- La contraseña debe ser exactamente: `AC@pital2025-contacto#` (con el símbolo # al final)
- No debe haber espacios antes o después de los valores

### 3. Revisar los Logs del Backend

Cuando el backend inicia, deberías ver uno de estos mensajes:

**✅ Si está bien configurado:**
```
✅ Conexión con servidor de correo verificada correctamente
```

**❌ Si falta alguna variable:**
```
⚠️ Variables de entorno de correo no configuradas:
EMAIL_HOST: ✗
EMAIL_PORT: ✗
...
```

**❌ Si hay error de conexión:**
```
❌ Error al verificar conexión con servidor de correo: [mensaje de error]
```

### 4. Probar el Endpoint de Prueba

Abre la consola del navegador (F12) y ejecuta:

```javascript
fetch('/api/contact/test', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Si funciona correctamente**, deberías ver:
```json
{
  "success": true,
  "message": "Correo de prueba enviado correctamente. Revisa contacto@antheacapital.com"
}
```

**Si hay error**, verás un mensaje con los detalles del problema.

### 5. Revisar los Logs cuando Envías un Formulario

Cuando rellenas el formulario, revisa los logs del backend. Deberías ver:

```
Nuevo mensaje de contacto recibido de: [email]
Enviando correo a: contacto@antheacapital.com desde: contacto@antheacapital.com
✅ Correo enviado correctamente. MessageId: [id]
```

Si ves un error, copia el mensaje completo para diagnosticar.

## Problemas Comunes y Soluciones

### Problema 1: "Variables de entorno no configuradas"

**Solución:** 
- Verifica que el archivo `.env` existe en `backend/`
- Verifica que todas las variables están escritas correctamente
- Reinicia el backend después de crear/editar el `.env`

### Problema 2: "Error de autenticación SMTP"

**Posibles causas:**
- La contraseña es incorrecta
- El usuario es incorrecto
- El servidor SMTP no permite conexiones desde tu IP

**Solución:**
- Verifica que la contraseña es exactamente `AC@pital2025-contacto#`
- Verifica que el usuario es `contacto@antheacapital.com`
- Prueba conectarte manualmente al correo desde otro cliente (Outlook, Thunderbird) para verificar que las credenciales funcionan

### Problema 3: "Error de conexión"

**Posibles causas:**
- El servidor SMTP está bloqueado por firewall
- El puerto 587 está bloqueado
- El host es incorrecto

**Solución:**
- Verifica que `EMAIL_HOST=smtp.hostinger.com` (sin `https://` ni `/`)
- Verifica que `EMAIL_PORT=587`
- Contacta con Hostinger si el problema persiste

### Problema 4: "El correo se envía pero no llega"

**Posibles causas:**
- El correo está en spam
- El correo de destino está incorrecto
- El servidor SMTP rechazó el envío silenciosamente

**Solución:**
- Revisa la carpeta de spam de `contacto@antheacapital.com`
- Verifica que el correo de destino es correcto en el código (debe ser `contacto@antheacapital.com`)
- Revisa los logs del backend para ver si hay algún mensaje de advertencia

## Cómo Ver los Logs del Backend

### Si usas PM2:
```bash
pm2 logs
```

### Si usas Node directamente:
Los logs aparecen en la consola donde ejecutaste el backend.

### Si usas Hostinger con Node.js:
1. Ve al panel de control de Hostinger
2. Busca la sección "Node.js"
3. Haz clic en "Logs" o "Ver logs"

## Información que Necesito para Ayudarte

Si el problema persiste, necesito:

1. **Los logs del backend al iniciar** (especialmente los mensajes sobre la configuración de correo)
2. **Los logs cuando intentas enviar un formulario** (o cuando pruebas el endpoint `/api/contact/test`)
3. **El mensaje de error exacto** (si aparece alguno)
4. **Confirmación de que el archivo `.env` existe** en `backend/` con todas las variables
