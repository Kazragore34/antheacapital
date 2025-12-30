import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ContactForm as ContactFormType } from '../../types'
import { contactService } from '../../services/contact.service'

interface ContactFormProps {
  propertyId?: string
}

const ContactForm = ({ propertyId }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormType & { marketing?: boolean }>()

  const onSubmit = async (data: ContactFormType & { marketing?: boolean }) => {
    try {
      await contactService.sendContact({
        ...data,
        propertyId,
        consent: true,
      })
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError('Error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-semibold">¡Mensaje enviado correctamente!</p>
        <p className="text-green-600 text-sm mt-2">Te contactaremos pronto.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje *
        </label>
        <textarea
          {...register('message', { required: 'El mensaje es obligatorio' })}
          rows={4}
          className="input-field"
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Desplegable de Información de Protección de Datos */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
          className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-3 flex items-center justify-between transition-colors duration-200"
        >
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Información de Protección de Datos
          </span>
          <motion.svg
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: showPrivacyInfo ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>
        
        <AnimatePresence>
          {showPrivacyInfo && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-blue-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4 text-sm">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Responsable:</strong> Anthea Capital Consulting
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Finalidad:</strong> Atender sus solicitudes de información y prestarle nuestros servicios, así como enviarle comunicaciones comerciales sobre nuestros productos y/o servicios.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Legitimación:</strong> Su consentimiento previo facilitado mediante la casilla correspondiente.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Destinatarios:</strong> Con carácter general los datos no se cederán a terceros salvo en los casos en que exista una obligación legal.
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>Derechos:</strong> Podrá ejercer los derechos de acceso, rectificación, limitación de tratamiento, supresión, portabilidad y oposición al tratamiento de sus datos de carácter personal.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Información adicional:</strong> Puede consultar la información detallada sobre Protección de Datos en{' '}
                  <a href="/politica-privacidad" className="text-gold hover:underline font-medium">
                    Política de Privacidad
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
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

      <button type="submit" className="btn-primary w-full">
        Enviar Mensaje
      </button>
    </form>
  )
}

export default ContactForm

