import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContactForm as ContactFormType } from '../../types'
import { contactService } from '../../services/contact.service'
import PrivacyInfoDropdown from './PrivacyInfoDropdown'
import { useTranslation } from '../../hooks/useTranslation'

interface ContactFormProps {
  propertyId?: string
}

const ContactForm = ({ propertyId }: ContactFormProps) => {
  const { t } = useTranslation()
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
      setError(t('contact.form.error'))
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
        <p className="text-green-300 font-semibold">{t('contact.form.success')}</p>
        <p className="text-green-400 text-sm mt-2">{t('contact.form.successSubtext')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('contact.form.name')} *
          </label>
          <input
            type="text"
            {...register('name', { required: t('contact.form.nameRequired') })}
            className="input-field"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {t('contact.form.surname')} *
          </label>
          <input
            type="text"
            {...register('surname', { required: t('contact.form.surnameRequired') })}
            className="input-field"
          />
          {errors.surname && (
            <p className="text-red-400 text-xs mt-1">{errors.surname.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('contact.form.email')} *
        </label>
        <input
          type="email"
          {...register('email', {
            required: t('contact.form.emailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('contact.form.emailInvalid'),
            },
          })}
          className="input-field"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('contact.form.phone')} *
        </label>
        <input
          type="tel"
          {...register('phone', { required: t('contact.form.phoneRequired') })}
          className="input-field"
        />
        {errors.phone && (
          <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {t('contact.form.message')} *
        </label>
        <textarea
          {...register('message', { required: t('contact.form.messageRequired') })}
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
              required: t('contact.form.consentRequired'),
            })}
            className="mt-1"
          />
          <span className="text-sm text-gray-300">
            {t('contact.form.consentText')}{' '}
            <a href="/politica-privacidad" className="text-gold hover:underline">
              {t('contact.form.privacyPolicy')}
            </a>{' '}
            {t('contact.form.consentText2')}{' '}
            <a href="/aviso-legal" className="text-gold hover:underline">
              {t('contact.form.legalNotice')}
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
          <span className="text-sm text-gray-300">
            {t('contact.form.consentMarketing')}
          </span>
        </label>
      </div>

      <button type="submit" className="btn-primary w-full">
        {t('contact.form.send')}
      </button>
    </form>
  )
}

export default ContactForm

