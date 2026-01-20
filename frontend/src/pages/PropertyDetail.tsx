import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import ImageLightbox from '../components/properties/ImageLightbox'
import ContactForm from '../components/ui/ContactForm'
import { useTranslation } from '../hooks/useTranslation'

const PropertyDetail = () => {
  const { t } = useTranslation()
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
      return t('properties.card.consultPrice')
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
          <p className="mt-4 text-gray-300">{t('properties.detail.loading')}</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-soft">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">{t('properties.detail.notFound')}</h2>
          <Link to="/propiedades" className="btn-primary">
            {t('properties.detail.backToProperties')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-soft">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery - Sidebar */}
          {property.images && Array.isArray(property.images) && property.images.length > 0 && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24">
                {/* Main Image Display - Compact */}
                <div className="relative mb-3 overflow-hidden rounded-lg">
                  <div className="relative aspect-square bg-gray-900">
                    <img
                      src={property.images[selectedImageIndex]}
                      alt={`${property.title} - Imagen ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer transition-opacity duration-200"
                      onClick={() => {
                        setLightboxIndex(selectedImageIndex)
                        setLightboxOpen(true)
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'
                      }}
                    />
                    {/* Minimalist counter */}
                    {property.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                        {selectedImageIndex + 1} / {property.images.length}
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Thumbnail Gallery */}
                {property.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {property.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded overflow-hidden transition-all duration-200 ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-gold opacity-100'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`Ver imagen ${index + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${property.title} - Miniatura ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  property.type === 'venta' 
                    ? 'bg-gold text-black-soft' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {property.type === 'venta' ? t('properties.card.sale') : t('properties.card.rent')}
                </span>
                <span className="text-3xl font-serif text-gold">
                  {formatPrice(property.price)}
                </span>
              </div>
              <h1 className="font-serif text-4xl mb-4 text-white">
                {property.title}
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                {property.location?.address || t('properties.detail.addressNotAvailable')}, {property.location?.city || t('properties.detail.cityNotAvailable')}, {property.location?.province || t('properties.detail.provinceNotAvailable')}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.description')}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {property.features && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.characteristics')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.features.bedrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🛏️</div>
                      <div className="font-semibold text-white">{property.features.bedrooms}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.bedrooms')}</div>
                    </div>
                  )}
                  {property.features.bathrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🚿</div>
                      <div className="font-semibold text-white">{property.features.bathrooms}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.bathrooms')}</div>
                    </div>
                  )}
                  {property.features.area !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">📐</div>
                      <div className="font-semibold text-white">{formatNumber(property.features.area)}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.area')}</div>
                    </div>
                  )}
                  {property.features.floor && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-white">{property.features.floor}º</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.floor')}</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {property.features.parking && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.parking')}</span>
                  )}
                  {property.features.elevator && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.elevator')}</span>
                  )}
                  {property.features.terrace && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.terrace')}</span>
                  )}
                  {property.features.garden && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.garden')}</span>
                  )}
                  {property.features.pool && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.pool')}</span>
                  )}
                  {property.features.furnished && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.furnished')}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.requestInfo')}</h3>
                <ContactForm 
                  propertyId={property._id}
                  propertyTitle={property.title}
                  propertyUrl={window.location.href}
                  propertyPrice={formatPrice(property.price)}
                  propertyType={property.type === 'venta' ? t('properties.card.sale') : t('properties.card.rent')}
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

