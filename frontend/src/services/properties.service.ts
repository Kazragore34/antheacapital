import { Property } from '../types'
import { loadPropertiesFromXML, filterProperties, findPropertyByCodOfer, findPropertyById } from './xml-properties.service'

// Cache de propiedades
let propertiesCache: Property[] | null = null
let cacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

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
      // Cargar propiedades desde XML (con caché)
      const now = Date.now()
      if (!propertiesCache || (now - cacheTime) > CACHE_DURATION) {
        console.log('[PropertiesService] Cargando propiedades desde XML...')
        propertiesCache = await loadPropertiesFromXML()
        cacheTime = now
        console.log(`[PropertiesService] ${propertiesCache.length} propiedades cargadas`)
      }
      
      // Aplicar filtros
      if (filters && Object.keys(filters).length > 0) {
        return filterProperties(propertiesCache, filters)
      }
      
      return propertiesCache
    } catch (error) {
      console.error('Error fetching properties:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Property | null> => {
    try {
      // Cargar propiedades si no están en caché
      if (!propertiesCache) {
        propertiesCache = await loadPropertiesFromXML()
      }
      return findPropertyById(propertiesCache, id)
    } catch (error) {
      console.error('Error fetching property:', error)
      return null
    }
  },

  getByCodOfer: async (codOfer: string): Promise<Property | null> => {
    try {
      // Cargar propiedades si no están en caché
      if (!propertiesCache) {
        propertiesCache = await loadPropertiesFromXML()
      }
      return findPropertyByCodOfer(propertiesCache, codOfer)
    } catch (error) {
      console.error('Error fetching property by codOfer:', error)
      return null
    }
  },

  create: async (property: Partial<Property>): Promise<Property> => {
    // No soportado - las propiedades vienen del XML
    throw new Error('Crear propiedades no está soportado - las propiedades vienen del XML de Inmovilla')
  },

  update: async (id: string, property: Partial<Property>): Promise<Property> => {
    // No soportado - las propiedades vienen del XML
    throw new Error('Actualizar propiedades no está soportado - las propiedades vienen del XML de Inmovilla')
  },

  delete: async (id: string): Promise<void> => {
    // No soportado - las propiedades vienen del XML
    throw new Error('Eliminar propiedades no está soportado - las propiedades vienen del XML de Inmovilla')
  },
}

