# Instrucciones para Configurar Backend con WinSCP

## Paso 1: Verificar Archivos Subidos

Conecta a Hostinger vía WinSCP y verifica que estos archivos estén en `/public_html/backend/`:

### Archivos Críticos que DEBEN estar:
- ✅ `dist/main.js` (archivo principal compilado)
- ✅ `package.json` (configuración de dependencias)
- ✅ `package-lock.json` (versiones exactas de dependencias)
- ✅ `node_modules/` (carpeta completa con todas las dependencias, incluyendo `xml2js`)

### Archivos de Configuración (opcionales pero recomendados):
- `start.sh` (script de inicio)
- `.htaccess` (configuración Apache)
- `ecosystem.config.js` (configuración PM2)

## Paso 2: Verificar que xml2js esté Instalado

1. En WinSCP, navega a: `/public_html/backend/node_modules/`
2. Busca la carpeta `xml2js`
3. Si NO existe, necesitas instalarlo manualmente (ver Paso 3)

## Paso 3: Instalar Dependencias (si falta xml2js)

### Opción A: Usar Terminal Integrado de WinSCP

1. En WinSCP, haz clic derecho en la carpeta `backend`
2. Selecciona "Abrir en Terminal" o "Open Terminal"
3. Ejecuta estos comandos:

```bash
cd /public_html/backend
npm install
```

### Opción B: Usar SSH desde WinSCP

1. En WinSCP, ve al menú "Comandos" → "Abrir Terminal" o presiona `Ctrl+P`
2. Ejecuta:

```bash
cd /public_html/backend
npm install
npm list xml2js  # Verificar que esté instalado
```

### Opción C: Si no tienes acceso SSH

Si WinSCP no te permite ejecutar comandos, necesitas:
1. Contactar a Hostinger para que ejecuten: `cd /public_html/backend && npm install`
2. O usar el panel de Node.js de Hostinger si está disponible

## Paso 4: Iniciar el Backend

### Opción A: Desde Terminal de WinSCP

```bash
cd /public_html/backend
node dist/main.js
```

**Nota:** Este comando mantendrá el proceso corriendo mientras la terminal esté abierta. Para ejecutarlo en segundo plano:

```bash
cd /public_html/backend
nohup node dist/main.js > backend.log 2>&1 &
```

### Opción B: Usar el Script de Inicio

```bash
cd /public_html/backend
chmod +x start.sh  # Hacer ejecutable (si no lo es)
./start.sh
```

### Opción C: Panel de Node.js de Hostinger

1. Ve al panel de control de Hostinger
2. Busca "Node.js" o "Aplicaciones"
3. Configura:
   - **Directorio:** `/public_html/backend`
   - **Comando:** `node dist/main.js` o `npm start`
   - **Puerto:** `3001` (o el asignado por Hostinger)
4. Inicia la aplicación

## Paso 5: Verificar que el Backend Esté Funcionando

### Desde el Navegador:

1. Abre: `https://antheacapital.com/api/properties/debug`
   - Debería mostrar un JSON con información de propiedades

2. Abre: `https://antheacapital.com/api/properties`
   - Debería mostrar un array JSON con las propiedades del XML

### Desde Terminal (si tienes acceso):

```bash
curl https://antheacapital.com/api/properties/debug
```

O desde WinSCP Terminal:

```bash
curl http://localhost:3001/api/properties/debug
```

## Paso 6: Verificar Logs

Si el backend está ejecutándose, deberías ver logs. Para verlos:

```bash
# Si usaste nohup:
tail -f /public_html/backend/backend.log

# O verifica los logs de Hostinger en el panel
```

## Solución de Problemas

### Error: "Cannot find module 'xml2js'"

**Solución:**
```bash
cd /public_html/backend
npm install xml2js
```

### Error: "Cannot find module '@nestjs/core'"

**Solución:**
```bash
cd /public_html/backend
npm install
```

### Error: "Port 3001 already in use"

**Solución:**
1. Encuentra el proceso: `ps aux | grep node`
2. Mata el proceso: `kill -9 [PID]`
3. O cambia el puerto en `package.json` o variables de entorno

### El backend no responde

**Verifica:**
1. ¿Está ejecutándose? `ps aux | grep node`
2. ¿En qué puerto está escuchando? `netstat -tulpn | grep node`
3. ¿Hay errores en los logs?

### No puedo ejecutar comandos desde WinSCP

**Alternativas:**
1. Usa el panel de Node.js de Hostinger
2. Contacta al soporte de Hostinger para que ejecuten los comandos
3. Usa un cliente SSH separado (PuTTY, MobaXterm, etc.)

## Comandos Útiles

```bash
# Ver procesos Node.js ejecutándose
ps aux | grep node

# Ver qué puertos están en uso
netstat -tulpn | grep 3001

# Ver logs en tiempo real
tail -f /public_html/backend/backend.log

# Reiniciar el backend
pkill -f "node dist/main.js"
cd /public_html/backend
node dist/main.js &

# Verificar que xml2js esté instalado
npm list xml2js

# Ver todas las dependencias instaladas
npm list --depth=0
```

## Estructura de Carpetas Esperada

```
/public_html/
├── backend/
│   ├── dist/
│   │   └── main.js          ← Archivo principal
│   ├── node_modules/         ← TODAS las dependencias (incluyendo xml2js)
│   │   └── xml2js/          ← Debe existir
│   ├── package.json
│   ├── package-lock.json
│   ├── start.sh
│   └── .htaccess
├── index.html
├── assets/
└── ...
```

## Próximos Pasos Después de Configurar

1. ✅ Verifica que el backend esté ejecutándose
2. ✅ Prueba los endpoints `/api/properties/debug` y `/api/properties`
3. ✅ Verifica que las propiedades se muestren en `https://antheacapital.com/propiedades`
4. ✅ Prueba la redirección de Inmovilla: `https://antheacapital.com/ficha/index.php?codigo=2_395378`
