# 📦 Archivos a Subir a Hostinger

## ✅ Proyecto Compilado - Listo para Subir

### 🎯 Frontend (Subir a la raíz de `public_html/`)

**Carpeta:** `frontend/dist/`

Sube TODO el contenido de `frontend/dist/` directamente a la raíz de `public_html/` en Hostinger:

```
public_html/
├── index.html          ← De frontend/dist/
├── assets/             ← De frontend/dist/assets/
│   ├── index-*.css
│   └── index-*.js
└── .htaccess           ← De la raíz del proyecto (ya creado)
```

### 🔧 Backend (Subir a `public_html/backend/`)

**Carpeta:** `backend/dist/`

Sube la carpeta `backend/dist/` completa a `public_html/backend/`:

```
public_html/backend/
├── dist/
│   ├── main.js
│   ├── app.module.js
│   └── ... (todos los archivos compilados)
└── .env                ← Crear este archivo con tus variables
```

### 📝 Archivos Adicionales Necesarios

1. **`.htaccess`** (raíz del proyecto) → Subir a la raíz de `public_html/`
2. **`backend/.env`** → Crear en `public_html/backend/` con tus variables de entorno

### ⚙️ Configuración en Hostinger

1. **Node.js Application:**
   - Ruta: `/backend`
   - Start command: `node dist/main.js`
   - Port: `3001`

2. **Variables de Entorno:**
   - Crear archivo `.env` en `public_html/backend/`
   - Ver `backend/.env.example` para referencia

### 📋 Checklist de Subida

- [ ] Subir contenido de `frontend/dist/` a raíz de `public_html/`
- [ ] Subir `.htaccess` a raíz de `public_html/`
- [ ] Subir `backend/dist/` a `public_html/backend/`
- [ ] Crear `backend/.env` en Hostinger
- [ ] Configurar Node.js en panel de Hostinger
- [ ] Verificar que la página carga correctamente

### 🚀 Después de Subir

1. Accede a: `https://antheacapital.es`
2. Verifica que carga sin errores
3. Prueba las rutas: `/propiedades`, `/contacto`, etc.
4. Verifica el API: `https://antheacapital.es/api/properties`

