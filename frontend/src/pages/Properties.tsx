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
      console.log('[Properties] Loading properties with filters:', filters)
      console.log('[Properties] Calling propertiesService.getAll()...')
      
      const data = await propertiesService.getAll(filters)
      
      console.log('[Properties] Received data:', data)
      console.log('[Properties] Data type:', Array.isArray(data) ? 'array' : typeof data)
      console.log('[Properties] Data length:', Array.isArray(data) ? data.length : 'N/A')
      
      if (Array.isArray(data)) {
        if (data.length > 0) {
          console.log(`[Properties] ✅ Setting ${data.length} properties`)
          setProperties(data)
        } else {
          console.warn('[Properties] ⚠️ Empty array received - no properties found')
          setProperties([])
        }
      } else {
        console.error('[Properties] ❌ Data is not an array:', typeof data, data)
        setProperties([])
      }
    } catch (error) {
      console.error('[Properties] ❌ Error loading properties:', error)
      if (error instanceof Error) {
        console.error('[Properties] Error message:', error.message)
        console.error('[Properties] Error stack:', error.stack)
      }
      setProperties([])
    } finally {
      setLoading(false)
      console.log('[Properties] Loading completed')
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

