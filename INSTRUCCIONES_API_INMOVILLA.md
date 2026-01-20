# Instrucciones para Usar la API de Inmovilla

## 📋 Configuración Inicial

### 1. Obtener Credenciales de Producción

Desde tu panel de Inmovilla, necesitas obtener:
- **Número de Agencia** (numagencia): Tu número de agencia en Inmovilla
- **Password**: Tu contraseña de acceso a la API

**Nota:** Las credenciales de prueba son:
- `numagencia: 2`
- `password: 82ku9xz2aw3`

### 2. Configurar el Proxy PHP

Edita el archivo `api-inmovilla-proxy.php` y cambia estas líneas (líneas 18-20):

```php
// Cambiar estos valores por los de producción:
define('INMOVILLA_NUMAGENCIA', 'TU_NUMERO_AGENCIA');
define('INMOVILLA_PASSWORD', 'TU_PASSWORD');
define('INMOVILLA_IDIOMA', '1'); // 1 = Español, 2 = Inglés, etc.
```

### 3. Subir Archivos Necesarios

Asegúrate de que estos archivos estén en el servidor:
- `api-inmovilla-proxy.php` → `public_html/api-inmovilla-proxy.php`
- `archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php` → Debe estar accesible desde el proxy

---

## 🚀 Cómo Funciona

### Arquitectura

```
Frontend (React) 
    ↓ fetch
api-inmovilla-proxy.php (PHP)
    ↓ cURL
API de Inmovilla (https://apiweb.inmovilla.com/apiweb/apiweb.php)
    ↓ JSON
Frontend recibe datos
```

### Ventajas sobre XML

1. **Datos en tiempo real** - No hay que esperar actualización diaria
2. **Filtros avanzados** - Puedes filtrar por cualquier campo
3. **Paginación** - Control total sobre cuántas propiedades mostrar
4. **Búsqueda específica** - Puedes buscar una propiedad por `codOfer`

---

## 📡 Endpoints Disponibles

### 1. Obtener Todas las Propiedades

```
GET /api-inmovilla-proxy.php?action=propiedades&limit=100&offset=1
```

**Parámetros:**
- `action`: `propiedades` (obligatorio)
- `limit`: Número de propiedades a obtener (default: 100)
- `offset`: Desde qué posición empezar (default: 1)
- `where`: Condiciones WHERE (opcional, ej: `ascensor=1`)
- `order`: Ordenamiento (opcional, ej: `precioinmo, precioalq`)

**Ejemplo:**
```
https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=50&where=ofertas_tipo_inmo=Vender&order=precioinmo
```

### 2. Obtener una Propiedad Específica

```
GET /api-inmovilla-proxy.php?action=ficha&codOfer=395378
```

**Parámetros:**
- `action`: `ficha` (obligatorio)
- `codOfer`: Código de la propiedad en Inmovilla (obligatorio)

**Ejemplo:**
```
https://antheacapital.com/api-inmovilla-proxy.php?action=ficha&codOfer=395378
```

### 3. Obtener Propiedades Destacadas

```
GET /api-inmovilla-proxy.php?action=destacados&limit=20
```

**Parámetros:**
- `action`: `destacados` (obligatorio)
- `limit`: Número de propiedades destacadas (default: 100)
- `order`: Ordenamiento (opcional)

### 4. Obtener Tipos de Propiedades

```
GET /api-inmovilla-proxy.php?action=tipos
```

Devuelve los tipos de propiedades disponibles (Piso, Casa, Local, etc.)

### 5. Obtener Ciudades Disponibles

```
GET /api-inmovilla-proxy.php?action=ciudades
```

Devuelve las ciudades disponibles en las propiedades

---

## 🔧 Integración con el Frontend

### Opción 1: Modificar el Servicio Actual para Usar la API

Edita `frontend/src/services/xml-properties.service.ts`:

```typescript
// Cambiar de XML a API
const API_URL = '/api-inmovilla-proxy.php'

async getAll(filters?: {...}): Promise<Property[]> {
  const params = new URLSearchParams({
    action: 'propiedades',
    limit: '1000',
  })
  
  if (filters?.type) {
    params.append('where', `ofertas_tipo_inmo=${filters.type === 'venta' ? 'Vender' : 'Alquilar'}`)
  }
  
  const response = await fetch(`${API_URL}?${params}`)
  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  // Transformar datos de la API al formato Property
  return result.data.paginacion?.map(transformInmovillaAPIProperty) || []
}
```

### Opción 2: Crear un Nuevo Servicio para la API

Crea `frontend/src/services/inmovilla-api.service.ts`:

