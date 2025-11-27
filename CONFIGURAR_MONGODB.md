# 🗄️ Guía Completa: Configurar MongoDB Atlas para Anthea Capital

## 📋 Índice
1. [Crear cuenta en MongoDB Atlas](#1-crear-cuenta-en-mongodb-atlas)
2. [Crear un Cluster](#2-crear-un-cluster)
3. [Configurar Acceso a la Base de Datos](#3-configurar-acceso-a-la-base-de-datos)
4. [Obtener la Cadena de Conexión](#4-obtener-la-cadena-de-conexión)
5. [Configurar Variables de Entorno](#5-configurar-variables-de-entorno)
6. [Probar la Conexión](#6-probar-la-conexión)
7. [Crear Usuario Administrador](#7-crear-usuario-administrador)
8. [Poblar Propiedades de Ejemplo](#8-poblar-propiedades-de-ejemplo)

---

## 1. Crear Cuenta en MongoDB Atlas

### Paso 1.1: Registrarse
1. Ve a: **https://www.mongodb.com/cloud/atlas/register**
2. Completa el formulario de registro:
   - Email: Tu email
   - Contraseña: Crea una contraseña segura
   - Nombre: Tu nombre
   - Empresa: Anthea Capital (opcional)
3. Acepta los términos y condiciones
4. Haz clic en **"Create your Atlas account"**

### Paso 1.2: Verificar Email
- Revisa tu correo y haz clic en el enlace de verificación
- Serás redirigido al panel de MongoDB Atlas

---

## 2. Crear un Cluster

### Paso 2.1: Seleccionar Tipo de Cluster
1. En el panel de MongoDB Atlas, verás la opción **"Build a Database"**
2. Selecciona el plan **FREE (M0)** - Es completamente gratuito
3. Haz clic en **"Create"**

### Paso 2.2: Configurar el Cluster
1. **Cloud Provider & Region:**
   - Provider: **AWS** (recomendado) o **Google Cloud**
   - Region: Selecciona la más cercana a España (ej: **eu-west-1** para Irlanda o **eu-central-1** para Frankfurt)
   - ⚠️ **IMPORTANTE:** Elige una región en Europa para mejor rendimiento

2. **Cluster Tier:**
   - Ya está seleccionado **M0 Sandbox** (gratis)
   - No cambies esto

3. **Cluster Name:**
   - Nombre sugerido: `anthea-capital-cluster`
   - O déjalo con el nombre por defecto

4. Haz clic en **"Create Cluster"**
   - ⏱️ El cluster tardará 3-5 minutos en crearse

---

## 3. Configurar Acceso a la Base de Datos

### Paso 3.1: Crear Usuario de Base de Datos
1. Durante la creación del cluster, MongoDB te pedirá crear un usuario
2. Si no aparece, ve a **"Database Access"** en el menú lateral izquierdo
3. Haz clic en **"Add New Database User"**

4. **Configuración del Usuario:**
   - **Authentication Method:** Password
   - **Username:** `anthea-admin` (o el que prefieras)
   - **Password:** 
     - Haz clic en **"Autogenerate Secure Password"** (recomendado)
     - O crea tu propia contraseña (mínimo 8 caracteres, mayúsculas, minúsculas, números)
   - ⚠️ **IMPORTANTE:** Guarda esta contraseña, la necesitarás después

5. **Database User Privileges:**
   - Selecciona **"Atlas admin"** (acceso completo)
   - O **"Read and write to any database"** si prefieres

6. Haz clic en **"Add User"**

### Paso 3.2: Configurar Acceso de Red (IP Whitelist)
1. Ve a **"Network Access"** en el menú lateral izquierdo
2. Haz clic en **"Add IP Address"**

3. **Opciones:**
   - **Opción A (Desarrollo/Pruebas):** 
     - Haz clic en **"Allow Access from Anywhere"**
     - IP Address: `0.0.0.0/0`
     - ⚠️ Solo para desarrollo, no recomendado para producción
   
   - **Opción B (Producción - Recomendado):**
     - Obtén la IP de tu servidor Hostinger
     - Agrega esa IP específica
     - Para obtener la IP de Hostinger:
       1. Accede al panel de Hostinger
       2. Ve a "Información del servidor" o "Server Info"
       3. Copia la IP pública
     - Formato: `123.456.789.0/32` (IP específica)

4. Haz clic en **"Confirm"**

---

## 4. Obtener la Cadena de Conexión

### Paso 4.1: Conectar al Cluster
1. Ve a **"Database"** en el menú lateral
2. Haz clic en **"Connect"** en tu cluster

3. Selecciona **"Connect your application"**

4. **Driver & Version:**
   - Driver: **Node.js**
   - Version: **5.5 or later** (o la más reciente)

5. **Connection String:**
   - Verás algo como:
   ```
   mongodb+srv://<username>:<password>@anthea-capital-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Copiar la cadena:**
   - Haz clic en el icono de copiar
   - ⚠️ **IMPORTANTE:** Reemplaza `<username>` y `<password>` con las credenciales que creaste en el Paso 3.1
   - Ejemplo final:
   ```
   mongodb+srv://anthea-admin:TuPassword123@anthea-capital-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Paso 4.2: Especificar el Nombre de la Base de Datos
- Agrega el nombre de la base de datos al final de la cadena:
  ```
  mongodb+srv://anthea-admin:TuPassword123@anthea-capital-cluster.xxxxx.mongodb.net/anthea-capital?retryWrites=true&w=majority
  ```
  - Nota: `anthea-capital` es el nombre de la base de datos (puedes cambiarlo)

---

## 5. Configurar Variables de Entorno

### Paso 5.1: Crear Archivo .env en el Backend

**Ubicación:** `backend/.env`

**Contenido del archivo:**
```env
# MongoDB Atlas Connection String
DATABASE_URL=mongodb+srv://anthea-admin:TuPassword123@anthea-capital-cluster.xxxxx.mongodb.net/anthea-capital?retryWrites=true&w=majority

# JWT Secret (cambia esto por una cadena aleatoria segura)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_esto_123456789

# Port (opcional, por defecto 3001)
PORT=3001

# Email Configuration (opcional, para formularios de contacto)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=admin@antheacapital.es
EMAIL_PASS=tu_contraseña_de_email

# Cloudinary (opcional, para subir imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Frontend URL (para CORS)
FRONTEND_URL=https://antheacapital.es
```

### Paso 5.2: Reemplazar Valores
1. **DATABASE_URL:** Pega la cadena de conexión que obtuviste en el Paso 4.2
2. **JWT_SECRET:** Genera una cadena aleatoria segura:
   - Puedes usar: https://randomkeygen.com/
   - O generar con: `openssl rand -base64 32`
   - Mínimo 32 caracteres

### Paso 5.3: Subir .env a Hostinger
1. Crea el archivo `.env` en `public_html/backend/` en Hostinger
2. Copia el contenido del archivo `.env` local
3. Asegúrate de que los valores sean correctos

---

## 6. Probar la Conexión

### Paso 6.1: Desde el Backend Local (Opcional)
1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```

2. Instala dependencias (si no están instaladas):
   ```bash
   npm install
   ```

3. Inicia el servidor:
   ```bash
   npm run start:dev
   ```

4. Si la conexión es exitosa, verás:
   ```
   [Nest] Connected to MongoDB
   ```

### Paso 6.2: Desde Hostinger
1. Accede al panel de Hostinger
2. Ve a "Node.js Applications"
3. Asegúrate de que la aplicación esté configurada con:
   - **Start Command:** `node dist/main.js`
   - **Port:** `3001`
4. Inicia la aplicación
5. Revisa los logs para verificar la conexión

---

## 7. Crear Usuario Administrador

### Paso 7.1: Ejecutar Script de Creación
1. **Desde Hostinger (SSH):**
   ```bash
   cd public_html/backend
   npm install  # Si no están instaladas las dependencias
   npm run create-admin
   ```

2. **O desde tu computadora local:**
   ```bash
   cd backend
   npm run create-admin
   ```

3. **Configurar credenciales (opcional):**
   - Puedes crear un archivo `.env` con:
     ```env
     ADMIN_EMAIL=ana@antheacapital.es
     ADMIN_PASSWORD=tu_contraseña_segura
     ADMIN_NAME=Ana María Sánchez Trillo
     ```

4. **Resultado esperado:**
   ```
   Usuario admin creado exitosamente
   Email: ana@antheacapital.es
   Password: tu_contraseña_segura
   IMPORTANTE: Cambie la contraseña después del primer inicio de sesión
   ```

---

## 8. Poblar Propiedades de Ejemplo

### Paso 8.1: Ejecutar Script de Propiedades
1. **Desde Hostinger (SSH):**
   ```bash
   cd public_html/backend
   npm run seed-properties
   ```

2. **Resultado esperado:**
   ```
   ✅ 6 propiedades de ejemplo creadas exitosamente
   
   📊 Resumen:
      Total propiedades: 6
      En venta: 4
      En alquiler: 2
   ```

---

## 🔒 Seguridad

### Recomendaciones Importantes:

1. **Nunca compartas tu cadena de conexión públicamente**
2. **Usa contraseñas seguras** (mínimo 12 caracteres)
3. **Restringe el acceso por IP** en producción (no uses 0.0.0.0/0)
4. **Rota las contraseñas** periódicamente
5. **Habilita el monitoreo** en MongoDB Atlas para detectar problemas

---

## 🐛 Solución de Problemas

### Error: "Authentication failed"
- Verifica que el usuario y contraseña sean correctos
- Asegúrate de haber reemplazado `<username>` y `<password>` en la cadena de conexión

### Error: "IP not whitelisted"
- Verifica que tu IP esté en la lista blanca de MongoDB Atlas
- Si usas Hostinger, agrega la IP del servidor

### Error: "Connection timeout"
- Verifica que el cluster esté activo en MongoDB Atlas
- Revisa la región del cluster (debe estar cerca de tu servidor)

### Error: "Database not found"
- La base de datos se crea automáticamente al conectarse
- Asegúrate de que el nombre en la cadena de conexión sea correcto

---

## 📞 Información de Contacto MongoDB

- **Documentación:** https://docs.atlas.mongodb.com/
- **Soporte:** Disponible en el panel de MongoDB Atlas
- **Comunidad:** https://community.mongodb.com/

---

## ✅ Checklist Final

- [ ] Cuenta de MongoDB Atlas creada
- [ ] Cluster M0 creado y activo
- [ ] Usuario de base de datos creado
- [ ] IP whitelist configurada
- [ ] Cadena de conexión obtenida
- [ ] Archivo `.env` creado con DATABASE_URL
- [ ] JWT_SECRET configurado
- [ ] Conexión probada exitosamente
- [ ] Usuario administrador creado
- [ ] Propiedades de ejemplo creadas

---

## 📝 Notas Adicionales

- **Límites del Plan Gratis (M0):**
  - 512 MB de almacenamiento
  - Compartido con otros usuarios
  - Suficiente para desarrollo y sitios pequeños

- **Upgrade a Plan de Pago:**
  - Si necesitas más recursos, puedes actualizar en cualquier momento
  - Planes desde $9/mes disponibles

- **Backups:**
  - El plan gratuito no incluye backups automáticos
  - Considera hacer backups manuales periódicamente

