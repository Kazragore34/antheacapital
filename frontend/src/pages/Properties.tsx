import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<{
    type?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    minArea?: number
  }>({})

  useEffect(() => {
    // Verificar si hay parámetro post_id en la URL (viene de Inmovilla)
    const postId = searchParams.get('post_id')
    if (postId) {
      // Redirigir a la página de detalle de la propiedad usando el codOfer
      navigate(`/propiedades/${postId}`, { replace: true })
      return
    }
    loadProperties()
  }, [filters, searchParams, navigate])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const data = await propertiesService.getAll(filters)
      // Solo mostrar propiedades del XML de Inmovilla
      if (Array.isArray(data) && data.length > 0) {
        setProperties(data)
      } else {
        // No hay propiedades disponibles
        setProperties([])
      }
    } catch (error) {
      console.error('Error loading properties:', error)
      // En caso de error, no mostrar propiedades
      setProperties([])
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

