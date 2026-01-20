# 🔐 Configurar Secrets de GitHub para FTP Deploy

## Error Detectado

```
Error: Error: Input required and not supplied: server
```

Este error significa que los **secrets de GitHub** no están configurados o no se están pasando correctamente a la acción FTP-Deploy-Action.

## Solución: Configurar Secrets en GitHub

### Paso 1: Ve a la Configuración de Secrets

1. Ve a tu repositorio en GitHub: https://github.com/Kazragore34/antheacapital
2. Haz clic en **"Settings"** (Configuración)
3. En el menú lateral izquierdo, busca **"Secrets and variables"** → **"Actions"**
4. O ve directamente a: https://github.com/Kazragore34/antheacapital/settings/secrets/actions

### Paso 2: Agregar los Secrets Necesarios

Necesitas crear **3 secrets** con estos nombres exactos:

#### 1. `FTP_SERVER`
- **Nombre:** `FTP_SERVER`
- **Valor:** Tu servidor FTP de Hostinger
  - Ejemplo: `ftp.antheacapital.com` o `ftp.hostinger.com`
  - O la IP del servidor FTP
  - **NO incluyas** `ftp://` al inicio, solo el dominio o IP

#### 2. `FTP_USERNAME`
- **Nombre:** `FTP_USERNAME`
- **Valor:** Tu usuario FTP de Hostinger
  - Ejemplo: `u571508109` o el usuario que te dio Hostinger

#### 3. `FTP_PASSWORD`
- **Nombre:** `FTP_PASSWORD`
- **Valor:** Tu contraseña FTP de Hostinger
  - La contraseña que usas para conectarte con WinSCP

### Paso 3: Cómo Encontrar tus Credenciales FTP

Si no recuerdas tus credenciales FTP:

1. **Desde el Panel de Hostinger:**
   - Ve al panel de control de Hostinger
   - Busca la sección **"FTP Accounts"** o **"Cuentas FTP"**
   - Ahí verás el usuario y podrás cambiar/resetear la contraseña

2. **Desde WinSCP:**
   - Abre WinSCP
   - Ve a **"Sesiones guardadas"** o revisa la configuración de tu sesión
   - Ahí verás el servidor, usuario y puerto

### Paso 4: Verificar que los Secrets Estén Configurados

Después de agregar los secrets, deberías ver:

```
Repository secrets (3)
├── FTP_SERVER
├── FTP_USERNAME
└── FTP_PASSWORD
```

### Paso 5: Probar el Deploy

Una vez configurados los secrets:

1. Haz un commit vacío para forzar el deploy:
   ```bash
   git commit --allow-empty -m "Test: Verificar secrets de FTP"
   git push origin main
   ```

2. Ve a GitHub Actions y verifica que el workflow se ejecute correctamente

## Verificación del Workflow

El workflow debería verse así en `.github/workflows/deploy.yml`:

```yaml
- name: Deploy to Hostinger
  uses: SamKirkland/FTP-Deploy-Action@4.3.0
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./deploy/
    server-dir: /public_html/
```

## Si Aún No Funciona

Si después de configurar los secrets sigue fallando:

1. **Verifica los nombres:** Deben ser exactamente `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (mayúsculas)
2. **Verifica los valores:** No deben tener espacios al inicio o final
3. **Verifica el servidor:** Debe ser solo el dominio/IP, sin `ftp://` ni `http://`
4. **Verifica el puerto:** Si tu servidor FTP usa un puerto diferente al 21, agrégalo así: `ftp.antheacapital.com:2121`

## Ejemplo de Configuración Correcta

```
FTP_SERVER: ftp.antheacapital.com
FTP_USERNAME: u571508109
FTP_PASSWORD: tu_contraseña_aquí
```

## Nota de Seguridad

⚠️ **NUNCA** compartas tus secrets públicamente. Los secrets de GitHub están encriptados y solo son accesibles para el repositorio.
