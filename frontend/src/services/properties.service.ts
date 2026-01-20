import { Property } from '../types'
import { inmovillaAPIService } from './inmovilla-api.service'

// Cache de propiedades (más corto para API en tiempo real)
let propertiesCache: Property[] | null = null
let cacheTime: number = 0
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutos (más corto porque la API es en tiempo real)

export const propertiesService = {
  getAll: async (filters?: {
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
  }): Promise<Property[]> => {
    try {
      // Cargar propiedades desde API de Inmovilla (con caché corto)
      const now = Date.now()
      if (!propertiesCache || (now - cacheTime) > CACHE_DURATION) {
        console.log('[PropertiesService] Cargando propiedades desde API de Inmovilla...')
        
        // Convertir filtros del formato interno al formato de la API
        const apiFilters: any = {
          limit: 1000,
        }
        
        if (filters?.type && filters.type !== 'todos') {
          apiFilters.type = filters.type
        }
        if (filters?.city) {
          apiFilters.city = filters.city
        }
        if (filters?.minPrice) {
          apiFilters.minPrice = filters.minPrice
        }
        if (filters?.maxPrice) {
          apiFilters.maxPrice = filters.maxPrice
        }
        if (filters?.bedrooms) {
          apiFilters.bedrooms = filters.bedrooms
        }
        
        propertiesCache = await inmovillaAPIService.getAll(apiFilters)
        cacheTime = now
        console.log(`[PropertiesService] ${propertiesCache.length} propiedades cargadas desde API`)
      }
      
      // Aplicar filtros adicionales si es necesario (la API ya filtra, pero por si acaso)
      return propertiesCache
    } catch (error) {
      console.error('[PropertiesService] Error fetching properties from API:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Property | null> => {
    try {
      // Si el ID es numérico, probablemente es un codOfer
      if (/^\d+$/.test(id)) {
        return await inmovillaAPIService.getByCodOfer(id)
      }
      
      // Si no, buscar en el caché
      if (!propertiesCache) {
        propertiesCache = await inmovillaAPIService.getAll()
      }
      return propertiesCache.find(p => p._id === id) || null
    } catch (error) {
      console.error('[PropertiesService] Error fetching property:', error)
      return null
    }
  },

  getByCodOfer: async (codOfer: string): Promise<Property | null> => {
    try {
      // Usar la API directamente para obtener una propiedad específica
      return await inmovillaAPIService.getByCodOfer(codOfer)
    } catch (error) {
      console.error('[PropertiesService] Error fetching property by codOfer:', error)
      return null
    }
  },

  create: async (_property: Partial<Property>): Promise<Property> => {
    // No soportado - las propiedades vienen de la API de Inmovilla
    throw new Error('Crear propiedades no está soportado - las propiedades vienen de la API de Inmovilla')
  },

  update: async (_id: string, _property: Partial<Property>): Promise<Property> => {
    // No soportado - las propiedades vienen de la API de Inmovilla
    throw new Error('Actualizar propiedades no está soportado - las propiedades vienen de la API de Inmovilla')
  },

  delete: async (_id: string): Promise<void> => {
    // No soportado - las propiedades vienen de la API de Inmovilla
    throw new Error('Eliminar propiedades no está soportado - las propiedades vienen de la API de Inmovilla')
  },
}

