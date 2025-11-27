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
  (response) => response,
  (error) => {
    // Si la API no está disponible, devolver un error controlado
    if (!error.response) {
      console.error('API no disponible:', error.message)
      // Devolver un objeto con estructura esperada
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export default api

