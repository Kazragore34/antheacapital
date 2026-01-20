# Solución para Error 401 - Token No Válido

## 🔴 Error Actual

```
HTTP Error 401: {"error":401,"mensaje":"El token no es válido","codigo":401001}
```

## ✅ Cambios Realizados

He cambiado el formato de autenticación para enviar el token como **parámetro en la URL** en lugar de como header Bearer:

```php
// ANTES (no funcionaba):
'Authorization: Bearer ' . INMOVILLA_API_TOKEN

// AHORA (probando):
$params['token'] = INMOVILLA_API_TOKEN;
$params['numagencia'] = INMOVILLA_NUMAGENCIA;
```

## 🔍 Próximos Pasos si Sigue Fallando

Si el error 401 persiste después del deploy, necesitamos probar otros formatos:

### Opción 1: Token como header personalizado
```php
'X-Token: ' . INMOVILLA_API_TOKEN
'X-Agencia: ' . INMOVILLA_NUMAGENCIA
```

### Opción 2: Token en el body (POST)
```php
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'token' => INMOVILLA_API_TOKEN,
    'numagencia' => INMOVILLA_NUMAGENCIA
]));
```

### Opción 3: Verificar URL base
La URL actual es: `https://procesos.apinmo.com/api/v1`

¿Es correcta esta URL según la documentación de Inmovilla?

### Opción 4: Verificar formato del token
El token actual es: `F614ADA147C30D2D08FF53714B8CC23F`

¿Este es el formato correcto? ¿Necesita algún prefijo o sufijo?

## 📋 Información Necesaria

Para solucionar el problema definitivamente, necesitamos:

1. **Documentación específica de la API REST** (no la API antigua)
   - URL base exacta
   - Formato de autenticación exacto
   - Endpoints disponibles

2. **Verificar en tu panel de Inmovilla:**
   - ¿El token está activo?
   - ¿Hay alguna restricción de IP o dominio?
   - ¿Hay algún ejemplo de uso del token en la documentación?

3. **Probar el endpoint directamente:**
   - ¿Puedes probar el token directamente desde Postman o curl?
   - ¿Qué formato funciona?

## 🚀 Después del Deploy

1. Probar: `https://antheacapital.com/api-inmovilla-rest-proxy.php?action=propiedades&limit=10`
2. Si sigue dando 401, revisar los logs del servidor para ver qué está enviando
3. Probar los otros formatos mencionados arriba

---

**Nota:** El frontend está configurado correctamente para usar el servicio REST. Una vez que el proxy funcione, el frontend mostrará las propiedades automáticamente.
