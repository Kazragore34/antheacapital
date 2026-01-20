# 🔐 Solución: Error "530 Login incorrect" en FTP Deploy

## Problema

El error `530 Login incorrect` significa que las credenciales FTP no son correctas o tienen un formato incorrecto.

## Posibles Causas

1. **Formato del usuario incorrecto**
   - Algunos servidores requieren solo `u571508109` (sin el dominio)
   - Otros requieren `u571508109.antheacapital.com` (con dominio)

2. **Contraseña con espacios o caracteres especiales**
   - La contraseña puede tener espacios al inicio/final
   - Puede tener caracteres especiales que no se copiaron bien

3. **Credenciales diferentes para FTP vs SFTP**
   - Algunos servidores usan credenciales diferentes para FTP y SFTP

## Soluciones a Probar

### Opción 1: Verificar el formato del usuario

Prueba estos formatos en GitHub Secrets:

**Formato 1 (sin dominio):**
- `FTP_USERNAME`: `u571508109`

**Formato 2 (con dominio):**
- `FTP_USERNAME`: `u571508109.antheacapital.com`

### Opción 2: Verificar la contraseña

1. Ve a WinSCP
2. Intenta conectarte manualmente con las mismas credenciales
3. Si funciona en WinSCP pero no en GitHub Actions, puede ser un problema de formato

### Opción 3: Verificar en el Panel de Hostinger

1. Ve al panel de Hostinger
2. Busca "FTP Accounts" o "Cuentas FTP"
3. Verifica el formato exacto del usuario y la contraseña
4. Puede que necesites resetear la contraseña FTP

### Opción 4: Usar SFTP en lugar de FTP

Si Hostinger soporta SFTP, podemos cambiar el workflow para usar SFTP en lugar de FTP.

## Pasos Inmediatos

1. **Verifica en WinSCP:**
   - ¿Qué formato de usuario usas exactamente?
   - ¿La contraseña tiene espacios o caracteres especiales?

2. **Actualiza los Secrets en GitHub:**
   - Ve a: https://github.com/Kazragore34/antheacapital/settings/secrets/actions
   - Edita `FTP_USERNAME` y prueba con/sin dominio
   - Verifica que `FTP_PASSWORD` no tenga espacios al inicio/final

3. **Prueba de nuevo:**
   - Haz otro commit vacío para forzar el deploy
   - O espera al próximo push

## Verificación en WinSCP

En WinSCP, cuando te conectas exitosamente:
- ¿Qué formato de usuario aparece en la sesión?
- ¿Es `u571508109` o `u571508109.antheacapital.com`?

## Si Nada Funciona

Si ninguna de las opciones funciona, puede ser que:
1. Hostinger requiera SFTP en lugar de FTP
2. Necesites crear una nueva cuenta FTP desde el panel
3. Haya restricciones de IP para el FTP

En ese caso, podemos:
- Cambiar el workflow para usar SFTP
- O subir los archivos manualmente desde WinSCP
