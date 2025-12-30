# 🚀 Instrucciones para Desplegar los Cambios

## ✅ Estado Actual

**Archivos listos:**
- ✅ `index.html` - Apunta a los archivos correctos
- ✅ `assets/index-QGaphY-D.js` - JavaScript compilado (423.92 kB)
- ✅ `assets/index-DpyLPUg0.css` - CSS compilado (35.95 kB)
- ✅ `assets/logo-black-C0Rp06qi.png` - Logo
- ✅ `.github/workflows/deploy.yml` - Actualizado para priorizar archivos de la raíz

## 📝 Pasos para Desplegar

### 1. **Agregar todos los cambios a Git:**

```bash
git add .
```

Esto agregará:
- ✅ `index.html` (actualizado)
- ✅ `assets/index-DpyLPUg0.css` (nuevo)
- ✅ `assets/index-QGaphY-D.js` (nuevo)
- ✅ `frontend/src/components/ui/ContactForm.tsx` (desplegable)
- ✅ `.github/workflows/deploy.yml` (mejorado)
- ✅ Eliminará archivos antiguos (`index-EjAZsPjx.js`, `index-MYtAuCeg.css`)

### 2. **Hacer Commit:**

```bash
git commit -m "Add: Desplegable protección de datos + mejoras deploy"
```

### 3. **Hacer Push a GitHub:**

```bash
git push origin main
```

### 4. **GitHub Actions Desplegará Automáticamente:**

- ✅ Se ejecutará el workflow `.github/workflows/deploy.yml`
- ✅ Construirá el frontend
- ✅ Copiará los archivos de la raíz (`index.html`, `assets/`, `.htaccess`)
- ✅ Subirá todo a Hostinger vía FTP

### 5. **Verificar el Despliegue:**

1. Ir a: https://github.com/Kazragore34/antheacapital/actions
2. Verificar que el workflow se ejecutó correctamente
3. Esperar 2-3 minutos para que se complete
4. Probar en: https://antheacapital.es/contacto

## 🔍 Verificación

**En el sitio web, verificar:**
- ✅ El desplegable de "Información de Protección de Datos" funciona
- ✅ Se puede expandir/colapsar con animación
- ✅ Los estilos se ven correctos
- ✅ El logo aparece en el header

## ⚠️ Si No Se Actualiza

**Posibles causas:**
1. **Cache del navegador:**
   - Presionar `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
   - O abrir en modo incógnito

2. **GitHub Actions no se ejecutó:**
   - Verificar en: https://github.com/Kazragore34/antheacapital/actions
   - Si hay error, revisar los logs

3. **Archivos no se subieron:**
   - Verificar en el panel de Hostinger que los archivos están en `public_html/`
   - Verificar que `index.html` apunta a los archivos correctos

## 📦 Archivos que se Subirán

```
public_html/
├── index.html (apunta a /assets/index-QGaphY-D.js y /assets/index-DpyLPUg0.css)
├── assets/
│   ├── index-QGaphY-D.js
│   ├── index-DpyLPUg0.css
│   └── logo-black-C0Rp06qi.png
├── .htaccess
└── backend/
    └── ...
```

## ✅ Todo Listo

**Solo necesitas ejecutar:**
```bash
git add .
git commit -m "Add: Desplegable protección de datos + mejoras deploy"
git push origin main
```

**Y GitHub Actions hará el resto automáticamente.**

