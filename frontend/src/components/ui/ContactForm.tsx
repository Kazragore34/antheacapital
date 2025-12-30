import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContactForm as ContactFormType } from '../../types'
import { contactService } from '../../services/contact.service'
import PrivacyInfoDropdown from './PrivacyInfoDropdown'

interface ContactFormProps {
  propertyId?: string
}

const ContactForm = ({ propertyId }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
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
      <PrivacyInfoDropdown />

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

