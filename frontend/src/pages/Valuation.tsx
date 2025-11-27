import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactService } from '../services/contact.service'
import { ValuationForm } from '../types'

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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-6">
                <p className="font-semibold mb-2">Información Protección de Datos:</p>
                <p className="text-gray-700 mb-2">
                  <strong>Responsable:</strong> Anthea Capital Consulting
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Finalidad:</strong> La finalidad de la recogida de sus datos es para poder atender sus solicitudes de información y prestarle nuestros servicios, así como enviarle comunicaciones comerciales sobre nuestros productos y/o servicios.
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Legitimación:</strong> Su consentimiento previo facilitado mediante la casilla correspondiente establecida a tal efecto más abajo o en su caso la ejecución de un contrato del que usted sea parte.
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Destinatarios:</strong> Con carácter general los datos no se cederán a terceros salvo en los casos en que exista una obligación legal.
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Derechos:</strong> Podrá ejercer los derechos de acceso, rectificación, limitación de tratamiento, supresión, portabilidad y oposición al tratamiento de sus datos de carácter personal, así como a la retirada del consentimiento prestado para el tratamiento de los mismos.
                </p>
                <p className="text-gray-700">
                  <strong>Información adicional:</strong> Puede consultar la información detallada sobre Protección de Datos en{' '}
                  <a href="/politica-privacidad" className="text-gold hover:underline">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </div>

              <h2 className="font-serif text-2xl mb-4">Datos de la Propiedad</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    {...register('address', { required: 'La dirección es obligatoria' })}
                    className="input-field"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
              </div>

              <h2 className="font-serif text-2xl mb-4 mt-8">Datos de Contacto</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="space-y-2 mt-6">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent', {
                      required: 'Debe aceptar el consentimiento para continuar',
                    })}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Consiento que se lleve a cabo el tratamiento de mis datos tal y como se detalla en la{' '}
                    <a href="/politica-privacidad" className="text-gold hover:underline">
                      Política de privacidad
                    </a>{' '}
                    y el{' '}
                    <a href="/aviso-legal" className="text-gold hover:underline">
                      Aviso legal
                    </a>
                    . *
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-red-500 text-xs">{errors.consent.message}</p>
                )}

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('marketing')}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    Consiento que se lleve a cabo el tratamiento de mis datos personales para recibir publicidad de su Organización.
                  </span>
                </label>
              </div>

              <button type="submit" className="btn-primary w-full mt-6">
                Solicitar Valoración Gratuita
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Valuation

