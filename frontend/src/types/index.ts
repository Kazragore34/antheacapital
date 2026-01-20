export interface Property {
  _id?: string
  title: string
  description: string
  type: 'venta' | 'alquiler'
  price: number
  location: {
    address: string
    city: string
    province: string
    coordinates?: [number, number]
  }
  features: {
    bedrooms: number
    bathrooms: number
    area: number // m²
    floor?: number
    parking?: boolean
    elevator?: boolean
    terrace?: boolean
    garden?: boolean
    pool?: boolean
    furnished?: boolean
  }
  images: string[]
  status: 'published' | 'draft'
  codOfer?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface User {
  _id?: string
  email: string
  name: string
  role: 'admin'
}

export interface ContactForm {
  name: string
  surname: string
  email: string
  phone: string
  message: string
  propertyId?: string
  propertyTitle?: string
  propertyUrl?: string
  propertyPrice?: string
  propertyType?: string
  consent: boolean
  marketing?: boolean
}

export interface ValuationForm {
  valuationType: 'vender' | 'comprar' | 'alquilar' | 'alquilarlo' | 'informacion'
  addressType: 'direccion' | 'catastral'
  province?: string
  city?: string
  postalCode?: string
  address?: string
  streetNumber?: string
  floor?: string
  door?: string
  cadastralRef?: string
  propertyType?: string
  area?: number
  bedrooms?: number
  bathrooms?: number
  state?: string
  yearBuilt?: number
  name: string
  email: string
  phone: string
  consent: boolean
  marketing?: boolean
  coordinates?: [number, number]
}

export interface CookiePreferences {
  necessary: boolean
  performance: boolean
  functionality: boolean
  targeting: boolean
  social: boolean
}

