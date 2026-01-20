// Configuración para PM2 (si Hostinger lo soporta)
module.exports = {
  apps: [{
    name: 'anthea-capital-backend',
    script: './dist/main.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
