# ⚠️ Problema: Backend No Accesible

## Síntoma

Cuando se envía el formulario de contacto, el frontend recibe **HTML en lugar de JSON**. Esto significa que la petición a `/api/contact` no está llegando al backend de Node.js.

## Causa

El servidor web (nginx/apache) está devolviendo el `index.html` del frontend en lugar de redirigir la petición al backend de Node.js que corre en el puerto 3001.

## Solución

Necesitas configurar el servidor web para que redirija todas las peticiones que empiezan con `/api` al backend de Node.js.

### Para Hostinger con Node.js

1. **Verifica que el backend esté corriendo:**
   - Ve al panel de Hostinger
   - Busca la sección "Node.js"
   - Verifica que tu aplicación está activa y corriendo en el puerto 3001

2. **Configura el proxy reverso en el servidor web:**

   Si usas **nginx**, necesitas crear o editar el archivo de configuración (normalmente en `/etc/nginx/sites-available/` o similar):

   ```nginx
   server {
       listen 80;
       server_name antheacapital.com www.antheacapital.com;

       # Servir archivos estáticos del frontend
       root /home/usuario/domains/antheacapital.com/public_html/frontend/dist;
       index index.html;

       # Redirigir todas las peticiones /api/* al backend
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Para todas las demás rutas, servir el index.html (SPA routing)
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   Si usas **Apache**, necesitas crear o editar el archivo `.htaccess` en la raíz del sitio:

   ```apache
   # Redirigir /api/* al backend de Node.js
   RewriteEngine On
   RewriteCond %{REQUEST_URI} ^/api
   RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]

   # Para el resto, servir archivos estáticos
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

3. **Reinicia el servidor web:**
   - Para nginx: `sudo systemctl restart nginx`
   - Para Apache: `sudo systemctl restart apache2`
   - O desde el panel de Hostinger si tienen opción para reiniciar

### Verificación

Después de configurar el proxy, prueba:

1. **Directamente el endpoint del backend:**
   ```bash
   curl http://localhost:3001/api/contact/test -X POST
   ```
   Esto debería devolver JSON, no HTML.

2. **Desde el navegador (a través del proxy):**
   ```javascript
   fetch('/api/contact/test', { method: 'POST' })
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```
   Esto también debería devolver JSON.

## Alternativa Temporal

Si no puedes configurar el proxy ahora mismo, puedes cambiar temporalmente la URL del API en el frontend para que apunte directamente al backend:

1. Edita `frontend/.env.production` (o crea el archivo):
   ```
   VITE_API_URL=https://antheacapital.com:3001/api
   ```

2. Rebuild el frontend:
   ```bash
   cd frontend
   npm run build
   ```

**⚠️ NOTA:** Esta solución temporal puede tener problemas con CORS y no es recomendable para producción. La solución correcta es configurar el proxy reverso.

## Verificar que el Backend Está Corriendo

Para verificar que el backend está activo:

1. **Desde SSH:**
   ```bash
   curl http://localhost:3001/api/contact/test -X POST
   ```

2. **Desde el panel de Hostinger:**
   - Ve a Node.js > Logs
   - Deberías ver mensajes del backend iniciando

3. **Verificar procesos:**
   ```bash
   ps aux | grep node
   ```
   Deberías ver un proceso de Node.js corriendo.

## Logs Útiles

Cuando el backend inicia correctamente, deberías ver:
```
🚀 Backend running on http://0.0.0.0:3001
📡 API available at http://localhost:3001/api
✅ Conexión con servidor de correo verificada correctamente
```

Si ves estos mensajes pero el frontend sigue recibiendo HTML, el problema es definitivamente la configuración del proxy reverso.
