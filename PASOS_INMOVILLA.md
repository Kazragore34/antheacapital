# Pasos para Completar la Integración con Inmovilla

## ✅ Paso 1: Configuración SPF (YA COMPLETADO)

Ya configuraste el SPF en Hostinger con `include:externo.inmovilla.com`. ¡Perfecto!

---

## 📋 Paso 2: Frontend Lee XML Directamente (SIN BACKEND)

### 2.1. ✅ Configuración Completada

**IMPORTANTE:** Debido a las limitaciones de Hostinger (no permite ejecutar Node.js), el frontend ahora lee el XML de Inmovilla **directamente desde el navegador**, sin necesidad de un backend ejecutándose.

### 2.2. Cómo Funciona

- El frontend hace una petición HTTP directamente a: `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
- Parsea el XML usando `DOMParser` del navegador
- Transforma las propiedades al formato interno
- Las muestra en la página `/propiedades`

### 2.3. URL del XML

- **URL XML de Prueba:** `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
- **Número de Agencia:** `2`
- **Password:** `82ku9xz2aw3`

**Nota:** Cuando tengas la URL real de producción de Inmovilla, solo necesitas cambiar la constante `XML_URL` en `frontend/src/services/xml-properties.service.ts`.

---

## 📁 Paso 3: Verificar Archivos PHP

### 3.1. Verificar que las Carpetas Existan

Asegúrate de que estas carpetas estén en la **raíz del proyecto** (mismo nivel que `frontend/`, `backend/`, etc.):

```
anthea/
├── ficha/
│   └── index.php
├── cliente/
│   └── index.php
├── frontend/
├── backend/
└── ...
```

### 3.2. Verificar Contenido de los Archivos PHP

**`ficha/index.php`** debe redirigir a:
```
https://antheacapital.com/propiedades?post_id=XXXXX
```

**`cliente/index.php`** debe mostrar el panel de clientes de Inmovilla.

### 3.3. Subir Archivos PHP a Hostinger (Manual)

**IMPORTANTE:** Los archivos PHP deben estar en la **raíz de `public_html`** en Hostinger.

1. Conecta por FTP a tu Hostinger
2. Navega a `public_html/`
3. Crea las carpetas `ficha/` y `cliente/` si no existen
4. Sube los archivos:
   - `ficha/index.php` → `public_html/ficha/index.php`
   - `cliente/index.php` → `public_html/cliente/index.php`

**O espera al deploy automático:** El workflow de GitHub Actions también copiará estos archivos automáticamente cuando hagas push.

---

## 🚀 Paso 4: Desplegar y Verificar

### 4.1. Hacer Commit y Push

```bash
git add .
git commit -m "feat: Integración con Inmovilla CRM - XML, PHP y redirecciones"
git push origin main
```

Esto activará el workflow de GitHub Actions que:
- Compilará el frontend y backend
- Copiará los archivos PHP (`ficha/` y `cliente/`)
- Desplegará todo a Hostinger

### 4.2. Verificar que el Deploy Funcionó

Espera unos minutos a que termine el deploy y luego verifica:

#### a) Verificar Archivos PHP

1. Accede a: `https://antheacapital.com/ficha/index.php?codigo=2_395378`
   - Debe redirigir a: `https://antheacapital.com/propiedades?post_id=395378`
   - Y luego mostrar la propiedad con ID 395378

2. Accede a: `https://antheacapital.com/cliente/index.php?cliente=2`
   - Debe mostrar el panel de clientes de Inmovilla

#### b) Verificar Frontend (Lee XML Directamente)

1. Accede a: `https://antheacapital.com/propiedades`
   - Debe mostrar las propiedades del XML de Inmovilla
   - Debe mostrar al menos 2 propiedades (395378 y 27684802 del XML de prueba)

2. Haz clic en una propiedad
   - Debe mostrar los detalles correctos (precio, ubicación, características, imágenes)

### 4.3. Probar Redirección Completa

1. Accede directamente a: `https://antheacapital.com/ficha/index.php?codigo=2_395378`
2. Debe redirigir automáticamente a la página de la propiedad
3. La propiedad debe cargarse correctamente con todos sus datos

---

## 🔧 Solución de Problemas

### El frontend no carga propiedades desde el XML

1. **Verifica que el XML sea accesible desde el navegador:**
   - Abre directamente: `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
   - Debe mostrar el XML sin errores

2. **Verifica CORS:**
   - Abre la consola del navegador (F12)
   - Busca errores de CORS al cargar el XML
   - Si hay errores de CORS, contacta a Inmovilla para que habiliten CORS en su servidor

3. **Revisa los logs en la consola del navegador:**
   - Abre `https://antheacapital.com/propiedades`
   - Abre la consola (F12 → Console)
   - Busca mensajes que empiecen con `[XMLPropertiesService]`
   - Debe mostrar: "Cargando XML desde...", "XML cargado...", "Encontradas X propiedades..."

### Los archivos PHP no funcionan

1. **Verifica que PHP esté habilitado en Hostinger:**
   - Debe estar habilitado por defecto

2. **Verifica permisos de archivos:**
   - Los archivos PHP deben tener permisos 644
   - Las carpetas deben tener permisos 755

3. **Verifica la ruta:**
   - Los archivos deben estar en `public_html/ficha/` y `public_html/cliente/`
   - NO en subcarpetas

### El frontend no muestra propiedades

1. **Abre la consola del navegador (F12):**
   - Ve a la pestaña "Console"
   - Busca errores de JavaScript o CORS
   - Verifica los mensajes de `[XMLPropertiesService]` y `[Properties]`

2. **Verifica la pestaña "Network":**
   - Busca la petición al XML: `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
   - Debe tener status 200 (éxito)
   - Si hay error 404 o CORS, el XML no se está cargando

3. **Verifica que el XML tenga propiedades:**
   - Abre directamente: `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
   - Debe tener al menos un nodo `<propiedad>`

---

## 📝 Resumen de lo que Ya Está Listo

✅ **Código implementado:**
- Frontend lee XML de Inmovilla directamente desde el navegador (sin backend necesario)
- Transforma propiedades al formato interno usando `DOMParser`
- Maneja estructura `<datos>` y `<fotos>` del XML
- Frontend detecta `post_id` y redirige correctamente
- Archivos PHP creados y listos (`ficha/index.php`, `cliente/index.php`)
- `.htaccess` configurado para PHP
- Workflow de deploy actualizado

✅ **SPF configurado:**
- Ya configuraste el SPF en Hostinger

⏳ **Lo que falta hacer:**
1. Verificar que el deploy se haya completado correctamente
2. Probar que las propiedades se muestren en `/propiedades`
3. Probar la redirección desde `/ficha/index.php?codigo=2_395378`

---

## 🎯 Siguiente Paso Inmediato

**El código ya está subido y el deploy debería estar ejecutándose automáticamente.**

1. **Espera a que termine el deploy** (5-10 minutos)
   - Ve a: https://github.com/Kazragore34/antheacapital/actions
   - Verifica que el último workflow haya terminado con éxito (✓)

2. **Verifica que las propiedades se muestren:**
   - Abre: `https://antheacapital.com/propiedades`
   - Abre la consola del navegador (F12 → Console)
   - Debe mostrar mensajes como:
     - `[XMLPropertiesService] Cargando XML desde: ...`
     - `[XMLPropertiesService] XML cargado (...)`
     - `[XMLPropertiesService] Encontradas X propiedades en XML`
     - `[Properties] ✅ Setting X properties`

3. **Si no se muestran propiedades:**
   - Comparte los mensajes de la consola del navegador
   - Verifica si hay errores de CORS en la pestaña "Network"
