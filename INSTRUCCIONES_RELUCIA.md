# ✅ Estructura Igual que Relucia - Lista para Subir

## 📦 Archivos en la Raíz (Igual que Relucia)

Ahora el proyecto tiene la misma estructura que relucia:

```
.
├── index.html          ← En la raíz (igual que relucia)
├── assets/             ← En la raíz (igual que relucia)
│   ├── index-Cp1pKPGo.js
│   └── index-DMKegeh8.css
├── .htaccess           ← En la raíz
├── frontend/           ← Código fuente (no subir)
├── backend/            ← Backend (subir dist/)
└── ...
```

## 🚀 Cómo Subir a Hostinger

### Opción 1: Subir Solo lo Necesario (Recomendado)

**Sube estos archivos/carpetas a la raíz de `public_html/`:**

1. ✅ `index.html` → `public_html/index.html`
2. ✅ `assets/` (carpeta completa) → `public_html/assets/`
3. ✅ `.htaccess` → `public_html/.htaccess`
4. ✅ `backend/dist/` → `public_html/backend/dist/`

### Opción 2: Subir Todo (Como Relucia)

Si en relucia subes todas las carpetas, puedes hacer lo mismo:

1. Sube TODO el contenido de la raíz a `public_html/`
2. Esto incluirá: `index.html`, `assets/`, `.htaccess`, `frontend/`, `backend/`, etc.
3. El servidor buscará `index.html` en la raíz y funcionará

## 📋 Estructura Final en Hostinger

```
public_html/
├── index.html          ← DEBE estar aquí
├── assets/             ← DEBE estar aquí
│   ├── index-Cp1pKPGo.js
│   └── index-DMKegeh8.css
├── .htaccess           ← DEBE estar aquí
├── backend/
│   └── dist/
└── ... (otros archivos si subes todo)
```

## 🔍 Verificación

Después de subir, verifica en Hostinger:

1. **`public_html/index.html` existe** ✅
2. **`public_html/assets/` existe y tiene los archivos** ✅
3. **`public_html/.htaccess` existe** ✅

## 🛠️ Script Automático

He creado `deploy-frontend.bat` que:
1. Compila el frontend
2. Copia `index.html` a la raíz
3. Copia `assets/` a la raíz
4. Copia `.htaccess` a la raíz

**Ejecuta:** `deploy-frontend.bat` antes de subir

## ⚠️ Si Sigue el Error 403

### 1. Verifica que index.html esté en la raíz
- Abre el File Manager de Hostinger
- Ve a `public_html/`
- Debe haber `index.html` directamente ahí
- NO debe estar en `public_html/frontend/` o `public_html/dist/`

### 2. Verifica Permisos
- `index.html`: 644
- `assets/`: 755 (carpeta)
- Archivos dentro de `assets/`: 644
- `.htaccess`: 644

### 3. Prueba Acceso Directo
Intenta acceder directamente a:
- `https://antheacapital.es/index.html`
- `https://antheacapital.es/assets/index-Cp1pKPGo.js`
- `https://antheacapital.es/assets/index-DMKegeh8.css`

Si estos archivos cargan pero la página principal da 403, el problema es con el `.htaccess`.

### 4. Simplifica .htaccess Temporalmente
Si sigue el error, prueba con un `.htaccess` más simple:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 5. Contacta Soporte Hostinger
Si nada funciona, pregunta:
- ¿Está habilitado `mod_rewrite`?
- ¿Hay alguna restricción en `.htaccess`?
- ¿Los permisos están correctos?

## 🎯 Diferencia con Versiones Anteriores

- ✅ `index.html` ahora está en la raíz (igual que relucia)
- ✅ `assets/` ahora está en la raíz (igual que relucia)
- ✅ `.htaccess` simplificado
- ✅ Rutas absolutas (`/assets/`) en el HTML

**Ahora la estructura es IDÉNTICA a relucia. Debería funcionar.**

