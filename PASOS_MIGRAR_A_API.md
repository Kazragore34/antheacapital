# Pasos para Migrar de XML a API de Inmovilla

## ✅ Lo que Ya Está Listo

1. ✅ `api-inmovilla-proxy.php` creado y listo
2. ✅ `inmovilla-api.service.ts` creado (servicio del frontend)
3. ✅ Workflow de deploy actualizado para incluir el proxy PHP
4. ✅ Archivos de `archivos en bruto/api_cliente/` se copian automáticamente

---

## 📋 Lo que DEBES HACER TÚ

### Paso 1: Obtener Tus Credenciales de Producción

Desde tu panel de Inmovilla, necesitas:
- **Número de Agencia** (numagencia)
- **Password** de acceso a la API

**Nota:** Si aún no tienes las credenciales de producción, puedes usar las de prueba temporalmente:
- `numagencia: 2`
- `password: 82ku9xz2aw3`

### Paso 2: Configurar las Credenciales en el Proxy PHP

Edita el archivo `api-inmovilla-proxy.php` y cambia estas líneas (18-20):

```php
// Cambiar estos valores por los de producción:
define('INMOVILLA_NUMAGENCIA', 'TU_NUMERO_AGENCIA');  // ← Cambiar aquí
define('INMOVILLA_PASSWORD', 'TU_PASSWORD');          // ← Cambiar aquí
define('INMOVILLA_IDIOMA', '1'); // 1 = Español
```

### Paso 3: Hacer Commit y Push

```bash
git add api-inmovilla-proxy.php
git commit -m "feat: Configurar credenciales de API de Inmovilla"
git push origin main
```

Esto desplegará automáticamente el proxy PHP al servidor.

### Paso 4: Probar el Proxy PHP

Espera 5-10 minutos a que termine el deploy y luego prueba estos endpoints en tu navegador:

1. **Obtener propiedades:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=10
   ```
   Debe devolver un JSON con propiedades.

2. **Obtener una propiedad específica:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=ficha&codOfer=395378
   ```
   Debe devolver un JSON con los datos de esa propiedad.

3. **Obtener destacados:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=destacados&limit=5
   ```

**Si ves errores:**
- Verifica que las credenciales sean correctas
- Revisa la consola del navegador para ver el error exacto
- Verifica que el archivo `apiinmovilla.php` esté en `archivos en bruto/api_cliente/api_cliente/cliente/`

### Paso 5: Activar la API en el Frontend

Una vez que el proxy PHP funcione correctamente, yo modificaré el frontend para usar la API en lugar del XML. Esto incluirá:

1. Cambiar `Properties.tsx` para usar `inmovillaAPIService` en lugar de `xmlPropertiesService`
2. Cambiar `PropertyDetail.tsx` para usar la API
3. Cambiar `Home.tsx` para usar la API para propiedades destacadas

**Nota:** Esto lo haré yo después de que confirmes que el proxy PHP funciona.

---

## 🔄 Comparación: XML vs API

### XML (Actual)
- ❌ Se actualiza una vez al día (puede tardar hasta 24 horas)
- ❌ No hay filtros avanzados
- ✅ Funciona sin credenciales
- ✅ Más simple de implementar

### API (Nuevo)
- ✅ **Datos en tiempo real** (inmediato)
- ✅ Filtros avanzados (por ciudad, precio, características, etc.)
- ✅ Búsqueda específica por `codOfer`
- ✅ Paginación controlada
- ❌ Requiere credenciales
- ❌ Ligeramente más complejo

---

## ⚠️ Importante

**El proxy PHP necesita acceso al archivo `apiinmovilla.php`**. Este archivo debe estar en:
```
public_html/archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php
```

El workflow de deploy ya copia esta carpeta automáticamente, así que debería estar disponible después del deploy.

---

## 🆘 Solución de Problemas

### Error: "Acción no válida"
- Verifica que el parámetro `action` sea correcto (`propiedades`, `ficha`, `destacados`)

### Error: "Error decodificando JSON"
- La API puede estar devolviendo datos en formato diferente
- Revisa la respuesta directamente en el navegador
- Verifica que las credenciales sean correctas

### No se muestran propiedades
- Verifica que las credenciales sean correctas en `api-inmovilla-proxy.php`
- Prueba el endpoint directamente en el navegador
- Revisa los logs del servidor PHP si es posible

### Error: "Cannot find apiinmovilla.php"
- Verifica que la carpeta `archivos en bruto/api_cliente/` esté en el servidor
- Verifica la ruta en `api-inmovilla-proxy.php` (línea ~30)

---

## 📞 Siguiente Paso

**Después de que pruebes el proxy PHP y confirmes que funciona**, avísame y yo modificaré el frontend para usar la API en lugar del XML. Esto hará que las propiedades se actualicen en tiempo real.

---

**Última actualización:** 20/01/2026
