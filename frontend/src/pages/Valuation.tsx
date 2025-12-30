import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { contactService } from '../services/contact.service'
import { ValuationForm } from '../types'
import PrivacyInfoDropdown from '../components/ui/PrivacyInfoDropdown'
import AddressAutocomplete from '../components/valuation/AddressAutocomplete'
import MapConfirm from '../components/valuation/MapConfirm'

type Step = 'type' | 'address' | 'map' | 'details' | 'contact' | 'complete'

const Valuation = () => {
  const [currentStep, setCurrentStep] = useState<Step>('type')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ValuationForm & { marketing?: boolean }>()

  const valuationType = watch('valuationType')
  const addressType = watch('addressType')
  const province = watch('province')
  const city = watch('city')
  const address = watch('address')
  const propertyType = watch('propertyType')
  const area = watch('area')

  // Provincias y ciudades de España (completo)
  const provinces = [
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 
    'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 
    'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 
    'Lleida', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 
    'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 
    'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
  ]

  const citiesByProvince: Record<string, string[]> = {
    'Madrid': ['Aranjuez', 'Madrid', 'Alcalá de Henares', 'Getafe', 'Móstoles', 'Fuenlabrada', 'Leganés', 'Alcorcón', 'Torrejón de Ardoz', 'Parla', 'Alcobendas', 'Las Rozas', 'San Sebastián de los Reyes', 'Rivas-Vaciamadrid', 'Coslada', 'Majadahonda', 'Valdemoro', 'Collado Villalba', 'Arganda del Rey', 'Boadilla del Monte'],
    'Barcelona': ['Barcelona', 'Badalona', 'Sabadell', 'Terrassa', 'L\'Hospitalet de Llobregat', 'Santa Coloma de Gramenet', 'Mataró', 'Sant Cugat del Vallès', 'Cornellà de Llobregat', 'Sant Boi de Llobregat'],
    'Valencia': ['Valencia', 'Alicante', 'Elche', 'Castellón de la Plana', 'Torrevieja', 'Orihuela', 'Gandía', 'Paterna', 'Sagunto', 'Alcoy'],
    'Sevilla': ['Sevilla', 'Dos Hermanas', 'Alcalá de Guadaíra', 'Utrera', 'Écija', 'Mairena del Alcor', 'Coria del Río', 'Carmona', 'Lebrija', 'Osuna'],
    'Málaga': ['Málaga', 'Marbella', 'Vélez-Málaga', 'Fuengirola', 'Torremolinos', 'Estepona', 'Benalmádena', 'Ronda', 'Antequera', 'Nerja'],
    'Murcia': ['Murcia', 'Cartagena', 'Lorca', 'Molina de Segura', 'Alcantarilla', 'Cieza', 'Yecla', 'San Javier', 'Caravaca de la Cruz', 'Totana'],
    'Zaragoza': ['Zaragoza', 'Calatayud', 'Utebo', 'Ejea de los Caballeros', 'Tarazona', 'Alagón', 'Caspe', 'La Almunia de Doña Godina', 'Borja', 'Fraga'],
    'Las Palmas': ['Las Palmas de Gran Canaria', 'Telde', 'Santa Lucía de Tirajana', 'San Bartolomé de Tirajana', 'Arucas', 'Ingenio', 'Gáldar', 'Agüimes', 'Moya', 'Valsequillo'],
  }

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    // Extraer componentes de la dirección
    if (place.address_components) {
      place.address_components.forEach((component) => {
        if (component.types.includes('postal_code')) {
          setValue('postalCode', component.long_name)
        }
        if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
          setValue('city', component.long_name)
        }
        if (component.types.includes('administrative_area_level_1')) {
          // Limpiar el nombre de la provincia (ej: "Comunidad de Madrid" -> "Madrid")
          const provinceName = component.long_name.replace(/^(Comunidad de |Provincia de |Región de )/i, '')
          setValue('province', provinceName)
        }
        if (component.types.includes('street_number')) {
          setValue('streetNumber', component.long_name)
        }
      })
    }

    if (place.geometry?.location) {
      const coords: [number, number] = [
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ]
      setValue('coordinates', coords)
    }
  }

  const handleNext = () => {
    if (currentStep === 'type' && valuationType) {
      setCurrentStep('address')
    } else if (currentStep === 'address') {
      if (addressType === 'direccion' && address && province && city) {
        setCurrentStep('map')
      } else if (addressType === 'catastral' && watch('cadastralRef')) {
        setCurrentStep('details')
      }
    } else if (currentStep === 'map' && addressConfirmed) {
      setCurrentStep('details')
    } else if (currentStep === 'details' && propertyType && area) {
      setCurrentStep('contact')
    }
  }

  const handleBack = () => {
    if (currentStep === 'contact') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep(addressType === 'direccion' ? 'map' : 'address')
    } else if (currentStep === 'map') {
      setCurrentStep('address')
    } else if (currentStep === 'address') {
      setCurrentStep('type')
    }
  }

  const onSubmit = async (data: ValuationForm & { marketing?: boolean }) => {
    try {
      await contactService.sendValuation({
        ...data,
        consent: true,
      })
      setSubmitted(true)
      reset()
      setCurrentStep('type')
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black-soft py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="font-serif text-2xl mb-4 text-white">
            Solicitud Enviada Correctamente
          </h2>
          <p className="text-gray-300 mb-6">
            Hemos recibido tu solicitud de valoración. Nos pondremos en contacto contigo pronto.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setCurrentStep('type')
              reset()
            }}
            className="btn-secondary"
          >
            Enviar Otra Solicitud
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-soft py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-white">
            Valoración Gratuita
          </h1>
          <p className="text-gray-300 text-lg">
            Solicita una valoración gratuita y sin compromiso de tu propiedad
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 md:p-8">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Paso 1: Tipo de Valoración */}
            <AnimatePresence mode="wait">
              {currentStep === 'type' && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-2xl mb-6 text-white">
                    ¿Qué necesitas?
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { value: 'vender', label: 'Vender', icon: '🏠' },
                      { value: 'comprar', label: 'Comprar', icon: '🔑' },
                      { value: 'alquilar', label: 'Alquilar', icon: '📋' },
                      { value: 'alquilarlo', label: 'Alquilarlo', icon: '💰' },
                      { value: 'informacion', label: 'Información', icon: 'ℹ️' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                          valuationType === option.value
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.value}
                          {...register('valuationType', { required: true })}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue('valuationType', option.value as any)
                              // Usar requestAnimationFrame para asegurar que el estado se actualice
                              requestAnimationFrame(() => {
                                setTimeout(() => {
                                  if (currentStep === 'type') {
                                    setCurrentStep('address')
                                  }
                                }, 100)
                              })
                            }
                          }}
                        />
                        <div className="text-center">
                          <div className="text-3xl mb-2">{option.icon}</div>
                          <div className="font-medium text-white">
                            {option.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Dirección */}
              {currentStep === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gold hover:text-gold-dark"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="font-serif text-2xl text-white">
                      Ubicación del inmueble
                    </h2>
                  </div>

                  {/* Opción: Dirección o Catastral */}
                  <div className="flex gap-4 mb-6">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        value="direccion"
                        {...register('addressType', { required: true })}
                        className="hidden"
                        onChange={() => setValue('addressType', 'direccion')}
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        addressType === 'direccion'
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                      }`}>
                        Dirección completa
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="radio"
                        value="catastral"
                        {...register('addressType', { required: true })}
                        className="hidden"
                        onChange={() => setValue('addressType', 'catastral')}
                      />
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        addressType === 'catastral'
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                      }`}>
                        Ref. catastral
                      </div>
                    </label>
                  </div>

                  {addressType === 'direccion' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Provincia *
                        </label>
                        <select
                          {...register('province', { required: addressType === 'direccion' })}
                          className="input-field"
                        >
                          <option value="">Seleccione una provincia...</option>
                          {provinces.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>

                      {province && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Localidad *
                          </label>
                          <select
                            {...register('city', { required: addressType === 'direccion' })}
                            className="input-field"
                          >
                            <option value="">Seleccione una localidad...</option>
                            {citiesByProvince[province]?.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </motion.div>
                      )}

                      {city && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Dirección de la vivienda *
                          </label>
                          <AddressAutocomplete
                            value={address || ''}
                            onChange={(value) => setValue('address', value)}
                            onPlaceSelect={handlePlaceSelect}
                            placeholder="Ej: Calle Mayor 15"
                            disabled={!city}
                          />
                        </motion.div>
                      )}

                      {address && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Número
                            </label>
                            <input
                              type="text"
                              {...register('streetNumber')}
                              className="input-field"
                              placeholder="Ej: 15"
                            />
                          </div>
                          {watch('streetNumber') && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                            >
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Código Postal
                              </label>
                              <input
                                type="text"
                                {...register('postalCode')}
                                className="input-field"
                                placeholder="Ej: 28300"
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {address && watch('coordinates') && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (watch('coordinates')) {
                                setCurrentStep('map')
                              }
                            }}
                            className="btn-primary w-full"
                          >
                            Ver en el mapa
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {addressType === 'catastral' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Referencia Catastral *
                      </label>
                      <input
                        type="text"
                        {...register('cadastralRef', { required: addressType === 'catastral' })}
                        className="input-field"
                        placeholder="Ej: 1234567XY1234S0001WX"
                      />
                      {watch('cadastralRef') && (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="btn-primary w-full mt-4"
                        >
                          Continuar
                        </button>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Paso 3: Mapa de Confirmación */}
              {currentStep === 'map' && address && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gold hover:text-gold-dark"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="font-serif text-2xl text-white">
                      Confirmar ubicación
                    </h2>
                  </div>
                  <MapConfirm
                    address={address}
                    coordinates={watch('coordinates')}
                    onConfirm={() => {
                      setAddressConfirmed(true)
                      handleNext()
                    }}
                    onCorrect={handleBack}
                  />
                </motion.div>
              )}

              {/* Paso 4: Detalles de la Propiedad */}
              {currentStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gold hover:text-gold-dark"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="font-serif text-2xl text-white">
                      Características del inmueble
                    </h2>
                  </div>

                  <p className="text-sm text-gray-300 mb-6">
                    Completa todos los datos que conozcas, cuanta más información tengamos, mejor podremos asesorarte.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de inmueble *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: 'piso', label: 'Piso', icon: '🏢' },
                          { value: 'casa', label: 'Casa', icon: '🏠' },
                          { value: 'atico', label: 'Ático', icon: '🏗️' },
                          { value: 'duplex', label: 'Dúplex', icon: '🏘️' },
                          { value: 'estudio', label: 'Estudio', icon: '📐' },
                          { value: 'local', label: 'Local', icon: '🏪' },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                              propertyType === option.value
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                            }`}
                          >
                            <input
                              type="radio"
                              value={option.value}
                              {...register('propertyType', { required: true })}
                              className="hidden"
                            />
                            <div className="text-center">
                              <div className="text-2xl mb-1">{option.icon}</div>
                              <div className="text-sm font-medium text-white">
                                {option.label}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {propertyType && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Superficie (m²) *
                          </label>
                          <input
                            type="number"
                            {...register('area', { required: true, min: 1 })}
                            className="input-field"
                            placeholder="Ej: 87"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Habitaciones
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <label
                                key={num}
                                className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition-all ${
                                  watch('bedrooms') === num
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={num}
                                  {...register('bedrooms')}
                                  className="hidden"
                                />
                                {num}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Baños
                          </label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4].map((num) => (
                              <label
                                key={num}
                                className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition-all ${
                                  watch('bathrooms') === num
                            ? 'border-gold bg-gold/20'
                            : 'border-gray-700 hover:border-gold/50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={num}
                                  {...register('bathrooms')}
                                  className="hidden"
                                />
                                {num}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Estado de conservación
                          </label>
                          <select {...register('state')} className="input-field">
                            <option value="">Seleccione...</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="muy-bueno">Muy Bueno</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="reformar">A Reformar</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Año de construcción
                          </label>
                          <input
                            type="number"
                            {...register('yearBuilt')}
                            className="input-field"
                            placeholder="Ej: 1982"
                            min="1800"
                            max={new Date().getFullYear()}
                          />
                        </div>
                      </motion.div>
                    )}

                    {propertyType && area && (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary w-full"
                      >
                        Continuar
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Paso 5: Datos de Contacto */}
              {currentStep === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-gold hover:text-gold-dark"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="font-serif text-2xl text-white">
                      Datos de Contacto
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'El nombre es obligatorio' })}
                        className="input-field"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'El email es obligatorio',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email inválido',
                          },
                        })}
                        className="input-field"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'El teléfono es obligatorio' })}
                        className="input-field"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <PrivacyInfoDropdown />

                  <div className="space-y-3 mt-6">
                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        {...register('consent', {
                          required: 'Debe aceptar el consentimiento para continuar',
                        })}
                        className="mt-1 w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-300">
                        Consiento que se lleve a cabo el tratamiento de mis datos tal y como se detalla en la{' '}
                        <a href="/politica-privacidad" className="text-gold hover:underline font-medium">
                          Política de privacidad
                        </a>{' '}
                        y el{' '}
                        <a href="/aviso-legal" className="text-gold hover:underline font-medium">
                          Aviso legal
                        </a>
                        . *
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-500 text-xs ml-7">{errors.consent.message}</p>
                    )}

                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        {...register('marketing')}
                        className="mt-1 w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-300">
                        Consiento que se lleve a cabo el tratamiento de mis datos personales para recibir publicidad de su Organización.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full mt-6 text-lg py-4"
                  >
                    Solicitar Valoración Gratuita
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Valuation
