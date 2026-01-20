# Diagnóstico de Carga de XML de Inmovilla

## Problema Actual
Las propiedades del XML de Inmovilla no se están mostrando en la página.

## Pasos para Diagnosticar

### 1. Verificar que el Backend esté Ejecutándose

En Hostinger, verifica que el backend Node.js esté activo y funcionando.

### 2. Probar el Endpoint de Debug

Después del deploy, accede a:
```
https://antheacapital.com/api/properties/debug
```

Este endpoint te mostrará:
- La URL del XML que está intentando cargar
- Cuántas propiedades encontró
- Información de la primera propiedad
- Cualquier error que haya ocurrido

### 3. Verificar los Logs del Backend

En Hostinger, revisa los logs del backend. Deberías ver mensajes como:
- `[PropertiesService] Loading properties from XML: ...`
- `[PropertiesService] Found X propiedades in XML`
- `[PropertiesService] Successfully transformed X properties`

### 4. Probar la API Directamente

Accede a:
```
https://antheacapital.com/api/properties
```

Deberías recibir un array JSON con las propiedades.

### 5. Verificar la Consola del Navegador

En la página de propiedades (`https://antheacapital.com/propiedades`), abre la consola (F12) y revisa:
- Si hay errores de red
- Los logs que empiezan con `[Properties]`
- Si la API está respondiendo

## Posibles Causas

### 1. Backend no Ejecutándose
**Solución:** Inicia/reinicia el backend en Hostinger

### 2. xml2js no Instalado
**Solución:** Ejecuta en Hostinger:
```bash
cd backend
npm install
```

### 3. XML no Accesible
**Solución:** Verifica que el backend pueda acceder a:
```
https://procesos.inmovilla.com/xml/xml2demo/2-web.xml
```

### 4. Estructura XML Diferente
**Solución:** El XML de prueba puede tener una estructura diferente. Revisa los logs del endpoint `/api/properties/debug`

### 5. Todas las Propiedades Filtradas
**Solución:** Las propiedades pueden tener precio 0 o faltar campos requeridos. Revisa los logs para ver cuántas se transformaron vs cuántas se encontraron.

## Comandos Útiles

### En Hostinger (SSH o Terminal):
```bash
# Ir al directorio del backend
cd backend

# Instalar dependencias
npm install

# Verificar que xml2js esté instalado
npm list xml2js

# Reiniciar el backend (depende de cómo lo tengas configurado)
# Puede ser: pm2 restart, systemctl restart, o simplemente reiniciar desde el panel
```

## Próximos Pasos

1. **Accede a `/api/properties/debug`** y comparte el resultado
2. **Revisa los logs del backend** y comparte cualquier error
3. **Verifica la consola del navegador** en `/propiedades` y comparte los logs

Con esta información podremos identificar exactamente qué está fallando.
