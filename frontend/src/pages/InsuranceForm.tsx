import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { validateDocument } from '../utils/nifValidator'
import AddressAutocomplete from '../components/valuation/AddressAutocomplete'
import PrivacyInfoDropdown from '../components/ui/PrivacyInfoDropdown'

// Componente para mostrar el mapa
const MapDisplay = ({ coordinates }: { coordinates: [number, number] }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: coordinates[0], lng: coordinates[1] },
      zoom: 17,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    mapInstanceRef.current = map

    const marker = new window.google.maps.Marker({
      position: { lat: coordinates[0], lng: coordinates[1] },
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    })

    markerRef.current = marker

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
      }
    }
  }, [coordinates])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-64 rounded-lg overflow-hidden border border-gray-700"
    >
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '256px' }} />
    </motion.div>
  )
}

interface InsuranceFormData {
  // Paso 1: Datos de contacto
  name: string
  surname: string
  phone: string
  email: string
  consent: boolean
  marketing?: boolean
  
  // Paso 2: CIF/NIF y fecha
  cifNif: string
  birthDate: string
  
  // Paso 3: Actividad
  activity: string
  
  // Paso 4: Cuestionario (solo para Vida)
  deathCapital?: number
  accidentDeath?: boolean
  trafficAccidentDeath?: boolean
  permanentDisability?: boolean
  accidentDisability?: boolean
  trafficAccidentDisability?: boolean
  totalPermanentDisability?: boolean
  effectiveDate?: string
  
  // Paso 5: Dirección
  address?: string
  streetNumber?: string
  postalCode?: string
  floor?: string
  staircase?: string
  door?: string
  coordinates?: [number, number]
}

