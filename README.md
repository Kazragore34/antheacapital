# Sitio Web Inmobiliaria Anthea Capital

Sitio web profesional para inmobiliaria con panel de administración.

## ⚠️ IMPORTANTE: Compilar antes de subir

**NO subas los archivos fuente directamente.** Debes compilar el proyecto primero.

### Compilación Rápida:

```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd ../backend
npm install
npm run build
```

Luego sube:
- **`frontend/dist/`** → raíz de `public_html/` en Hostinger
- **`backend/dist/`** → `public_html/backend/` en Hostinger
- **`.htaccess`** → raíz de `public_html/` en Hostinger

Ver `DEPLOY_INSTRUCTIONS.md` para más detalles.

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Base de Datos**: MongoDB Atlas (gratis) o PostgreSQL Supabase
- **Autenticación**: JWT
- **Imágenes**: Cloudinary o almacenamiento local

## Estructura

```
.
├── frontend/     # Aplicación React (compilar antes de subir)
├── backend/      # API NestJS (compilar antes de subir)
└── uploads/      # Imágenes (si se usa almacenamiento local)
```

## Desarrollo Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run start:dev
```

## Variables de Entorno

Crear archivos `.env` en frontend y backend según `.env.example`

## Deployment

Ver `DEPLOY_INSTRUCTIONS.md` para instrucciones detalladas de deployment.
