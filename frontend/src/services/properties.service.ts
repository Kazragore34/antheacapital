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
      
      // Aplicar filtros localmente después de obtener las propiedades del caché
      let filteredProperties = propertiesCache || []
      
      // Filtrar por tipo
      if (filters?.type && filters.type !== 'todos' && filters.type !== '') {
        const filterType = filters.type.toLowerCase()
        if (filterType === 'venta') {
          filteredProperties = filteredProperties.filter(p => p.type === 'venta')
        } else if (filterType === 'alquiler') {
          filteredProperties = filteredProperties.filter(p => p.type === 'alquiler')
        } else if (filterType === 'alquiler-opcion-compra') {
          // Filtrar por alquiler con opción a compra
          filteredProperties = filteredProperties.filter(p => p.type === 'alquiler' && p.features?.optionToBuy)
        } else if (filterType === 'propiedades') {
          // "Propiedades" muestra todas las propiedades (venta y alquiler)
          // No filtrar, mostrar todas
        } else if (filterType === 'habitaciones') {
          // "Habitaciones" muestra solo propiedades con habitaciones (excluye parkings, trasteros, etc.)
          filteredProperties = filteredProperties.filter(p => (p.features.bedrooms || 0) > 0)
        } else if (filterType === 'traspasos') {
          // "Traspasos" muestra propiedades de traspaso
          // Buscar en el título o descripción la palabra "traspaso" o verificar si hay precio de traspaso
          filteredProperties = filteredProperties.filter(p => {
            const title = (p.title || '').toLowerCase()
            const desc = (p.description || '').toLowerCase()
            return title.includes('traspaso') || desc.includes('traspaso')
          })
        }
        console.log(`[PropertiesService] Filtrado por tipo "${filterType}": ${filteredProperties.length} de ${propertiesCache.length} propiedades`)
      }
      
      // Filtrar por ciudad
      if (filters?.city && filters.city.trim() !== '') {
        const cityFilter = filters.city.toLowerCase().trim()
        filteredProperties = filteredProperties.filter(p => 
          p.location.city?.toLowerCase().includes(cityFilter) ||
          p.location.address?.toLowerCase().includes(cityFilter)
        )
        console.log(`[PropertiesService] Filtrado por ciudad "${filters.city}": ${filteredProperties.length} propiedades`)
      }
      
      // Filtrar por precio mínimo
      if (filters?.minPrice && filters.minPrice > 0) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!)
        console.log(`[PropertiesService] Filtrado por precio mínimo ${filters.minPrice}: ${filteredProperties.length} propiedades`)
      }
      
      // Filtrar por precio máximo
      if (filters?.maxPrice && filters.maxPrice > 0) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!)
        console.log(`[PropertiesService] Filtrado por precio máximo ${filters.maxPrice}: ${filteredProperties.length} propiedades`)
      }
      
      // Filtrar por habitaciones
      if (filters?.bedrooms && filters.bedrooms > 0) {
        filteredProperties = filteredProperties.filter(p => 
          (p.features.bedrooms || 0) >= filters.bedrooms!
        )
        console.log(`[PropertiesService] Filtrado por habitaciones ${filters.bedrooms}+: ${filteredProperties.length} propiedades`)
      }
      
      // Filtrar por superficie mínima
      if (filters?.minArea && filters.minArea > 0) {
        filteredProperties = filteredProperties.filter(p => 
          (p.features.area || 0) >= filters.minArea!
        )
        console.log(`[PropertiesService] Filtrado por superficie mínima ${filters.minArea}m²: ${filteredProperties.length} propiedades`)
      }
      
      console.log(`[PropertiesService] Devolviendo ${filteredProperties.length} propiedades después de aplicar filtros`)
      return filteredProperties
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

