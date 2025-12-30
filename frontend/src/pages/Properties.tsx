import { useState, useEffect } from 'react'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
  }>({})

  useEffect(() => {
    loadProperties()
  }, [filters])

  // Propiedades de ejemplo para mostrar cuando no hay datos
  const exampleProperties: Property[] = [
    {
      _id: 'example-1',
      title: 'Piso en el Centro de Aranjuez',
      description: 'Hermoso piso de 3 habitaciones en el corazón de Aranjuez, completamente reformado y con excelentes vistas.',
      type: 'venta',
      price: 185000,
      location: {
        address: 'Calle Real 25',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 95,
        floor: 2,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-2',
      title: 'Casa con Jardín en Zona Residencial',
      description: 'Encantadora casa independiente con jardín privado, ideal para familias. Zona tranquila y bien comunicada.',
      type: 'venta',
      price: 320000,
      location: {
        address: 'Avenida de la Paz 42',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        parking: true,
        elevator: false,
      },
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-3',
      title: 'Ático con Terraza Panorámica',
      description: 'Lujoso ático con terraza privada y vistas espectaculares. Acabados de alta calidad y diseño moderno.',
      type: 'venta',
      price: 275000,
      location: {
        address: 'Calle de la Reina 8',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 2,
        bathrooms: 2,
        area: 110,
        floor: 5,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-4',
      title: 'Piso en Alquiler - Centro Histórico',
      description: 'Acogedor piso de 2 habitaciones en el casco histórico, perfecto para parejas o profesionales.',
      type: 'alquiler',
      price: 850,
      location: {
        address: 'Plaza de San Antonio 12',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        floor: 1,
        parking: false,
        elevator: false,
      },
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-5',
      title: 'Dúplex Moderno con Garaje',
      description: 'Espacioso dúplex de diseño contemporáneo, con garaje incluido y zona común. Ideal para familias jóvenes.',
      type: 'venta',
      price: 245000,
      location: {
        address: 'Calle de la Primavera 15',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 3,
        bathrooms: 2,
        area: 130,
        floor: 1,
        parking: true,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
    {
      _id: 'example-6',
      title: 'Estudio Reformado - Zona Centro',
      description: 'Estudio completamente reformado, perfecto para estudiantes o profesionales. Muy bien ubicado.',
      type: 'alquiler',
      price: 550,
      location: {
        address: 'Calle de la Estación 7',
        city: 'Aranjuez',
        province: 'Madrid',
      },
      features: {
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        floor: 3,
        parking: false,
        elevator: true,
      },
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'],
      status: 'published',
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    },
  ]

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await propertiesService.getAll(filters)
      // Si no hay propiedades, mostrar las de ejemplo
      if (Array.isArray(data) && data.length > 0) {
        setProperties(data)
      } else {
        // Mostrar propiedades de ejemplo cuando no hay datos reales
        setProperties(exampleProperties)
      }
    } catch (error) {
      console.error('Error loading properties:', error)
      // En caso de error, mostrar propiedades de ejemplo
      setProperties(exampleProperties)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black-soft py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-white">
            Nuestras Propiedades
          </h1>
          <p className="text-gray-300 text-lg">
            Encuentra la propiedad perfecta para ti
          </p>
        </div>

        <PropertyFilters onFilterChange={setFilters} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-gray-300">Cargando propiedades...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg">
              No se encontraron propiedades con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties

