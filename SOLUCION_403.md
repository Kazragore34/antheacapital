# 🔧 Solución Error 403 Forbidden

## Problema
El error 403 Forbidden generalmente ocurre por:

1. **Archivos incorrectos subidos** (archivos fuente en lugar de compilados)
2. **Falta el archivo .htaccess**
3. **Permisos incorrectos en el servidor**
4. **El archivo index.html no está en la raíz**

## ✅ Solución Paso a Paso

### 1. Verificar Archivos Subidos

**IMPORTANTE:** Solo debes subir los archivos de `frontend/dist/`, NO los archivos fuente.

En la raíz de `public_html/` debe haber:
```
public_html/
├── index.html          ← DEBE estar aquí
├── assets/             ← Carpeta con CSS y JS
│   ├── index-*.css
│   └── index-*.js
└── .htaccess           ← MUY IMPORTANTE
```

### 2. Verificar .htaccess

El archivo `.htaccess` DEBE estar en la raíz de `public_html/`.

He creado también un `.htaccess` dentro de `frontend/dist/` para que se suba automáticamente.

### 3. Verificar Permisos

En Hostinger, verifica que los archivos tengan permisos correctos:
- Archivos: `644` o `644`
- Carpetas: `755`
- `.htaccess`: `644`

### 4. Verificar Estructura Correcta

**❌ INCORRECTO (esto causa 403):**
```
public_html/
├── src/              ← NO subir esto
├── components/       ← NO subir esto
└── pages/            ← NO subir esto
```

**✅ CORRECTO:**
```
public_html/
├── index.html        ← SÍ, de frontend/dist/
├── assets/           ← SÍ, de frontend/dist/assets/
└── .htaccess         ← SÍ, de la raíz del proyecto
```

### 5. Limpiar y Volver a Subir

Si ya subiste archivos incorrectos:

1. **Elimina TODO** de `public_html/` (excepto `backend/` si ya lo configuraste)
2. **Sube SOLO** el contenido de `frontend/dist/`:
   - `index.html`
   - `assets/` (carpeta completa)
3. **Sube el `.htaccess`** a la raíz
4. **Verifica** que `index.html` esté directamente en `public_html/`

### 6. Verificar en el Navegador

Después de subir:
1. Accede a: `https://antheacapital.es`
2. Si sigue el 403, verifica:
   - ¿Existe `index.html` en la raíz?
   - ¿Existe `.htaccess` en la raíz?
   - ¿Los permisos son correctos?

### 7. Verificar Logs

En el panel de Hostinger:
- Revisa los logs de errores
- Verifica si hay mensajes sobre `.htaccess` o permisos

## 📋 Checklist Final

- [ ] Eliminé todos los archivos fuente de `public_html/`
- [ ] Subí SOLO el contenido de `frontend/dist/` a la raíz
- [ ] El archivo `index.html` está en `public_html/index.html`
- [ ] La carpeta `assets/` está en `public_html/assets/`
- [ ] El archivo `.htaccess` está en `public_html/.htaccess`
- [ ] Los permisos son correctos (644 para archivos, 755 para carpetas)
- [ ] Limpié la caché del navegador (Ctrl+F5)

## 🔍 Verificación Rápida

Abre el File Manager de Hostinger y verifica:

1. En `public_html/` debe haber:
   - ✅ `index.html`
   - ✅ `.htaccess`
   - ✅ `assets/` (carpeta)

2. NO debe haber:
   - ❌ `src/`
   - ❌ `components/`
   - ❌ `pages/`
   - ❌ `package.json`
   - ❌ `vite.config.ts`

## 💡 Si Aún No Funciona

1. **Contacta con soporte de Hostinger** y pregunta:
   - ¿Está habilitado `mod_rewrite`?
   - ¿Hay alguna restricción en `.htaccess`?

2. **Prueba un index.html simple** primero:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Test</title></head>
   <body><h1>Funciona!</h1></body>
   </html>
   ```
   Si esto funciona, el problema es con React Router. Si no funciona, es un problema de permisos.

