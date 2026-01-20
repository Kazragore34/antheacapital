# Cómo Obtener las Credenciales de la API de Inmovilla

## 🔑 ¿Qué Contraseña Usar?

**Generalmente es la MISMA contraseña con la que inicias sesión en el panel web de Inmovilla.**

Sin embargo, algunos sistemas CRM tienen contraseñas separadas para la API. Aquí te explico cómo obtenerlas:

---

## 📋 Paso 1: Verificar en tu Panel de Inmovilla

### Opción A: Usar tu Contraseña de Login (Más Común)

1. **Inicia sesión en tu panel de Inmovilla** (el panel web donde gestionas tus propiedades)
2. **Anota tu número de agencia** (suele aparecer en la parte superior o en la configuración)
3. **Usa la misma contraseña** con la que inicias sesión

### Opción B: Buscar Credenciales de API Específicas

Algunos sistemas tienen credenciales separadas para la API. Busca en tu panel de Inmovilla:

1. **Configuración → API** o **Integraciones → API**
2. **Credenciales de API** o **Acceso API**
3. Si hay una sección específica para "API" o "Web Services", ahí encontrarás:
   - Número de Agencia (numagencia)
   - Password de API (puede ser diferente a tu contraseña de login)

---

## 🧪 Paso 2: Probar las Credenciales

### Método 1: Probar con las Credenciales de Prueba Primero

Para verificar que todo funciona, primero prueba con las credenciales de prueba:

```php
define('INMOVILLA_NUMAGENCIA', '2');
define('INMOVILLA_PASSWORD', '82ku9xz2aw3');
```

Haz push y prueba el endpoint:
```
https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=10
```

Si funciona, significa que el código está bien y solo necesitas cambiar las credenciales.

### Método 2: Probar con Tus Credenciales

1. **Edita `api-inmovilla-proxy.php`** y cambia:
   ```php
   define('INMOVILLA_NUMAGENCIA', 'TU_NUMERO_AGENCIA');
   define('INMOVILLA_PASSWORD', 'TU_CONTRASEÑA_DE_LOGIN'); // Prueba primero con esta
   ```

2. **Haz push y prueba:**
   ```
   https://antheacapital.com/api-inmovilla-proxy.php?action=propiedades&limit=10
   ```

3. **Si funciona:** ¡Perfecto! Usa esas credenciales.

4. **Si NO funciona:**
   - Verifica que el número de agencia sea correcto
   - Prueba con una contraseña específica de API (si existe en tu panel)
   - Contacta con Inmovilla para obtener las credenciales correctas

---

## 📞 Si No Funciona: Contactar con Inmovilla

Si tu contraseña de login no funciona, contacta con el soporte de Inmovilla y pregunta:

> "Necesito las credenciales para acceder a la API de Inmovilla desde mi sitio web. ¿Cuál es mi número de agencia y qué contraseña debo usar para la API?"

**Información que Inmovilla puede pedirte:**
- Tu número de agencia
- Tu dominio web (antheacapital.com)
- El propósito (integrar propiedades en tu sitio web)

---

## ✅ Resumen

1. **Primero prueba con tu contraseña de login** (es lo más común)
2. **Si no funciona**, busca en tu panel si hay credenciales específicas de API
3. **Si aún no funciona**, contacta con Inmovilla

---

## 🔍 Dónde Encontrar tu Número de Agencia

Tu número de agencia generalmente aparece:
- En la parte superior del panel de Inmovilla
- En la URL cuando inicias sesión (ej: `inmovilla.com/panel/2/...`)
- En la configuración de tu cuenta
- En los correos que te envió Inmovilla

---

**Nota:** Las credenciales de prueba (`numagencia: 2`, `password: 82ku9xz2aw3`) son solo para pruebas y mostrarán datos de ejemplo, no tus propiedades reales.
