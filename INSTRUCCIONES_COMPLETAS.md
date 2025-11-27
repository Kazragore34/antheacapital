# 📋 Instrucciones Completas - Anthea Capital

## ✅ Estado Actual del Proyecto

### Frontend
- ✅ **Recompilado completamente** desde cero
- ✅ **Archivo nuevo:** `index-CDUN8FSv.js` (reemplaza el antiguo `index-Cp1pKPGo.js`)
- ✅ **Protecciones agregadas** para evitar errores `e.map is not a function`
- ✅ **Todos los archivos listos** en `frontend/dist/`

### Backend
- ✅ **Script de propiedades de ejemplo** creado
- ✅ **Protecciones en el servicio** de propiedades
- ✅ **Documentación de MongoDB** creada

---

## 🚀 PASO 1: Subir Archivos del Frontend

### 📁 Archivos a Subir

**Ubicación local:** `frontend/dist/`

**Subir a:** Raíz de `public_html/` en Hostinger

### Contenido de `frontend/dist/`:
```
frontend/dist/
├── index.html                    ← SUBIR
├── .htaccess                     ← SUBIR (muy importante)
└── assets/
    ├── index-CDUN8FSv.js         ← SUBIR (NUEVO archivo)
    └── index-DMKegeh8.css        ← SUBIR
```

### ⚠️ ACCIONES IMPORTANTES:

1. **ELIMINAR el archivo antiguo:**
   - En Hostinger, ve a `public_html/assets/`
   - **ELIMINA** `index-Cp1pKPGo.js` (el archivo antiguo)
   - Solo debe quedar `index-CDUN8FSv.js`

2. **Verificar estructura final en Hostinger:**
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   └── assets/
       ├── index-CDUN8FSv.js    ← SOLO este archivo JS
       └── index-DMKegeh8.css
   ```

3. **Permisos de archivos:**
   - Archivos: `644`
   - Carpetas: `755`
   - `.htaccess`: `644`

---

## 🗄️ PASO 2: Configurar MongoDB Atlas

### 📖 Guía Completa
Ver el archivo: **`CONFIGURAR_MONGODB.md`**

### Resumen Rápido:

1. **Crear cuenta:** https://www.mongodb.com/cloud/atlas/register
2. **Crear cluster M0** (gratis)
3. **Crear usuario** de base de datos
4. **Configurar IP whitelist** (agregar IP de Hostinger)
5. **Obtener cadena de conexión**
6. **Crear archivo `.env`** en `public_html/backend/`

### Ejemplo de `.env`:
```env
DATABASE_URL=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/anthea-capital?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_jwt_super_seguro_minimo_32_caracteres
PORT=3001
FRONTEND_URL=https://antheacapital.es
```

---

## 🔧 PASO 3: Configurar Backend en Hostinger

### 3.1 Subir Backend
1. Compilar el backend (si no está compilado):
   ```bash
   cd backend
   npm run build
   ```

2. Subir `backend/dist/` a `public_html/backend/dist/`

3. Subir `backend/package.json` a `public_html/backend/`

4. Crear `.env` en `public_html/backend/` con tus variables

### 3.2 Configurar Node.js en Hostinger
1. Accede al panel de Hostinger
2. Ve a **"Node.js Applications"**
3. Crea una nueva aplicación:
   - **Name:** `anthea-backend`
   - **Node.js Version:** `18.x` o `20.x`
   - **Application Root:** `/backend`
   - **Application URL:** `/api` (o como esté configurado)
   - **Application Startup File:** `dist/main.js`
   - **Port:** `3001`

4. **Variables de Entorno:**
   - Agrega las variables del archivo `.env` en el panel
   - O asegúrate de que el archivo `.env` esté en `public_html/backend/`

5. **Iniciar la aplicación**

---

## 👤 PASO 4: Crear Usuario Administrador

### Desde SSH en Hostinger:
```bash
cd public_html/backend
npm install  # Si no están instaladas las dependencias
npm run create-admin
```

### O configurar credenciales en `.env`:
```env
ADMIN_EMAIL=ana@antheacapital.es
ADMIN_PASSWORD=tu_contraseña_segura
ADMIN_NAME=Ana María Sánchez Trillo
```

---

## 🏠 PASO 5: Crear Propiedades de Ejemplo

### Desde SSH en Hostinger:
```bash
cd public_html/backend
npm run seed-properties
```

### Resultado esperado:
```
✅ 6 propiedades de ejemplo creadas exitosamente

📊 Resumen:
   Total propiedades: 6
   En venta: 4
   En alquiler: 2
