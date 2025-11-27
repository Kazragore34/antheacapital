# Sitio Web Inmobiliaria Anthea Capital

Sitio web profesional para inmobiliaria con panel de administración.

## Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript
- **Base de Datos**: MongoDB Atlas (gratis) o PostgreSQL Supabase
- **Autenticación**: JWT
- **Imágenes**: Cloudinary o almacenamiento local

## Estructura

```
.
├── frontend/     # Aplicación React
├── backend/      # API NestJS
└── uploads/      # Imágenes (si se usa almacenamiento local)
```

## Desarrollo

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

