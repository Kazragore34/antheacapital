# 🚀 Instrucciones Finales - Solución Error 403

## ✅ Proyecto Recompilado con Rutas Relativas

He recompilado el proyecto con rutas relativas para que funcione mejor en Hostinger.

## 📦 Lo que DEBES Subir

### Opción 1: Solo archivos compilados (Recomendado)

**Sube TODO el contenido de `frontend/dist/` a la raíz de `public_html/`:**

1. Abre la carpeta `frontend/dist/` en tu computadora
2. Selecciona TODOS los archivos:
   - `index.html`
   - `assets/` (carpeta completa)
   - `.htaccess`
3. Súbelos a `public_html/` (raíz)

**Estructura final:**
```
public_html/
├── index.html
├── assets/
│   ├── index.css
│   └── index.js
└── .htaccess
```

### Opción 2: Si prefieres subir la carpeta completa (como tu otro proyecto)

Si en tu otro proyecto funciona subiendo todas las carpetas, puedes hacer lo mismo:

1. Sube la carpeta `frontend/` completa a `public_html/`
2. Luego mueve el contenido de `frontend/dist/` a la raíz de `public_html/`

O simplemente:
1. Sube `frontend/dist/` como carpeta a `public_html/`
2. Luego mueve todo el contenido de `public_html/dist/` a `public_html/`

## 🔍 Verificación

Después de subir, verifica en el File Manager de Hostinger:

1. **En `public_html/` debe haber:**
   - ✅ `index.html` (7.11 KiB aproximadamente)
   - ✅ `assets/` (carpeta)
   - ✅ `.htaccess` (1.04 KiB aproximadamente)

2. **Dentro de `assets/` debe haber:**
   - ✅ `index.css` (alrededor de 25-26 KB)
   - ✅ `index.js` (alrededor de 410 KB)

3. **NO debe haber:**
   - ❌ `package.json`
   - ❌ `src/`
   - ❌ `node_modules/`
   - ❌ Archivos `.md` (excepto si los necesitas)

## 🛠️ Si Sigue el Error 403

### Paso 1: Verificar Permisos
En Hostinger File Manager:
- Archivos: `644`
- Carpetas: `755`
- `.htaccess`: `644`

### Paso 2: Verificar que index.html existe
Abre `public_html/index.html` directamente en el navegador:
- Si ves el HTML pero sin estilos → problema con assets/
- Si ves 403 → problema de permisos o .htaccess

### Paso 3: Verificar .htaccess
Asegúrate de que `.htaccess` esté en `public_html/.htaccess` (no en subcarpeta)

### Paso 4: Probar con index.html simple
Crea un archivo `test.html` en `public_html/`:
```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Funciona!</h1></body>
</html>
```
- Si `test.html` funciona → el problema es con React Router
- Si `test.html` también da 403 → problema de permisos del servidor

## 📝 Notas Importantes

- Los archivos están compilados con rutas relativas (`./assets/` en lugar de `/assets/`)
- El `.htaccess` está configurado para React Router
- Si subes la carpeta `dist/` completa, asegúrate de mover su contenido a la raíz

## 🆘 Si Nada Funciona

1. Contacta soporte de Hostinger y pregunta:
   - ¿Está habilitado `mod_rewrite`?
   - ¿Hay restricciones en `.htaccess`?
   - ¿Los permisos están correctos?

2. Prueba acceder directamente a:
   - `https://antheacapital.es/index.html`
   - `https://antheacapital.es/assets/index.css`
   - `https://antheacapital.es/assets/index.js`

Si estos archivos cargan individualmente pero la página principal da 403, el problema es con el `.htaccess` o React Router.

