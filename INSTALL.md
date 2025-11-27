# Guía de Instalación - Anthea Capital

## Requisitos

- Node.js 18.x o superior
- npm o yarn
- MongoDB Atlas (gratis) o PostgreSQL Supabase
- (Opcional) Cloudinary para imágenes

## Instalación

### 1. Instalar dependencias del Backend

```bash
cd backend
npm install
```

### 2. Instalar dependencias del Frontend

```bash
cd frontend
npm install
```

### 3. Configurar Variables de Entorno

#### Backend

Crear archivo `backend/.env`:

```env
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/anthea-capital
JWT_SECRET=tu-secret-key-muy-seguro
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=587
EMAIL_USER=admin@antheacapital.es
EMAIL_PASS=tu-password
EMAIL_FROM=admin@antheacapital.es
FRONTEND_URL=http://localhost:3000
PORT=3001
```

#### Frontend

Crear archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_FRONTEND_URL=http://localhost:3000
```

### 4. Crear Usuario Administrador

```bash
cd backend
npm run create-admin
```

O crear manualmente desde MongoDB/PostgreSQL con:
- Email: admin@antheacapital.es
- Password: (hasheado con bcrypt)
- Role: admin

### 5. Ejecutar en Desarrollo

#### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 6. Acceder a la Aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Admin Panel: http://localhost:3000/admin/login

## Estructura de Carpetas

```
.
├── frontend/          # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── backend/           # NestJS + TypeScript
│   ├── src/
│   │   ├── properties/
│   │   ├── auth/
│   │   ├── admin/
│   │   └── ...
│   └── package.json
└── README.md
```

## Comandos Útiles

### Backend
- `npm run start:dev` - Desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar versión compilada
- `npm run lint` - Linter

### Frontend
- `npm run dev` - Desarrollo con Vite
- `npm run build` - Compilar para producción
- `npm run preview` - Preview de build de producción
- `npm run lint` - Linter

## Solución de Problemas

### Error de conexión a base de datos
- Verificar DATABASE_URL en .env
- Verificar que la IP está en whitelist (MongoDB Atlas)
- Verificar credenciales

### Error de CORS
- Verificar FRONTEND_URL en backend/.env
- Verificar que el frontend está en el puerto correcto

### Error de autenticación
- Verificar JWT_SECRET en backend/.env
- Verificar que el usuario admin existe

## Próximos Pasos

1. Configurar base de datos en producción
2. Configurar Cloudinary o almacenamiento de imágenes
3. Configurar email SMTP
4. Desplegar en Hostinger (ver DEPLOYMENT.md)

