# Verificación de API REST de Inmovilla

## ✅ Lo que tenemos configurado

1. **Token REST:** `F614ADA147C30D2D08FF53714B8CC23F`
2. **Número de Agencia:** `13740`
3. **Proxy REST creado:** `api-inmovilla-rest-proxy.php`
4. **Frontend configurado:** Usa el proxy REST

## ⚠️ Lo que necesitamos verificar

La documentación en `http://procesos.inmovilla.com/apiweb/doc/index.php` es sobre la **API antigua** que usa:
- `apiinmovilla.php`
- `numagencia` y `password`
- Endpoint: `https://apiweb.inmovilla.com/apiweb/apiweb.php`

Para la **API REST con token**, necesitamos verificar:

### 1. URL Base de la API REST

Actualmente configurado como: `https://procesos.apinmo.com/api/v1`

**¿Es correcta esta URL?** 

### 2. Endpoints de la API REST

Actualmente configurados:
- `/propiedades` - Para obtener todas las propiedades
- `/propiedades/{codOfer}` - Para obtener una propiedad específica

**¿Son correctos estos endpoints?**

### 3. Formato de Autenticación

Actualmente usando:
```
Authorization: Bearer F614ADA147C30D2D08FF53714B8CC23F
X-Agencia: 13740
```

**¿Es correcto este formato?**

### 4. Parámetros de la API REST

Actualmente enviando:
- `agencia`: Número de agencia
- `limit`: Límite de resultados
- `offset`: Desplazamiento
- `where`: Condiciones WHERE (opcional)
- `order`: Ordenamiento (opcional)

**¿Son correctos estos parámetros?**

## 🔍 Cómo verificar

1. **Probar el proxy REST directamente:**
   ```
   https://antheacapital.com/api-inmovilla-rest-proxy.php?action=propiedades&limit=10
   ```

2. **Revisar los logs del servidor** para ver qué respuesta devuelve la API REST

3. **Verificar en la documentación de Inmovilla** si hay una sección específica sobre la API REST (no la API antigua)

## 📋 Próximos pasos

1. Probar el endpoint después del deploy
2. Si hay errores, revisar los logs para ver qué devuelve la API REST
3. Ajustar el código según la respuesta real de la API REST

---

**Nota:** La documentación en `procesos.inmovilla.com/apiweb/doc/index.php` es sobre la API antigua. Si existe documentación específica para la API REST con token, necesitaríamos acceder a ella para verificar los endpoints exactos.
