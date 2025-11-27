# Instrucciones de Deployment

## ⚠️ IMPORTANTE: El frontend DEBE ser compilado antes de subir

Los archivos fuente de React NO funcionan directamente en el servidor. Necesitas compilar el proyecto primero.

## Opción 1: Build Manual (Recomendado para empezar)

### En tu máquina local:

```bash
# 1. Instalar dependencias del frontend
cd frontend
npm install

# 2. Compilar frontend
npm run build
# Esto crea la carpeta frontend/dist con los archivos compilados

# 3. Instalar dependencias del backend
cd ../backend
npm install

# 4. Compilar backend
npm run build
# Esto crea la carpeta backend/dist con los archivos compilados
```

### Subir a Hostinger:

1. **Sube el contenido de `frontend/dist/` a la raíz de `public_html/` en Hostinger**
   - Todos los archivos dentro de `dist/` van directamente a `public_html/`
   - Incluye: index.html, assets/, etc.

2. **Sube el archivo `.htaccess` a la raíz de `public_html/`**

3. **Sube la carpeta `backend/dist/` a `public_html/backend/`**

4. **Crea el archivo `.env` en `public_html/backend/` con tus variables de entorno**

5. **Configura Node.js en Hostinger:**
   - Ruta: `/backend`
   - Start command: `node dist/main.js`
   - Port: 3001

## Opción 2: Usar GitHub Actions (Automático)

Si tienes configurado GitHub Actions:

1. Añade estos secrets en GitHub:
   - `FTP_SERVER`: Tu servidor FTP de Hostinger
   - `FTP_USERNAME`: Tu usuario FTP
   - `FTP_PASSWORD`: Tu contraseña FTP

2. El workflow se ejecutará automáticamente al hacer push

## Estructura Final en Hostinger:

```
public_html/
├── index.html          (del frontend/dist)
├── assets/             (del frontend/dist)
├── .htaccess           (importante para React Router)
├── backend/
│   ├── dist/
│   ├── .env
│   └── package.json
└── ...
```

## Verificación:

1. Accede a tu dominio: `https://antheacapital.es`
2. Debe cargar la página sin errores 403
3. Verifica que las rutas funcionen (ej: `/propiedades`)
4. Verifica que el API funcione: `https://antheacapital.es/api/properties`

## Problemas Comunes:

### Error 403 Forbidden:
- ✅ Asegúrate de haber compilado el frontend (`npm run build`)
- ✅ Sube los archivos de `frontend/dist/`, NO los archivos fuente
- ✅ Verifica que el `.htaccess` esté en la raíz

### Las rutas no funcionan:
- ✅ Verifica que el `.htaccess` esté presente
- ✅ Verifica que mod_rewrite esté habilitado en Hostinger

### El backend no funciona:
- ✅ Verifica que Node.js esté configurado en Hostinger
- ✅ Verifica que el `.env` tenga las variables correctas
- ✅ Verifica los logs en el panel de Hostinger

