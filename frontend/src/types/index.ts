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
  email: string
  phone?: string
  message: string
  propertyId?: string
  consent: boolean
  marketing?: boolean
}

export interface ValuationForm {
  address: string
  type: string
  area: number
  bedrooms: number
  state: string
  name: string
  email: string
  phone: string
  consent: boolean
  marketing?: boolean
}

export interface CookiePreferences {
  necessary: boolean
  performance: boolean
  functionality: boolean
  targeting: boolean
  social: boolean
}

