# Guía de Deployment - Anthea Capital

## Requisitos Previos

1. Cuenta en MongoDB Atlas (gratis) o PostgreSQL Supabase
2. Cuenta en Cloudinary (opcional, para imágenes)
3. Hostinger con Node.js habilitado
4. Acceso FTP/SSH a Hostinger

## Configuración de Base de Datos

### MongoDB Atlas (Recomendado)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito (M0)
3. Crear usuario de base de datos
4. Obtener connection string
5. Añadir IP a whitelist (0.0.0.0/0 para desarrollo)

### PostgreSQL Supabase (Alternativa)

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Obtener connection string desde Settings > Database

## Variables de Entorno

### Backend (.env)

```env
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/anthea-capital

# JWT
JWT_SECRET=tu-secret-key-muy-seguro-aqui
JWT_EXPIRES_IN=7d

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Email (Hostinger)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=admin@antheacapital.es
EMAIL_PASS=tu-password-email
EMAIL_FROM=admin@antheacapital.es

# Frontend URL
FRONTEND_URL=https://antheacapital.es

# Port
PORT=3001
```

### Frontend (.env)

```env
VITE_API_URL=https://antheacapital.es/api
VITE_FRONTEND_URL=https://antheacapital.es
```

## Proceso de Deployment

### 1. Preparar Backend

```bash
cd backend
npm install
npm run build
```

### 2. Preparar Frontend

```bash
cd frontend
npm install
npm run build
```

### 3. Subir a Hostinger

1. Conectar por FTP/SSH a la carpeta `public_html` de Hostinger
2. Subir carpeta `backend/dist` a `public_html/backend`
3. Subir carpeta `frontend/dist` a `public_html` (raíz)
4. Subir archivo `.env` del backend a `public_html/backend`
5. Subir archivo `.env` del frontend a `public_html/frontend` (si es necesario)

### 4. Configurar Node.js en Hostinger

1. Ir a panel de Hostinger
2. Node.js > Crear aplicación
3. Ruta: `/backend`
4. Versión Node: 18.x o superior
5. Start command: `node dist/main.js`
6. Port: 3001

### 5. Crear Usuario Admin

```bash
cd backend
npm run create-admin
# O manualmente desde MongoDB/PostgreSQL
```

## Estructura en Hostinger

```
public_html/
├── index.html (frontend)
├── assets/ (frontend build)
├── backend/
│   ├── dist/
│   ├── .env
│   └── node_modules/
└── uploads/ (si se usa almacenamiento local)
```

## Verificación

1. Verificar que el frontend carga correctamente
2. Verificar que el backend responde en `/api`
3. Probar login de admin
4. Probar creación de propiedad
5. Verificar formularios de contacto

## Mantenimiento

- Logs: Revisar logs en panel de Hostinger
- Backups: Configurar backups automáticos de base de datos
- Actualizaciones: Seguir proceso de deployment para actualizar

