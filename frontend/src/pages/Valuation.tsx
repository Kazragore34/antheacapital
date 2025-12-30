import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { contactService } from '../services/contact.service'
import { ValuationForm } from '../types'
import PrivacyInfoDropdown from '../components/ui/PrivacyInfoDropdown'

const Valuation = () => {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ValuationForm & { marketing?: boolean }>()

  const onSubmit = async (data: ValuationForm & { marketing?: boolean }) => {
    try {
      await contactService.sendValuation({
        ...data,
        consent: true,
      })
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-black-soft">
            Valoración Gratuita
          </h1>
          <p className="text-gray-600 text-lg">
            Solicita una valoración gratuita y sin compromiso de tu propiedad
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="font-serif text-2xl mb-4 text-black-soft">
              Solicitud Enviada Correctamente
            </h2>
            <p className="text-gray-600 mb-6">
              Hemos recibido tu solicitud de valoración. Nos pondremos en contacto contigo pronto.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-secondary"
            >
              Enviar Otra Solicitud
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="font-serif text-2xl mb-6 text-black-soft dark:text-white">Datos de la Propiedad</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Calle Mayor 15, Aranjuez"
                    {...register('address', { required: 'La dirección es obligatoria' })}
                    className="input-field"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Propiedad *
                  </label>
                  <select
                    {...register('type', { required: 'El tipo es obligatorio' })}
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    <option value="piso">Piso</option>
                    <option value="casa">Casa</option>
                    <option value="atico">Ático</option>
                    <option value="duplex">Dúplex</option>
                    <option value="estudio">Estudio</option>
                    <option value="local">Local Comercial</option>
                    <option value="oficina">Oficina</option>
                    <option value="terreno">Terreno</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Superficie (m²) *
                  </label>
                  <input
                    type="number"
                    {...register('area', { required: 'La superficie es obligatoria', min: 1 })}
                    className="input-field"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Habitaciones *
                  </label>
                  <select
                    {...register('bedrooms', { required: 'Las habitaciones son obligatorias' })}
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                  {errors.bedrooms && (
                    <p className="text-red-500 text-xs mt-1">{errors.bedrooms.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado *
                  </label>
                  <select
                    {...register('state', { required: 'El estado es obligatorio' })}
                    className="input-field"
                  >
                    <option value="">Seleccione...</option>
                    <option value="nuevo">Nuevo</option>
                    <option value="muy-bueno">Muy Bueno</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="reformar">A Reformar</option>
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h2 className="font-serif text-2xl mb-6 text-black-soft dark:text-white">Datos de Contacto</h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              </motion.div>

              {/* Información de Protección de Datos - Desplegable al final */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <PrivacyInfoDropdown />
              </motion.div>

              {/* Checkboxes de consentimiento */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 mt-6"
              >
                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    {...register('consent', {
                      required: 'Debe aceptar el consentimiento para continuar',
                    })}
                    className="mt-1 w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
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

                <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <input
                    type="checkbox"
                    {...register('marketing')}
                    className="mt-1 w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Consiento que se lleve a cabo el tratamiento de mis datos personales para recibir publicidad de su Organización.
                  </span>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-6 text-lg py-4"
              >
                Solicitar Valoración Gratuita
              </motion.button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Valuation

