# Configuración de Integración con Inmovilla CRM

Este documento describe la configuración necesaria para integrar el sitio web de Anthea Capital con Inmovilla CRM.

## Índice

1. [Configuración SPF para Correos](#configuración-spf-para-correos)
2. [Archivos PHP de Redirección](#archivos-php-de-redirección)
3. [Configuración del Backend](#configuración-del-backend)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Verificación](#verificación)

## Configuración SPF para Correos

### ¿Qué es SPF?

SPF (Sender Policy Framework) es un registro DNS que autoriza qué servidores pueden enviar correos en nombre de tu dominio. Es necesario configurarlo para que Inmovilla pueda enviar correos usando tu dirección de correo (`contacto@antheacapital.com`).

### Configuración en MXRoute

1. Accede a tu panel de control de MXRoute
2. Ve a la sección de DNS o Registros DNS
3. Busca el registro TXT de tipo SPF para `antheacapital.com` y `antheacapital.es`
4. Edita el registro SPF y agrega `include:externo.inmovilla.com`

### Ejemplo de Registro SPF Completo

```
v=spf1 mx a:mail.antheacapital.com include:externo.inmovilla.com -all
```

**Explicación:**
- `v=spf1` - Versión del protocolo SPF
- `mx` - Permite los servidores MX del dominio
- `a:mail.antheacapital.com` - Permite el servidor de correo específico
- `include:externo.inmovilla.com` - **Permite a Inmovilla enviar correos en tu nombre**
- `-all` - Rechaza todos los demás servidores

### Verificación

Puedes verificar que el SPF está correctamente configurado usando herramientas online como:
- [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
- [SPF Record Checker](https://www.spf-record.com/)

Ingresa tu dominio (`antheacapital.com`) y verifica que el registro incluya `include:externo.inmovilla.com`.

## Archivos PHP de Redirección

### Carpeta `ficha/`

La carpeta `ficha/` contiene `index.php` que maneja las redirecciones de enlaces de Inmovilla.

**Funcionamiento:**
- Inmovilla envía enlaces con formato: `antheacapital.com/ficha/index.php?codigo=XXXX_YYYYYY`
- Donde `XXXX` es el número de agencia y `YYYYYY` es el código de la propiedad (`cod_ofer`)
- El archivo PHP extrae el `cod_ofer` y redirige a: `antheacapital.com/propiedades?post_id=YYYYYY`

**Ubicación:** Debe estar en la raíz del sitio web (`public_html/ficha/`)

### Carpeta `cliente/`

La carpeta `cliente/` contiene `index.php` que muestra el panel de clientes de Inmovilla mediante un iframe.

**Funcionamiento:**
- Muestra el panel de clientes de Inmovilla embebido en tu sitio web
- Accesible mediante: `antheacapital.com/cliente/index.php?cliente=XXXX`

**Ubicación:** Debe estar en la raíz del sitio web (`public_html/cliente/`)

## Configuración del Backend

### Variables de Entorno

El backend ya está configurado para usar la URL de prueba por defecto. Si quieres cambiar estos valores, agrega las siguientes variables de entorno en el archivo `.env` del backend:

```env
# URL del XML de Inmovilla (ya configurada por defecto con la URL de prueba)
INMOVILLA_XML_URL=https://procesos.inmovilla.com/xml/xml2demo/2-web.xml

# Credenciales de Inmovilla (para futuras integraciones con API)
INMOVILLA_NUMAGENCIA=2
INMOVILLA_PASSWORD=82ku9xz2aw3

# Ruta local del XML (opcional, si prefieres usar archivo local)
INMOVILLA_XML_PATH=./archivos en bruto/listado.xml
```

**Nota:** El backend intentará leer desde la URL primero. Si no está disponible o falla, intentará leer desde el archivo local. **Por defecto ya usa la URL de prueba de Inmovilla.**

### Estructura del XML

El backend espera un XML con la siguiente estructura:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<propiedades>
  <propiedad>
    <id>123456</id>
    <numagencia>2</numagencia>
    <titulo1>Título de la propiedad</titulo1>
    <descrip1>Descripción de la propiedad</descrip1>
    <precioinmo>200000</precioinmo>
    <precioalq>800</precioalq>
    <accion>Vender</accion>
    <ciudad>Madrid</ciudad>
    <zona>Atocha</zona>
    <habdobles>3</habdobles>
    <banyos>2</banyos>
    <m_cons>110.00</m_cons>
    <foto1>https://fotos15.apinmo.com/2/123456/1-1.jpg</foto1>
    <foto2>https://fotos15.apinmo.com/2/123456/1-2.jpg</foto2>
    <!-- ... más campos ... -->
  </propiedad>
</propiedades>
```

### Mapeo de Campos

El backend transforma automáticamente los campos del XML de Inmovilla al formato interno:

| Campo Inmovilla | Campo Interno | Notas |
|----------------|---------------|-------|
| `id` | `codOfer` | Código único de la propiedad |
| `titulo1` / `titulo2` | `title` | Título de la propiedad |
| `descrip1` / `descrip2` / `tinterior` | `description` | Descripción |
| `precioinmo` | `price` (tipo: venta) | Precio de venta |
| `precioalq` | `price` (tipo: alquiler) | Precio de alquiler |
| `accion` | `type` | "Vender" → "venta", "Alquilar" → "alquiler" |
| `ciudad` | `location.city` | Ciudad |
| `zona` | `location.address` | Zona o dirección |
| `habdobles` / `habitaciones` | `features.bedrooms` | Número de habitaciones |
| `banyos` | `features.bathrooms` | Número de baños |
| `m_cons` / `m_uties` | `features.area` | Superficie en m² |
| `numplanta` | `features.floor` | Planta |
| `plaza_gara` / `parking` | `features.parking` | Tiene parking |
| `ascensor` | `features.elevator` | Tiene ascensor |
| `foto1`, `foto2`, ... | `images[]` | Array de URLs de imágenes |

## Estructura de Carpetas

Después del deploy, la estructura en `public_html` debe ser:

```
public_html/
├── index.html (frontend React)
├── assets/ (frontend build)
├── .htaccess
├── ficha/
│   └── index.php (redirección de Inmovilla)
├── cliente/
│   └── index.php (panel de clientes)
├── archivos en bruto/
│   ├── listado.xml (XML de Inmovilla)
│   └── imagenes/ (imágenes locales si se usan)
├── backend/
│   └── dist/ (backend compilado)
└── listacontactos.html (página independiente)
```

## Verificación

### 1. Verificar SPF

```bash
# Usando dig (Linux/Mac)
dig TXT antheacapital.com

# O usar herramientas online mencionadas anteriormente
```

### 2. Verificar Archivos PHP

1. Accede a: `https://antheacapital.com/ficha/index.php?codigo=2_123456`
2. Debe redirigir a: `https://antheacapital.com/propiedades?post_id=123456`
3. La página de propiedades debe detectar el `post_id` y mostrar la propiedad correspondiente

### 3. Verificar Backend

1. Verifica que el backend puede leer el XML:
   ```bash
   curl https://antheacapital.com/api/properties
   ```

2. Verifica búsqueda por codOfer:
   ```bash
   curl https://antheacapital.com/api/properties/by-cod/123456
   ```

### 4. Verificar Frontend

1. Accede a: `https://antheacapital.com/propiedades`
2. Debe mostrar las propiedades cargadas desde el XML de Inmovilla
3. Al hacer clic en una propiedad, debe mostrar los detalles correctos

## Solución de Problemas

### El SPF no funciona

- Verifica que el registro TXT esté correctamente configurado en MXRoute
- Espera hasta 48 horas para la propagación DNS completa
- Verifica que no haya errores de sintaxis en el registro SPF

### Los archivos PHP no funcionan

- Verifica que las carpetas `ficha/` y `cliente/` estén en la raíz de `public_html`
- Verifica que el servidor tenga PHP habilitado
- Verifica los permisos de los archivos (deben ser ejecutables)

### El backend no carga propiedades

- Verifica que el XML esté accesible en la URL o ruta configurada
- Revisa los logs del backend para ver errores de parseo
- Verifica que el formato del XML coincida con el esperado

### Las propiedades no se muestran en el frontend

- Verifica que el backend esté respondiendo correctamente
- Revisa la consola del navegador para errores de JavaScript
- Verifica que la API esté accesible desde el frontend

## Contacto

Para más información sobre la integración con Inmovilla, consulta:
- Documentación de Inmovilla: http://procesos.inmovilla.com/apiweb/doc/index.php
- Documentación de API: https://procesos.apinmo.com/api/v1/doc/
