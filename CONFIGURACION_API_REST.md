# Configuración de API REST de Inmovilla con Token

## ✅ Token Configurado

Tu token de API REST está configurado:
- **Token:** `F614ADA147C30D2D08FF53714B8CC23F`
- **Número de Agencia:** `13740`

## 🚀 Cómo Funciona

### Arquitectura Nueva (API REST)

```
Frontend (React) 
    ↓ fetch
api-inmovilla-rest-proxy.php (PHP)
    ↓ cURL con Token Bearer
API REST de Inmovilla (https://procesos.apinmo.com/api/v1)
    ↓ JSON
Frontend recibe datos
```

### Ventajas de la API REST

1. **Autenticación por Token** - Más seguro que usuario/contraseña
2. **No requiere IP autorizada** - El token es suficiente
3. **API moderna** - Endpoints REST estándar
4. **Mejor rendimiento** - Diseñada para aplicaciones web

## 📡 Endpoints Disponibles

### 1. Obtener Todas las Propiedades

```
GET /api-inmovilla-rest-proxy.php?action=propiedades&limit=100&offset=0
```

### 2. Obtener una Propiedad Específica

```
GET /api-inmovilla-rest-proxy.php?action=ficha&codOfer=395378
```

### 3. Obtener Propiedades Destacadas

```
GET /api-inmovilla-rest-proxy.php?action=destacados&limit=10
```

## 🔧 Cambios Realizados

1. ✅ Creado `api-inmovilla-rest-proxy.php` - Nuevo proxy para API REST
2. ✅ Actualizado `inmovilla-api.service.ts` - Usa el nuevo proxy REST
3. ✅ Configurado token en el proxy PHP
4. ✅ Actualizado workflow de deploy para incluir el nuevo proxy

## 📋 Próximos Pasos

1. **Esperar el deploy** (5-10 minutos)
2. **Probar el nuevo proxy:**
   ```
   https://antheacapital.com/api-inmovilla-rest-proxy.php?action=propiedades&limit=10
   ```
3. **Si funciona**, el frontend usará automáticamente la API REST

## ⚠️ Nota sobre la API Antigua

La API antigua (`api-inmovilla-proxy.php`) sigue disponible por si acaso, pero ahora usamos la API REST que es más moderna y no requiere autorización de IP.

---

**Última actualización:** 20/01/2026
