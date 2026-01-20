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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (id) {
      loadProperty()
    }
  }, [id])

  useEffect(() => {
    // Resetear imagen seleccionada cuando cambia la propiedad
    setSelectedImageIndex(0)
  }, [property?._id])

  const loadProperty = async () => {
    try {
      // Si el ID es numérico, probablemente es un codOfer de Inmovilla
      // Intentar buscar por codOfer primero
      if (id && /^\d+$/.test(id)) {
        const dataByCod = await propertiesService.getByCodOfer(id)
        if (dataByCod) {
          setProperty(dataByCod)
          setLoading(false)
          return
        }
      }
      
      // Si no se encontró por codOfer o el ID no es numérico, buscar por ID normal
      const data = await propertiesService.getById(id!)
      if (data) {
        setProperty(data)
      } else {
        setProperty(null)
      }
    } catch (error) {
      console.error('Error loading property:', error)
      setProperty(null)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    if (!price || price === 0 || isNaN(price)) {
      return 'Consultar precio'
    }
    // Formato español: 212.737 € (con punto como separador de miles y espacio antes del símbolo)
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace('€', '€').trim()
  }

  const formatNumber = (num: number) => {
    if (!num || num === 0 || isNaN(num)) {
      return '-'
    }
    return new Intl.NumberFormat('es-ES').format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-soft">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-300">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-soft">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Propiedad no encontrada</h2>
          <Link to="/propiedades" className="btn-primary">
            Volver a Propiedades
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-soft">
      {/* Modern Image Gallery */}
      {property.images && Array.isArray(property.images) && property.images.length > 0 && (
        <section className="relative bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            {/* Main Image Display */}
            <div className="relative mb-4 rounded-lg overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-gray-800">
                <img
                  src={property.images[selectedImageIndex]}
                  alt={`${property.title} - Imagen ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => {
                    setLightboxIndex(selectedImageIndex)
                    setLightboxOpen(true)
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'
                  }}
                />
                {/* Overlay con información */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button
                    onClick={() => {
                      setLightboxIndex(selectedImageIndex)
                      setLightboxOpen(true)
                    }}
                    className="bg-gold text-black-soft px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
                  >
                    Ver en pantalla completa
                  </button>
                </div>
                {/* Contador de imágenes */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {selectedImageIndex + 1} / {property.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {property.images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedImageIndex === index
                          ? 'ring-2 ring-gold scale-105'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`${property.title} - Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200'
                        }}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                          <div className="w-3 h-3 bg-gold rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                {property.images.length > 5 && (
                  <>
                    {selectedImageIndex > 0 && (
                      <button
                        onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/90 transition-all z-10"
                        aria-label="Imagen anterior"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {selectedImageIndex < property.images.length - 1 && (
                      <button
                        onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/90 transition-all z-10"
                        aria-label="Siguiente imagen"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Ver todas las imágenes button */}
            {property.images.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setLightboxIndex(selectedImageIndex)
                    setLightboxOpen(true)
                  }}
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:border-gold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ver todas las imágenes ({property.images.length})
                </button>
              </div>
            )}
          </div>
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
                    ? 'bg-gold text-black-soft' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {property.type === 'venta' ? 'Venta' : 'Alquiler'}
                </span>
                <span className="text-3xl font-serif text-gold">
                  {formatPrice(property.price)}
                </span>
              </div>
              <h1 className="font-serif text-4xl mb-4 text-white">
                {property.title}
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                {property.location?.address || 'Dirección no disponible'}, {property.location?.city || 'Ciudad no disponible'}, {property.location?.province || 'Provincia no disponible'}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4 text-white">Descripción</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.features && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-4 text-white">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.features.bedrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🛏️</div>
                      <div className="font-semibold text-white">{property.features.bedrooms}</div>
                      <div className="text-sm text-gray-400">Habitaciones</div>
                    </div>
                  )}
                  {property.features.bathrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🚿</div>
                      <div className="font-semibold text-white">{property.features.bathrooms}</div>
                      <div className="text-sm text-gray-400">Baños</div>
                    </div>
                  )}
                  {property.features.area !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">📐</div>
                      <div className="font-semibold text-white">{formatNumber(property.features.area)}</div>
                      <div className="text-sm text-gray-400">m²</div>
                    </div>
                  )}
                  {property.features.floor && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-white">{property.features.floor}º</div>
                      <div className="text-sm text-gray-400">Planta</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.features.parking && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Parking</span>
                  )}
                  {property.features.elevator && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Ascensor</span>
                  )}
                  {property.features.terrace && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Terraza</span>
                  )}
                  {property.features.garden && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Jardín</span>
                  )}
                  {property.features.pool && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Piscina</span>
                  )}
                  {property.features.furnished && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">Amueblado</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-serif text-2xl mb-4 text-white">Solicitar Información</h3>
                <ContactForm 
                  propertyId={property._id}
                  propertyTitle={property.title}
                  propertyUrl={window.location.href}
                  propertyPrice={formatPrice(property.price)}
                  propertyType={property.type === 'venta' ? 'Venta' : 'Alquiler'}
                />
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

