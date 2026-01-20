# Solución: Error "IP NO VALIDADA" en API de Inmovilla

## 🔴 Problema

El error que estás viendo:
```
"xIP NO VALIDADA - IP_RECIVED: 62.72.37.134"
```

Significa que **Inmovilla está rechazando las peticiones porque la IP de tu servidor no está autorizada**.

## ✅ Solución

### Paso 1: Autorizar la IP en tu Panel de Inmovilla

1. **Inicia sesión en tu panel de Inmovilla**
2. **Ve a Configuración → API o Integraciones → API**
3. **Busca la sección "IPs Autorizadas" o "IPs Permitidas"**
4. **Agrega la IP de tu servidor:** `62.72.37.134`
   - Esta es la IP que aparece en el error
   - Puede que necesites agregar también otras IPs si tu servidor usa múltiples IPs

### Paso 2: Verificar la IP de tu Servidor

Si no estás seguro de cuál es la IP de tu servidor, puedes:

1. **Desde el panel de Hostinger:**
   - Ve a "Información del Servidor" o "Detalles del Hosting"
   - Busca la IP del servidor

2. **O contacta con Hostinger:**
   - Pregunta cuál es la IP pública de tu servidor
   - Puede que necesites autorizar un rango de IPs

### Paso 3: Contactar con Inmovilla (Si es Necesario)

Si no encuentras la opción para autorizar IPs en tu panel:

1. **Contacta con el soporte de Inmovilla**
2. **Diles que necesitas autorizar la IP de tu servidor para usar la API**
3. **Proporciónales:**
   - Tu número de agencia: `13740`
   - La IP del servidor: `62.72.37.134` (o la que te indique Hostinger)
   - El propósito: Integrar la API en tu sitio web

## 📋 Verificación

Después de autorizar la IP:

1. **Espera unos minutos** (puede tardar en propagarse)
2. **Prueba el proxy PHP:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=10
   ```
3. **Deberías ver un JSON con tus propiedades** en lugar del error

## 🔍 Nota sobre las 1667 Propiedades

Si ves 1667 propiedades, es porque el frontend está usando el **XML de prueba** como fallback cuando la API falla.

**Una vez que autorices la IP y la API funcione**, el frontend usará automáticamente la API y mostrará solo tus propiedades reales.

---

**Última actualización:** 20/01/2026