const InsuranceForm = () => {
  const { tipo } = useParams<{ tipo: string }>()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [cifValidating, setCifValidating] = useState(false)
  const [cifValid, setCifValid] = useState<boolean | null>(null)
  const [activitySuggestions, setActivitySuggestions] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<InsuranceFormData>()

  const cifNif = watch('cifNif')
  const activity = watch('activity')
  const address = watch('address')

  // Validar CIF/NIF cuando cambia
  useEffect(() => {
    if (cifNif && cifNif.length >= 9) {
      setCifValidating(true)
      setTimeout(() => {
        const validation = validateDocument(cifNif)
        setCifValid(validation.isValid)
        setCifValidating(false)
        if (validation.isValid) {
          trigger('cifNif')
        }
      }, 500)
    } else {
      setCifValid(null)
    }
  }, [cifNif, trigger])

  // Generar sugerencias de actividad basadas en input
  useEffect(() => {
    if (activity && activity.length > 3) {
      const suggestions = generateActivitySuggestions(activity)
      setActivitySuggestions(suggestions)
    } else {
      setActivitySuggestions([])
    }
  }, [activity])

  const generateActivitySuggestions = (input: string): string[] => {
    const lowerInput = input.toLowerCase()
    const allActivities = [
      'Programador aplicaciones informáticas',
      'Informático',
      'Ingeniero informático',
      'Analista de aplicaciones',
      'Técnico mantenimiento y reparación informático',
      'Arquitecto',
      'Ingeniero de construcción',
      'Abogado',
      'Médico',
      'Enfermero',
      'Contador',
      'Asesor fiscal',
      'Diseñador gráfico',
      'Marketing digital',
      'Consultor',
      'Comercial',
      'Veterinario',
      'Farmacéutico',
      'Fisioterapeuta',
      'Psicólogo',
    ]

    return allActivities
      .filter(act => act.toLowerCase().includes(lowerInput))
      .slice(0, 6)
  }

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.address_components) {
      place.address_components.forEach((component) => {
        if (component.types.includes('postal_code')) {
          setValue('postalCode', component.long_name)
        }
        if (component.types.includes('street_number')) {
          setValue('streetNumber', component.long_name)
        }
      })
    }

    if (place.geometry?.location) {
      setValue('coordinates', [
        place.geometry.location.lat(),
        place.geometry.location.lng()
      ])
    }
  }

  const onSubmit = async (data: InsuranceFormData) => {
    setIsLoading(true)
    
    // Simular envío con barra de progreso
    // TODO: Enviar datos al backend
    console.log('Datos del seguro:', data)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsLoading(false)
    setSubmitted(true)
  }

  const totalSteps = tipo === 'vida' ? 5 : 4
  const progress = (currentStep / totalSteps) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black-soft py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-12 text-center max-w-2xl mx-4 w-full"
        >
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Procesando tu solicitud...</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black-soft py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-12 text-center max-w-2xl mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-8xl mb-6"
          >
            ✅
          </motion.div>
          <h2 className="font-serif text-3xl md:text-4xl mb-4 text-white">
            ¡Gracias por confiar en nosotros!
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            En breve nuestro equipo se pondrá en contacto contigo para darte la información que necesites.
          </p>
          <Link
            to="/seguros"
            className="btn-primary inline-block"
          >
            Volver a Seguros
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black-soft py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-white capitalize">
            {tipo?.replace('-', ' ') || 'Seguro'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
            <span className={currentStep >= 1 ? 'text-gold' : ''}>Datos</span>
            <span>→</span>
            <span className={currentStep >= 2 ? 'text-gold' : ''}>Precio</span>
            <span>→</span>
            <span className={currentStep >= 3 ? 'text-gold' : ''}>Contratación</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-gold-dark via-gold to-gold-light h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Paso 1: Datos de Contacto */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gold text-black-soft rounded-full flex items-center justify-center font-bold text-xl">
                      1
                    </div>
                    <h2 className="font-serif text-2xl text-white">Datos de Contacto</h2>
                  </div>

                  <p className="text-gray-300 mb-6">
                    ¡Hagamos un seguro a tu medida! Este formulario nos permite crear un seguro a medida para que contrates solo lo que realmente necesitas.
                  </p>

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
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        {...register('surname', { required: 'Los apellidos son obligatorios' })}
                        className="input-field"
                      />
                      {errors.surname && (
                        <p className="text-red-500 text-xs mt-1">{errors.surname.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Teléfono *
                      </label>
                      <div className="flex gap-2">
                        <select className="input-field w-24">
                          <option value="+34">+34</option>
                        </select>
                        <input
                          type="tel"
                          {...register('phone', { required: 'El teléfono es obligatorio' })}
                          className="input-field flex-1"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Correo electrónico *
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
                  </div>

                  <PrivacyInfoDropdown />

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        {...register('consent', {
                          required: 'Debe aceptar el consentimiento para continuar',
                        })}
                        className="mt-1 w-4 h-4 text-gold border-gray-600 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-300">
                        Acepto{' '}
                        <a href="/politica-privacidad" className="text-gold hover:underline">
                          política de privacidad
                        </a>
                        ,{' '}
                        <a href="/politica-cookies" className="text-gold hover:underline">
                          política de Cookies
                        </a>
                        ,{' '}
                        <a href="/aviso-legal" className="text-gold hover:underline">
                          términos y condiciones
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
                        className="mt-1 w-4 h-4 text-gold border-gray-600 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-300">
                        Acepto recibir comunicaciones comerciales y promocionales por parte de la empresa, incluyendo ofertas, descuentos y novedades sobre sus productos y servicios. (Opcional)
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Paso 2: CIF/NIF y Fecha de Nacimiento */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-gold hover:text-gold-light"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gold text-black-soft rounded-full flex items-center justify-center font-bold text-xl">
                      2
                    </div>
                    <h2 className="font-serif text-2xl text-white">
                      ¡Hola {watch('name')}! Cuéntanos sobre tu negocio
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Indica el CIF o NIF *
                    </label>
                    <p className="text-sm text-gray-400 mb-2">
                      Gracias a la información que nos da tu CIF, nos ahorramos pedirte varios datos adicionales.
                    </p>
                    <a href="#" className="text-gold hover:underline text-sm">
                      ¡Si no lo sabes, clica aquí!
                    </a>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        {...register('cifNif', {
                          required: 'El CIF o NIF es obligatorio',
                          validate: (value) => {
                            if (value && value.length >= 9) {
                              const validation = validateDocument(value)
                              return validation.isValid || 'CIF/NIF inválido'
                            }
                            return true
                          },
                        })}
                        className="input-field pr-10"
                        placeholder="Ej: Z0939017R"
                      />
                      {cifValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {cifValid === true && !cifValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {cifValid === false && !cifValidating && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {cifValidating && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        Cargando tus datos...
                      </div>
                    )}
                    {errors.cifNif && (
                      <p className="text-red-500 text-xs mt-1">{errors.cifNif.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha de nacimiento *
                    </label>
                    <input
                      type="date"
                      {...register('birthDate', { required: 'La fecha de nacimiento es obligatoria' })}
                      className="input-field"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.birthDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Actividad */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-gold hover:text-gold-light"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gold text-black-soft rounded-full flex items-center justify-center font-bold text-xl">
                      3
                    </div>
                    <h2 className="font-serif text-2xl text-white">Actividad</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Describe la actividad que realizas. *
                    </label>
                    <input
                      type="text"
                      {...register('activity', { required: 'La actividad es obligatoria' })}
                      className="input-field"
                      placeholder="Ejemplo: Desarrollador de..."
                    />
                    {errors.activity && (
                      <p className="text-red-500 text-xs mt-1">{errors.activity.message}</p>
                    )}

                    {activitySuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-purple-500">◆</span>
                          <span className="text-sm font-semibold text-gray-300">Sugerencias IA</span>
                        </div>
                        <div className="space-y-2">
                          {activitySuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setValue('activity', suggestion)
                                setActivitySuggestions([])
                              }}
                              className="w-full text-left p-3 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors flex items-center justify-between text-gray-300"
                            >
                              <span>{suggestion}</span>
                              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="mt-3 text-sm text-gray-400 hover:text-gold transition-colors"
                        >
                          No encuentro mi actividad
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Paso 4: Cuestionario (solo para Vida) */}
              {currentStep === 4 && tipo === 'vida' && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-gold hover:text-gold-light"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gold text-black-soft rounded-full flex items-center justify-center font-bold text-xl">
                      4
                    </div>
                    <h2 className="font-serif text-2xl text-white">Cuestionario</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Capital Fallecimiento
                    </label>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-gray-400 text-sm">50.000 €</span>
                      <input
                        type="range"
                        min="50000"
                        max="200000"
                        step="5000"
                        defaultValue="100000"
                        {...register('deathCapital', { valueAsNumber: true })}
                        className="flex-1"
                      />
                      <span className="text-gray-400 text-sm">200.000 €</span>
                    </div>
                    <div className="text-center">
                      <span className="px-4 py-2 bg-gold/20 text-gold rounded-lg font-semibold">
                        {watch('deathCapital')?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) || '100.000 €'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'accidentDeath', label: '¿Quieres contratar la garantía de fallecimiento por accidente?' },
                      { key: 'trafficAccidentDeath', label: '¿Quieres contratar la garantía de fallecimiento por accidente de circulación?' },
                      { key: 'permanentDisability', label: '¿Quieres contratar la garantía de incapacidad permanente y absoluta?' },
                      { key: 'accidentDisability', label: '¿Quieres contratar la garantía de incapacidad por accidente?' },
                      { key: 'trafficAccidentDisability', label: '¿Quieres contratar la garantía de incapacidad por accidente de circulación?' },
                      { key: 'totalPermanentDisability', label: '¿Quieres contratar la garantía de Invalidez Permanente Total para la profesión habitual?' },
                    ].map((question) => (
                      <div key={question.key}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          {question.label}
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="no"
                              {...register(question.key as keyof InsuranceFormData)}
                              className="w-4 h-4 text-gold border-gray-600"
                            />
                            <span className="text-gray-300">No</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              value="si"
                              {...register(question.key as keyof InsuranceFormData)}
                              className="w-4 h-4 text-gold border-gray-600"
                            />
                            <span className="text-gray-300">Sí</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha de efecto *
                    </label>
                    <input
                      type="date"
                      {...register('effectiveDate', { required: 'La fecha de efecto es obligatoria' })}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.effectiveDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.effectiveDate.message}</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Paso 4/5: Dirección */}
              {((currentStep === 4 && tipo !== 'vida') || (currentStep === 5 && tipo === 'vida')) && (
                <motion.div
                  key="step-address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(tipo === 'vida' ? 4 : 3)}
                      className="text-gold hover:text-gold-light"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gold text-black-soft rounded-full flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <h2 className="font-serif text-2xl text-white">Últimos detalles</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Dirección de la empresa *
                    </label>
                    <AddressAutocomplete
                      value={address || ''}
                      onChange={(val) => setValue('address', val)}
                      onPlaceSelect={handlePlaceSelect}
                      placeholder="Busca una dirección..."
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {address && watch('coordinates') && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-64 rounded-lg overflow-hidden border border-gray-700"
                    >
                      <div
                        id="map"
                        className="w-full h-full"
                        style={{ minHeight: '256px' }}
                      />
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Número
                      </label>
                      <input
                        type="text"
                        {...register('streetNumber')}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Código postal *
                      </label>
                      <input
                        type="text"
                        {...register('postalCode', { required: 'El código postal es obligatorio' })}
                        className="input-field"
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Piso (Opcional)
                      </label>
                      <input
                        type="text"
                        {...register('floor')}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Escalera (Opcional)
                      </label>
                      <input
                        type="text"
                        {...register('staircase')}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Puerta (Opcional)
                      </label>
                      <input
                        type="text"
                        {...register('door')}
                        className="input-field"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary"
                >
                  ← Atrás
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={async () => {
                    const isValid = await trigger()
                    if (isValid) {
                      setCurrentStep(currentStep + 1)
                    }
                  }}
                  className="btn-primary ml-auto"
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary ml-auto"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-black-soft border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </span>
                  ) : (
                    'Solicitar información'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InsuranceForm