```typescript
import { Property } from '../types'

class InmovillaAPIService {
  private readonly API_URL = '/api-inmovilla-proxy.php'
  
  async getProperties(filters?: {
    limit?: number
    offset?: number
    where?: string
    order?: string
  }): Promise<Property[]> {
    const params = new URLSearchParams({
      action: 'propiedades',
      limit: String(filters?.limit || 100),
      offset: String(filters?.offset || 1),
    })
    
    if (filters?.where) {
      params.append('where', filters.where)
    }
    
    if (filters?.order) {
      params.append('order', filters.order)
    }
    
    const response = await fetch(`${this.API_URL}?${params}`)
    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error)
    }
    
    return this.transformProperties(result.data.paginacion || [])
  }
  
  async getPropertyByCodOfer(codOfer: string): Promise<Property | null> {
    const params = new URLSearchParams({
      action: 'ficha',
      codOfer: codOfer,
    })
    
    const response = await fetch(`${this.API_URL}?${params}`)
    const result = await response.json()
    
    if (!result.success || !result.data.ficha || result.data.ficha.length === 0) {
      return null
    }
    
    return this.transformProperty(result.data.ficha[0])
  }
  
  private transformProperties(apiProperties: any[]): Property[] {
    return apiProperties.map(prop => this.transformProperty(prop))
  }
  
  private transformProperty(apiProp: any): Property {
    // Transformar datos de la API al formato Property
    // Similar a transformInmovillaProperty pero adaptado a la estructura de la API
    return {
      _id: apiProp.ofertas_cod_ofer || apiProp.id || '',
      codOfer: apiProp.ofertas_cod_ofer || apiProp.id || '',
      title: apiProp.ofertas_titulo1 || apiProp.titulo1 || '',
      description: apiProp.ofertas_descrip1 || apiProp.descrip1 || '',
      type: this.getType(apiProp),
      price: this.getPrice(apiProp),
      location: {
        address: apiProp.ofertas_calle || '',
        city: apiProp.ciudad_ciudad || apiProp.ciudad || '',
        province: apiProp.provincias_provincia || apiProp.provincia || '',
      },
      features: {
        bedrooms: parseInt(apiProp.ofertas_habdobles || apiProp.habdobles || '0'),
        bathrooms: parseInt(apiProp.ofertas_banyos || apiProp.banyos || '0'),
        area: parseFloat(apiProp.ofertas_m_cons || apiProp.m_cons || '0'),
        // ... más características
      },
      images: this.getImages(apiProp),
      status: 'published',
    }
  }
  
  private getType(apiProp: any): 'venta' | 'alquiler' {
    const tipo = (apiProp.ofertas_tipo_inmo || apiProp.tipo_inmo || '').toLowerCase()
    if (tipo.includes('venta') || tipo.includes('vender')) {
      return 'venta'
    }
    return 'alquiler'
  }
  
  private getPrice(apiProp: any): number {
    const precioVenta = parseFloat(apiProp.ofertas_precioinmo || apiProp.precioinmo || '0')
    const precioAlq = parseFloat(apiProp.ofertas_precioalq || apiProp.precioalq || '0')
    return precioVenta > 0 ? precioVenta : precioAlq
  }
  
  private getImages(apiProp: any): string[] {
    const images: string[] = []
    for ($i = 1; $i <= 20; $i++) {
      const foto = apiProp[`ofertas_foto${i}`] || apiProp[`foto${i}`]
      if (foto && foto.startsWith('http')) {
        images.push(foto)
      }
    }
    return images
  }
}

export const inmovillaAPIService = new InmovillaAPIService()
```

---

## 🔄 Migración desde XML a API

### Paso 1: Configurar Credenciales

1. Edita `api-inmovilla-proxy.php`
2. Cambia `INMOVILLA_NUMAGENCIA` y `INMOVILLA_PASSWORD` por tus credenciales reales

### Paso 2: Probar el Proxy

Prueba estos endpoints en tu navegador:

1. **Obtener propiedades:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=10
   ```

2. **Obtener una propiedad:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=ficha&codOfer=395378
   ```

3. **Obtener destacados:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=destacados&limit=5
   ```

### Paso 3: Modificar el Frontend

1. Opción A: Modificar `xml-properties.service.ts` para usar la API
2. Opción B: Crear `inmovilla-api.service.ts` y cambiar las referencias

### Paso 4: Actualizar Componentes

Cambia las referencias de `xmlPropertiesService` a `inmovillaAPIService` en:
- `frontend/src/pages/Properties.tsx`
- `frontend/src/pages/PropertyDetail.tsx`
- `frontend/src/pages/Home.tsx`

---

## 📝 Ejemplos de Uso

### Filtrar por Tipo

```
GET /api-inmovilla-proxy.php?action=propiedades&where=ofertas_tipo_inmo=Vender&limit=50
```

### Filtrar por Ciudad

```
GET /api-inmovilla-proxy.php?action=propiedades&where=ciudad_ciudad=Madrid&limit=100
```

### Filtrar por Precio

```
GET /api-inmovilla-proxy.php?action=propiedades&where=ofertas_precioinmo>100000&order=precioinmo
```

### Combinar Filtros

```
GET /api-inmovilla-proxy.php?action=propiedades&where=ofertas_tipo_inmo=Vender&ciudad_ciudad=Madrid&ofertas_precioinmo<300000&limit=20
```

---

## ⚠️ Consideraciones Importantes

1. **Seguridad:** El proxy PHP debe estar protegido. Considera agregar autenticación si es necesario.

2. **Rate Limiting:** La API de Inmovilla puede tener límites de peticiones. Implementa caché si es necesario.

3. **Estructura de Datos:** La estructura de la respuesta de la API puede diferir del XML. Ajusta la función `transformProperty` según sea necesario.

4. **Manejo de Errores:** Siempre verifica `result.success` antes de usar los datos.

---

## 🆘 Solución de Problemas

### Error: "Acción no válida"
- Verifica que el parámetro `action` sea uno de los valores permitidos

### Error: "codOfer es requerido"
- Asegúrate de pasar el parámetro `codOfer` cuando uses `action=ficha`

### Error: "Error decodificando JSON"
- La API puede estar devolviendo datos en formato diferente
- Revisa la respuesta directamente en el navegador

### No se muestran propiedades
- Verifica que las credenciales sean correctas
- Revisa los logs del servidor PHP
- Prueba el endpoint directamente en el navegador

---

## 📞 Documentación Adicional

- **Documentación de Inmovilla:** http://procesos.inmovilla.com/apiweb/doc/index.php
- **API REST:** https://procesos.apinmo.com/api/v1/doc/

---

**Última actualización:** 20/01/2026
