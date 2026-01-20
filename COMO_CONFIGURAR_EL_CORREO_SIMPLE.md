# 📧 Cómo Configurar el Correo - Guía Simple

## ✅ Lo que ya está hecho

El código **YA está configurado** para enviar todos los mensajes a **contacto@antheacapital.com**. 

Cuando alguien rellena el formulario:
1. El formulario envía los datos al backend
2. El backend envía un correo a **contacto@antheacapital.com** con toda la información
3. Tú recibes el correo en tu bandeja de entrada

## 🔧 Lo que necesitas hacer

Solo necesitas decirle al backend **cómo conectarse** al servidor de correo de Hostinger. Es como cuando configuras tu teléfono para recibir correos: necesitas el servidor, el usuario y la contraseña.

### Paso 1: Obtener las credenciales SMTP de Hostinger

1. Entra al panel de control de Hostinger
2. Ve a "Correo" o "Email"
3. Busca la cuenta `contacto@antheacapital.com`
4. Necesitas:
   - **Servidor SMTP**: `smtp.hostinger.com`
   - **Puerto**: `587`
   - **Usuario**: `contacto@antheacapital.com`
   - **Contraseña**: La contraseña que configuraste para ese correo en Hostinger

**⚠️ IMPORTANTE:** Esta es la contraseña del correo `contacto@antheacapital.com` en Hostinger, NO tu contraseña personal del panel.

### Paso 2: Configurar las variables en el servidor

Crea un archivo `.env` en la carpeta `backend/` con esto:

```env
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=contacto@antheacapital.com
EMAIL_PASS=la-contraseña-del-correo-aqui
EMAIL_FROM=contacto@antheacapital.com
```

### Paso 3: Reiniciar el backend

Después de guardar el archivo `.env`, reinicia el backend para que cargue las nuevas configuraciones.

## 🧪 Probar que funciona

Una vez configurado, puedes probar enviando un mensaje desde el formulario o usando el endpoint de prueba.

## ❓ Preguntas Frecuentes

### ¿Por qué necesito la contraseña del correo?

Porque el backend necesita **autenticarse** en el servidor SMTP de Hostinger para poder enviar correos. Es como cuando configuras Outlook o Gmail en tu teléfono: necesitas las credenciales del servidor.

### ¿Es seguro?

Sí, la contraseña se guarda en el archivo `.env` que está en el servidor y NO se sube a Git (está en `.gitignore`). Solo tú y el servidor tienen acceso a ella.

### ¿Puedo usar otro correo?

Sí, puedes usar cualquier correo que tengas configurado en Hostinger. Solo cambia `EMAIL_USER` y `EMAIL_FROM` al correo que quieras usar.

### ¿El correo se envía a mi correo personal?

No, el correo se envía a **contacto@antheacapital.com** (que ya está configurado en el código). Las credenciales SMTP solo se usan para que el backend pueda conectarse al servidor y enviar el correo.

## 🔍 Verificar que funciona

Cuando reinicies el backend, deberías ver en los logs:

```
✅ Conexión con servidor de correo verificada correctamente
```

Si ves esto, ¡todo está bien configurado! 🎉
