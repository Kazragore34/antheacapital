# Verificar que apiinmovilla.php esté en el Servidor

## 📁 Ubicación del Archivo

El archivo `apiinmovilla.php` debe estar en:
```
public_html/archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php
```

## ✅ Verificación

### Opción 1: Desde WinSCP o FTP

1. Conecta a tu servidor Hostinger por FTP/SFTP
2. Navega a: `public_html/archivos en bruto/api_cliente/api_cliente/cliente/`
3. Verifica que exista el archivo `apiinmovilla.php`

### Opción 2: Desde el Navegador

Prueba acceder directamente a:
```
https://antheacapital.com/archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php
```

**Nota:** Esto puede mostrar un error de PHP (normal), pero confirma que el archivo existe.

### Opción 3: Verificar en el Deploy

El workflow de GitHub Actions debería copiar automáticamente la carpeta `archivos en bruto/` al servidor.

Revisa los logs del deploy en:
```
https://github.com/Kazragore34/antheacapital/actions
```

Deberías ver un mensaje como:
```
✅ Copiado archivos en bruto/ (incluyendo imágenes si existen)
```

## 🔧 Si el Archivo No Está

Si el archivo no está en el servidor:

### Opción A: Subirlo Manualmente

1. Conecta por FTP/SFTP a Hostinger
2. Crea las carpetas necesarias:
   ```
   public_html/archivos en bruto/api_cliente/api_cliente/cliente/
   ```
3. Sube el archivo `apiinmovilla.php` desde:
   ```
   archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php
   ```

### Opción B: Verificar el Deploy

El archivo debería copiarse automáticamente. Si no se copia:

1. Verifica que el archivo exista en el repositorio:
   ```
   archivos en bruto/api_cliente/api_cliente/cliente/apiinmovilla.php
   ```
2. Verifica que el workflow de deploy incluya la copia de esta carpeta
3. Haz un nuevo push para forzar el deploy

## 📝 Estructura Correcta en el Servidor

```
public_html/
├── api-inmovilla-proxy.php
├── archivos en bruto/
│   └── api_cliente/
│       └── api_cliente/
│           └── cliente/
│               ├── apiinmovilla.php  ← Este archivo es crítico
│               └── cliente.php
├── ficha/
├── cliente/
└── ...
```

---

**Última actualización:** 20/01/2026
