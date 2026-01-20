import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { propertiesService } from '../services/properties.service'
import { Property } from '../types'
import ImageLightbox from '../components/properties/ImageLightbox'
import ContactForm from '../components/ui/ContactForm'
import { useTranslation } from '../hooks/useTranslation'
import { translateText } from '../services/translation.service'

const PropertyDetail = () => {
  const { t, tString, language } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [translatedProperty, setTranslatedProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
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

  // Traducir propiedad cuando cambia el idioma o la propiedad
  useEffect(() => {
    if (!property) {
      setTranslatedProperty(null)
      return
    }

    if (language === 'es') {
      // Si es español, usar la propiedad original directamente
      setTranslatedProperty(property)
      return
    }

    // Traducir para otros idiomas
    const translateProperty = async () => {
      setTranslating(true)
      try {
        const [translatedTitle, translatedDescription] = await Promise.all([
          translateText(property.title, language, 'es'),
          translateText(property.description || '', language, 'es'),
        ])

        setTranslatedProperty({
          ...property,
          title: translatedTitle,
          description: translatedDescription,
        })
      } catch (error) {
        console.error('Error translating property:', error)
        setTranslatedProperty(property)
      } finally {
        setTranslating(false)
      }
    }

    translateProperty()
  }, [property, language])

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

  const formatPrice = (price: number): string => {
    if (!price || price === 0 || isNaN(price)) {
      return tString('properties.card.consultPrice')
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

  // Usar propiedad traducida si está disponible, sino la original
  const displayProperty = translatedProperty || property

  return (
    <div className="min-h-screen bg-black-soft">
      <div className="container mx-auto px-4 py-8">
        {translating && (
          <div className="mb-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
            <p className="mt-2 text-gray-300 text-sm">Traduciendo contenido...</p>
          </div>
        )}
        
        {/* Header Section: Image + Form Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-2">
          {/* Main Image - Left Side */}
          {displayProperty.images && Array.isArray(displayProperty.images) && displayProperty.images.length > 0 && (
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden rounded-lg">
                <div className="relative aspect-[16/10] bg-gray-900">
                  <img
                    src={displayProperty.images[selectedImageIndex]}
                    alt={`${displayProperty.title} - Imagen ${selectedImageIndex + 1}`}
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
                  {displayProperty.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                      {selectedImageIndex + 1} / {displayProperty.images.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.requestInfo')}</h3>
                <ContactForm 
                  propertyId={displayProperty._id}
                  propertyTitle={displayProperty.title}
                  propertyUrl={window.location.href}
                  propertyPrice={formatPrice(displayProperty.price)}
                  propertyType={displayProperty.type === 'venta' ? tString('properties.card.sale') : tString('properties.card.rent')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Property Info Section */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              displayProperty.type === 'venta' 
                ? 'bg-gold text-black-soft' 
                : 'bg-gray-700 text-white'
            }`}>
              {displayProperty.type === 'venta' ? t('properties.card.sale') : t('properties.card.rent')}
            </span>
            <span className="text-3xl font-serif text-gold">
              {formatPrice(displayProperty.price)}
            </span>
          </div>
          <h1 className="font-serif text-4xl mb-4 text-white">
            {displayProperty.title}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            {displayProperty.location?.address || t('properties.detail.addressNotAvailable')}, {displayProperty.location?.city || t('properties.detail.cityNotAvailable')}, {displayProperty.location?.province || t('properties.detail.provinceNotAvailable')}
          </p>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.description')}</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {displayProperty.description}
          </p>
        </div>

        {/* Image Gallery - Below Description */}
        {displayProperty.images && Array.isArray(displayProperty.images) && displayProperty.images.length > 1 && (
          <div className="mb-6">
            <h2 className="font-serif text-2xl mb-4 text-white">{tString('properties.detail.gallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProperty.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index)
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-gold opacity-100'
                      : 'opacity-80 hover:opacity-100 hover:ring-1 hover:ring-gray-600'
                  }`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`${displayProperty.title} - Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content - Characteristics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">

            {displayProperty.features && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl mb-4 text-white">{t('properties.detail.characteristics')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayProperty.features.bedrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🛏️</div>
                      <div className="font-semibold text-white">{displayProperty.features.bedrooms}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.bedrooms')}</div>
                    </div>
                  )}
                  {displayProperty.features.bathrooms !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🚿</div>
                      <div className="font-semibold text-white">{displayProperty.features.bathrooms}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.bathrooms')}</div>
                    </div>
                  )}
                  {displayProperty.features.area !== undefined && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">📐</div>
                      <div className="font-semibold text-white">{formatNumber(displayProperty.features.area)}</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.area')}</div>
                    </div>
                  )}
                  {displayProperty.features.floor && (
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg text-center">
                      <div className="text-2xl mb-2">🏢</div>
                      <div className="font-semibold text-white">{displayProperty.features.floor}º</div>
                      <div className="text-sm text-gray-400">{t('properties.detail.floor')}</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {displayProperty.features.parking && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.parking')}</span>
                  )}
                  {displayProperty.features.elevator && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.elevator')}</span>
                  )}
                  {displayProperty.features.terrace && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.terrace')}</span>
                  )}
                  {displayProperty.features.garden && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.garden')}</span>
                  )}
                  {displayProperty.features.pool && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.pool')}</span>
                  )}
                  {displayProperty.features.furnished && (
                    <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-white">{t('properties.detail.furnished')}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxOpen && displayProperty.images && Array.isArray(displayProperty.images) && (
        <ImageLightbox
          images={displayProperty.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}

export default PropertyDetail

