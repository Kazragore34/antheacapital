import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import ImageLightbox from '../components/properties/ImageLightbox'
import ContactForm from '../components/ui/ContactForm'

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (id) {
      loadProperty()
    }
  }, [id])

  const loadProperty = async () => {
    try {
      const data = await propertiesService.getById(id!)
      setProperty(data)
    } catch (error) {
      console.error('Error loading property:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Propiedad no encontrada</h2>
          <Link to="/propiedades" className="btn-primary">
            Volver a Propiedades
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery */}
      {property.images && Array.isArray(property.images) && property.images.length > 0 && (
        <section className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="md:col-span-2">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-[60vh] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setLightboxIndex(0)
                  setLightboxOpen(true)
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'
                }}
              />
            </div>
            {Array.isArray(property.images) && property.images.slice(1, 5).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${property.title} ${index + 2}`}
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  setLightboxIndex(index + 1)
                  setLightboxOpen(true)
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'
                }}
              />
            ))}
          </div>
          {property.images.length > 5 && (
            <button
              onClick={() => {
                setLightboxIndex(0)
                setLightboxOpen(true)
              }}
              className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Ver todas las imágenes ({property.images.length})
            </button>
          )}
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  property.type === 'venta' 
                    ? 'bg-gold text-white' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                </span>
                <span className="text-3xl font-serif text-gold">
                  {formatPrice(property.price)}
                </span>
              </div>
              <h1 className="font-serif text-4xl mb-4 text-black-soft">
                {property.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                {property.location.address}, {property.location.city}, {property.location.province}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🛏️</div>
                  <div className="font-semibold">{property.features.bedrooms}</div>
                  <div className="text-sm text-gray-600">Habitaciones</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🚿</div>
                  <div className="font-semibold">{property.features.bathrooms}</div>
                  <div className="text-sm text-gray-600">Baños</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">📐</div>
                  <div className="font-semibold">{property.features.area}</div>
                  <div className="text-sm text-gray-600">m²</div>
                </div>
                {property.features.floor && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-semibold">{property.features.floor}º</div>
                    <div className="text-sm text-gray-600">Planta</div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.features.parking && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Parking</span>
                )}
                {property.features.elevator && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Ascensor</span>
                )}
                {property.features.terrace && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Terraza</span>
                )}
                {property.features.garden && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Jardín</span>
                )}
                {property.features.pool && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Piscina</span>
                )}
                {property.features.furnished && (
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Amueblado</span>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-serif text-2xl mb-4">Solicitar Información</h3>
                <ContactForm propertyId={property._id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && property.images && Array.isArray(property.images) && (
        <ImageLightbox
          images={property.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}

export default PropertyDetail