```

---

## ✅ PASO 6: Verificar que Todo Funciona

### 6.1 Limpiar Caché del Navegador
- **Chrome/Edge:** `Ctrl + Shift + Delete`
- Selecciona "Caché" o "Cached images and files"
- Limpia y recarga

### 6.2 Verificar Archivos
1. Abre `https://antheacapital.es/`
2. Abre herramientas de desarrollador (F12)
3. Ve a la pestaña **Network** (Red)
4. Recarga la página
5. **Verifica que se carga:**
   - ✅ `index-CDUN8FSv.js` (NUEVO)
   - ❌ NO debe aparecer `index-Cp1pKPGo.js` (antiguo)

### 6.3 Verificar API
1. Abre `https://antheacapital.es/api/properties` en el navegador
2. Deberías ver un JSON con las propiedades (o `[]` si no hay propiedades aún)

### 6.4 Probar Páginas
- ✅ `https://antheacapital.es/` - Debe cargar sin errores
- ✅ `https://antheacapital.es/propiedades` - Debe mostrar propiedades
- ✅ `https://antheacapital.es/admin` - Panel de administración

---

## 🐛 Solución de Problemas

### Error: "e.map is not a function"
**Causa:** El navegador está usando el archivo antiguo en caché

**Solución:**
1. Elimina el archivo antiguo `index-Cp1pKPGo.js` de Hostinger
2. Limpia la caché del navegador completamente
3. Recarga la página con `Ctrl + F5` (forzar recarga)

### Error: "API no disponible"
**Causa:** El backend no está corriendo o no está configurado correctamente

**Solución:**
1. Verifica que Node.js esté corriendo en Hostinger
2. Revisa los logs del backend
3. Verifica que `.env` tenga la configuración correcta
4. Verifica que MongoDB Atlas esté accesible desde la IP de Hostinger

### Error: "403 Forbidden"
**Causa:** Permisos incorrectos o `.htaccess` no está en la raíz

**Solución:**
1. Verifica permisos: archivos `644`, carpetas `755`
2. Asegúrate de que `.htaccess` esté en la raíz de `public_html/`
3. Verifica que el contenido de `.htaccess` sea correcto

### Página en Blanco
**Causa:** Error de JavaScript o archivo incorrecto

**Solución:**
1. Abre la consola del navegador (F12)
2. Revisa los errores
3. Verifica en Network que se carguen los archivos correctos
4. Asegúrate de que `index.html` apunte al archivo correcto

---

## 📝 Checklist Final

### Frontend
- [ ] Archivos de `frontend/dist/` subidos a raíz de `public_html/`
- [ ] Archivo antiguo `index-Cp1pKPGo.js` eliminado
- [ ] `.htaccess` está en la raíz de `public_html/`
- [ ] Permisos correctos (archivos 644, carpetas 755)

### Backend
- [ ] MongoDB Atlas configurado
- [ ] Archivo `.env` creado con DATABASE_URL
- [ ] Backend compilado y subido
- [ ] Node.js configurado en Hostinger
- [ ] Backend corriendo y accesible

### Base de Datos
- [ ] Usuario administrador creado
- [ ] Propiedades de ejemplo creadas
- [ ] API responde correctamente

### Verificación
- [ ] Página principal carga sin errores
- [ ] Página de propiedades muestra datos
- [ ] Panel de administración funciona
- [ ] No hay errores en la consola del navegador

---

## 📞 Archivos de Referencia

- **`CONFIGURAR_MONGODB.md`** - Guía completa de MongoDB Atlas
- **`SOLUCION_ERROR_MAP.md`** - Solución al error `e.map is not a function`
- **`QUE_SUBIR.md`** - Lista de archivos a subir
- **`DEPLOYMENT.md`** - Instrucciones de deployment generales

---

## 🎯 Orden de Ejecución Recomendado

1. ✅ Subir archivos del frontend
2. ✅ Eliminar archivo antiguo
3. ✅ Configurar MongoDB Atlas
4. ✅ Crear archivo `.env` en backend
5. ✅ Subir y configurar backend
6. ✅ Crear usuario administrador
7. ✅ Crear propiedades de ejemplo
8. ✅ Verificar que todo funciona

---

## ⚠️ IMPORTANTE

- **NUNCA** subas archivos fuente (`frontend/src/`) a producción
- **SIEMPRE** sube solo los archivos compilados (`frontend/dist/`)
- **VERIFICA** que el archivo antiguo `index-Cp1pKPGo.js` esté eliminado
- **LIMPIA** la caché del navegador después de subir archivos nuevos
- **GUARDA** las credenciales de MongoDB Atlas en un lugar seguro

