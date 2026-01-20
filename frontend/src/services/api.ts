import axios from 'axios'

// En producción, usar URL relativa. En desarrollo, usar la variable de entorno o localhost
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para añadir token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => {
    // Detectar si recibimos HTML en lugar de JSON (problema de routing del servidor)
    if (response.data && typeof response.data === 'string' && response.data.trim().startsWith('<!doctype html>')) {
      const error = new Error('El servidor está devolviendo HTML en lugar de JSON. El backend no está accesible o la configuración del servidor web es incorrecta.')
      console.error('[API] ❌ ERROR CRÍTICO: Respuesta HTML recibida en lugar de JSON:', {
        url: response.config?.url,
        status: response.status,
        headers: response.headers,
      })
      return Promise.reject(error)
    }
    
    // Asegurar que la respuesta tenga la estructura esperada
    if (response.data && !Array.isArray(response.data) && typeof response.data !== 'object') {
      console.warn('Respuesta de API con formato inesperado:', response.data)
    }
    return response
  },
  (error) => {
    // Detectar si el error contiene HTML (problema de routing)
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.trim().startsWith('<!doctype html>')) {
      const routingError = new Error('El backend no está accesible. La petición está siendo redirigida al frontend en lugar del backend. Verifica que el backend esté corriendo y que el servidor web esté configurado correctamente para redirigir /api/* al backend.')
      console.error('[API] ❌ ERROR CRÍTICO: El servidor está devolviendo HTML en lugar de JSON:', {
        url: error.config?.url,
        status: error.response?.status,
      })
      return Promise.reject(routingError)
    }
    
    // Para errores de contacto, siempre rechazar para que el componente pueda manejarlos
    if (error.config?.url?.includes('/contact')) {
      console.error('[API] Error en petición de contacto:', error.response?.data || error.message)
      return Promise.reject(error)
    }
    
    // Si la API no está disponible, no romper la aplicación
    if (!error.response) {
      console.warn('API no disponible, continuando sin datos:', error.message)
      // Devolver una respuesta vacía en lugar de rechazar
      return Promise.resolve({ data: [] })
    }
    // Para otros errores, devolver array vacío si es una petición GET a /properties
    if (error.config?.url?.includes('/properties') && error.config?.method === 'get') {
      console.warn('Error al obtener propiedades, devolviendo array vacío:', error.message)
      return Promise.resolve({ data: [] })
    }
    return Promise.reject(error)
  }
)

export default api

