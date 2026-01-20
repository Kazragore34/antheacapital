# 🔍 Verificar Por Qué No Se Están Subiendo Archivos

## Problema Detectado

El usuario reporta que los archivos no se están subiendo al servidor.

## Verificaciones Necesarias

### 1. Verificar GitHub Actions

1. Ve a: https://github.com/Kazragore34/antheacapital/actions
2. Busca el último workflow ejecutado
3. Haz clic en el workflow más reciente
4. Revisa los logs de cada paso:
   - ✅ "Install Backend Dependencies" - ¿Se instalaron correctamente?
   - ✅ "Build Backend" - ¿Se compiló correctamente?
   - ✅ "Prepare Deployment" - ¿Se copiaron los archivos?
   - ✅ "Deploy to Hostinger" - ¿Se subieron los archivos?

### 2. Verificar Errores Comunes

**Error: "backend/dist no existe después del build"**
- **Causa:** El build falló
- **Solución:** Revisar logs del paso "Build Backend"

**Error: "backend/node_modules no encontrado"**
- **Causa:** npm install falló
- **Solución:** Revisar logs del paso "Install Backend Dependencies"

**Error: "FTP connection failed"**
- **Causa:** Credenciales FTP incorrectas o servidor inaccesible
- **Solución:** Verificar secrets en GitHub:
  - `FTP_SERVER`
  - `FTP_USERNAME`
  - `FTP_PASSWORD`

**Error: "Permission denied"**
- **Causa:** Permisos incorrectos en el servidor
- **Solución:** Verificar permisos de carpetas en Hostinger

### 3. Verificar Secrets de GitHub

1. Ve a: https://github.com/Kazragore34/antheacapital/settings/secrets/actions
2. Verifica que existan estos secrets:
   - `FTP_SERVER` - Debe ser algo como `ftp.antheacapital.com` o IP
   - `FTP_USERNAME` - Tu usuario FTP de Hostinger
   - `FTP_PASSWORD` - Tu contraseña FTP

### 4. Verificar Estructura en Hostinger

Conecta vía WinSCP y verifica:

```
/home/u571508109/domains/antheacapital.com/public_html/
├── backend/
│   ├── dist/              ← ¿Existe?
│   │   └── main.js        ← ¿Existe?
│   ├── node_modules/      ← ¿Existe?
│   │   └── xml2js/        ← ¿Existe?
│   ├── package.json       ← ¿Existe?
│   └── start.sh           ← ¿Existe?
```

### 5. Verificar Logs del Workflow

En los logs de GitHub Actions, busca:

```
✅ Backend dist copiado
✅ Backend node_modules copiado
✅ xml2js verificado en deploy/backend/node_modules/
```

Si ves estos mensajes, los archivos se copiaron correctamente al directorio `deploy/`.

### 6. Verificar FTP Deploy Action

Busca en los logs:

```
Uploading files...
✅ Uploaded: backend/dist/main.js
✅ Uploaded: backend/node_modules/xml2js/...
```

Si NO ves estos mensajes, el problema está en la subida FTP.

## Soluciones Rápidas

### Si el Workflow No Se Ejecuta

1. Verifica que el último commit esté en la rama `main`
2. Haz un push vacío para forzar ejecución:
   ```bash
   git commit --allow-empty -m "Trigger deploy"
   git push origin main
   ```

### Si el Build Falla

1. Revisa los logs del paso "Build Backend"
2. Verifica que todas las dependencias estén en `package.json`
3. Verifica que `xml2js` esté listado en `package.json`

### Si FTP Falla

1. Verifica las credenciales FTP en GitHub Secrets
2. Prueba conectarte manualmente con WinSCP usando las mismas credenciales
3. Verifica que el directorio `/public_html/` exista y tenga permisos de escritura

### Si Los Archivos No Aparecen en el Servidor

1. Verifica que el workflow se completó sin errores
2. Espera 2-3 minutos después de que termine el workflow
3. Refresca WinSCP (F5)
4. Verifica que estás mirando el directorio correcto: `/public_html/backend/`

## Comandos para Diagnosticar

### Desde WinSCP Terminal:

```bash
# Verificar estructura
ls -la /home/u571508109/domains/antheacapital.com/public_html/backend/

# Verificar que dist existe
ls -la /home/u571508109/domains/antheacapital.com/public_html/backend/dist/

# Verificar que node_modules existe
ls -la /home/u571508109/domains/antheacapital.com/public_html/backend/node_modules/ | head -20

# Verificar xml2js específicamente
ls -la /home/u571508109/domains/antheacapital.com/public_html/backend/node_modules/xml2js/
```

## Próximos Pasos

1. ✅ Revisa los logs de GitHub Actions
2. ✅ Verifica los secrets de GitHub
3. ✅ Verifica la estructura en Hostinger con WinSCP
4. ✅ Comparte los errores específicos que veas en los logs
