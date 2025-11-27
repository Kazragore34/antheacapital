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
    // Asegurar que la respuesta tenga la estructura esperada
    if (response.data && !Array.isArray(response.data) && typeof response.data !== 'object') {
      console.warn('Respuesta de API con formato inesperado:', response.data)
    }
    return response
  },
  (error) => {
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

