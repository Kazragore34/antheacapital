import api from './api'
import { Property } from '../types'

export const propertiesService = {
  getAll: async (filters?: {
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
  }): Promise<Property[]> => {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.city) params.append('city', filters.city)
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString())
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
    if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString())
    if (filters?.minArea) params.append('minArea', filters.minArea.toString())
    
    const response = await api.get(`/properties?${params.toString()}`)
    return response.data
  },

  getById: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`)
    return response.data
  },

  create: async (property: Partial<Property>): Promise<Property> => {
    const response = await api.post('/properties', property)
    return response.data
  },

  update: async (id: string, property: Partial<Property>): Promise<Property> => {
    const response = await api.patch(`/properties/${id}`, property)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`)
  },
}

