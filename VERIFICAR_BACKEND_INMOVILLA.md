# 🔍 Verificar y Completar Integración con Inmovilla

## ✅ Lo que Ya Está Hecho

1. ✅ Archivos PHP (`ficha/` y `cliente/`) subidos
2. ✅ Backend compilado y subido (`dist/` y `node_modules/`)
3. ✅ Código configurado para leer XML de Inmovilla
4. ✅ SPF configurado (según mencionaste)

## ❌ Lo que Falta

### Paso 1: Verificar que el Backend Esté Ejecutándose

El backend necesita estar **ejecutándose** en el servidor para que la API funcione.

**Desde WinSCP Terminal:**

```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Verificar que las carpetas existen
ls -la dist/
ls -la node_modules/xml2js/

# Si NO existen, crearlas:
npm install
npm run build

# Iniciar el backend
node dist/main.js
```

**O ejecutar en segundo plano:**

```bash
nohup node dist/main.js > backend.log 2>&1 &
```

### Paso 2: Configurar Node.js en Hostinger (Si Está Disponible)

Si Hostinger tiene panel de Node.js:

1. Ve al panel de Hostinger
2. Busca "Node.js" o "Aplicaciones"
3. Crea una aplicación:
   - **Directorio:** `/home/u571508109/domains/antheacapital.com/public_html/backend`
   - **Comando:** `node dist/main.js`
   - **Puerto:** `3001` (o el que Hostinger asigne)
   - **Variables de entorno (opcional):**
     - `INMOVILLA_XML_URL=https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
     - `PORT=3001`

### Paso 3: Verificar que el Backend Funciona

**Prueba estos endpoints:**

1. **Debug endpoint:**
   ```
   https://antheacapital.com/api/properties/debug
   ```
   Debería mostrar información sobre las propiedades cargadas del XML.

2. **API de propiedades:**
   ```
   https://antheacapital.com/api/properties
   ```
   Debería devolver un array JSON con las propiedades.

### Paso 4: Verificar Logs del Backend

Si el backend está ejecutándose, revisa los logs:

```bash
# Si usaste nohup:
tail -f /home/u571508109/domains/antheacapital.com/public_html/backend/backend.log

# O verifica los logs de Hostinger en el panel
```

Busca mensajes como:
- `[PropertiesService] Loading fresh XML data`
- `[PropertiesService] Found X propiedades in XML`
- `🚀 Backend running on http://0.0.0.0:3001`

### Paso 5: Verificar Acceso al XML de Inmovilla

El backend intenta cargar el XML desde:
- **URL:** `https://procesos.inmovilla.com/xml/xml2demo/2-web.xml`
- **Fallback:** Archivo local `archivos en bruto/listado.xml`

Verifica que el servidor pueda acceder a la URL:

```bash
curl https://procesos.inmovilla.com/xml/xml2demo/2-web.xml | head -20
```

## 🔧 Solución Rápida: Ejecutar Backend Manualmente

Si no puedes configurar Node.js en Hostinger, ejecuta manualmente:

```bash
cd /home/u571508109/domains/antheacapital.com/public_html/backend

# Instalar dependencias (si falta)
npm install

# Compilar (si falta)
npm run build

# Iniciar backend
nohup node dist/main.js > backend.log 2>&1 &

# Verificar que está ejecutándose
ps aux | grep node

# Ver logs
tail -f backend.log
```

## 📋 Checklist de Verificación

- [ ] Carpetas `dist/` y `node_modules/` existen en el servidor
- [ ] Backend está ejecutándose (proceso Node.js activo)
- [ ] Endpoint `/api/properties/debug` responde con datos
- [ ] Endpoint `/api/properties` devuelve array de propiedades
- [ ] El servidor puede acceder a la URL del XML de Inmovilla
- [ ] Las propiedades se muestran en `https://antheacapital.com/propiedades`

## 🚨 Problemas Comunes

### "No se encontraron propiedades"
- **Causa:** Backend no está ejecutándose
- **Solución:** Iniciar el backend (ver Paso 1)

### "Cannot GET /api/properties"
- **Causa:** Backend no está ejecutándose o puerto incorrecto
- **Solución:** Verificar que el backend esté corriendo y en qué puerto

### "Error loading properties"
- **Causa:** No puede acceder al XML o error de parsing
- **Solución:** Revisar logs del backend para ver el error específico

### Backend se detiene después de cerrar terminal
- **Causa:** Proceso no está en segundo plano
- **Solución:** Usar `nohup` o configurar Node.js en Hostinger

## 📞 Próximos Pasos

1. **Ejecuta el backend** desde WinSCP (Paso 1)
2. **Verifica los endpoints** (Paso 3)
3. **Revisa los logs** si hay errores (Paso 4)
4. **Comparte los resultados** para diagnosticar cualquier problema
