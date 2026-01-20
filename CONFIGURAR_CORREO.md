# Configuración del Servicio de Correo

## Variables de Entorno Requeridas

Para que el formulario de contacto funcione correctamente, necesitas configurar las siguientes variables de entorno en tu servidor:

```env
EMAIL_HOST=smtp.tu-servidor.com
EMAIL_PORT=587
EMAIL_USER=tu-usuario@tu-servidor.com
EMAIL_PASS=tu-contraseña
EMAIL_FROM=noreply@antheacapital.com
```

## Configuración para Hostinger

Si estás usando Hostinger, puedes usar el servidor SMTP de Hostinger:

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=contacto@antheacapital.com
EMAIL_PASS=tu-contraseña-de-correo
EMAIL_FROM=contacto@antheacapital.com
```

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

1. Accede al panel de control de Hostinger
2. Ve a "Archivos" > "Administrador de archivos"
3. Navega a la carpeta `backend/`
4. Crea o edita el archivo `.env`
5. Agrega las variables de entorno con tus credenciales
6. Reinicia el backend

## Verificación

Después de configurar las variables, el backend mostrará en los logs:

- ✅ Si la configuración es correcta: `✅ Conexión con servidor de correo verificada correctamente`
- ❌ Si hay problemas: `❌ Error al verificar conexión con servidor de correo: [mensaje de error]`

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

## Logs

El backend ahora registra información detallada sobre el envío de correos:

- Cuando se recibe un mensaje de contacto
- Cuando se envía el correo exitosamente
- Cualquier error que ocurra durante el proceso

Revisa los logs del backend para diagnosticar problemas.
