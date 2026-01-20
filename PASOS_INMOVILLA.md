# Pasos para Completar la Integración con Inmovilla

## ✅ Paso 1: Configuración SPF (YA COMPLETADO)

Ya configuraste el SPF en Hostinger con `include:externo.inmovilla.com`. ¡Perfecto!

---

## 📋 Paso 2: Configurar el Backend

### 2.1. Instalar Dependencias del Backend

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd backend
npm install
```

Esto instalará la nueva dependencia `xml2js` que agregamos para leer el XML.

### 2.2. Configurar Variables de Entorno (Opcional)

El backend ya está configurado para usar la URL de prueba por defecto:
- **URL XML:** `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
- **Número de Agencia:** `2`
- **Password:** `82ku9xz2aw3`

Si quieres cambiar estos valores en el futuro, crea o edita el archivo `backend/.env`:

```env
# URL del XML de Inmovilla
INMOVILLA_XML_URL=https://procesos.inmovilla.com/xml/xml2demo/2-web.xml

# Credenciales de Inmovilla (para futuras integraciones con API)
INMOVILLA_NUMAGENCIA=2
INMOVILLA_PASSWORD=82ku9xz2aw3

# Ruta local alternativa (si prefieres usar archivo local)
# INMOVILLA_XML_PATH=./archivos en bruto/listado.xml
```

**Nota:** Por ahora, el backend leerá directamente del XML. Las credenciales están guardadas por si en el futuro quieres usar la API de Inmovilla.

### 2.3. Probar el Backend Localmente (Opcional)

Si quieres probar que el backend lee correctamente el XML antes de desplegar:

```bash
cd backend
npm run start:dev
```

Luego prueba en tu navegador o con curl:
```bash
curl http://localhost:3001/api/properties
```

Deberías ver las propiedades del XML de prueba.

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

#### b) Verificar Backend

1. Accede a: `https://antheacapital.com/api/properties`
   - Debe devolver un JSON con las propiedades del XML de prueba

2. Accede a: `https://antheacapital.com/api/properties/by-cod/395378`
   - Debe devolver los detalles de la propiedad con codOfer 395378

#### c) Verificar Frontend

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

### El backend no carga propiedades

1. **Verifica que el XML sea accesible:**
   ```bash
   curl https://procesos.inmovilla.com/xml/xml2demo/2-web.xml
   ```

2. **Revisa los logs del backend en Hostinger:**
   - Ve al panel de Hostinger
   - Node.js > Ver logs
   - Busca errores relacionados con XML

3. **Verifica variables de entorno:**
   - Asegúrate de que el backend tenga acceso a internet para descargar el XML

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
   - Busca errores de JavaScript
   - Verifica que las llamadas a la API funcionen

2. **Verifica que el backend esté funcionando:**
   - Prueba `https://antheacapital.com/api/properties` directamente

3. **Verifica CORS:**
   - El backend debe permitir peticiones desde el frontend

---

## 📝 Resumen de lo que Ya Está Listo

✅ **Código implementado:**
- Backend lee XML de Inmovilla automáticamente
- Transforma propiedades al formato interno
- Endpoint para buscar por codOfer
- Frontend detecta `post_id` y redirige
- Archivos PHP creados y listos
- `.htaccess` configurado para PHP
- Workflow de deploy actualizado

✅ **SPF configurado:**
- Ya configuraste el SPF en Hostinger

⏳ **Lo que falta hacer:**
1. Instalar dependencias del backend (`npm install` en `backend/`)
2. Hacer commit y push (o subir archivos PHP manualmente)
3. Verificar que todo funcione

---

## 🎯 Siguiente Paso Inmediato

**Ejecuta estos comandos:**

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Volver a la raíz y hacer commit
cd ..
git add .
git commit -m "feat: Integración completa con Inmovilla CRM"
git push origin main
```

Luego espera a que termine el deploy y verifica que todo funcione según el Paso 4.2.
