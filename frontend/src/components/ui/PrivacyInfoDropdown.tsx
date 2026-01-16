import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../../hooks/useTranslation'

const PrivacyInfoDropdown = () => {
  const { t } = useTranslation()
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
        className="w-full bg-gray-800 hover:bg-gray-700 px-4 py-3 flex items-center justify-between transition-colors duration-200"
      >
          <span className="text-sm font-semibold text-gray-300 flex items-center">
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
          {t('contact.privacy.title')}
        </span>
        <motion.svg
          className="w-5 h-5 text-gray-400"
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
            <div className="bg-gray-800 border-t border-gray-700 px-4 py-4 text-sm">
              <p className="text-gray-300 mb-2">
                <strong>{t('contact.privacy.responsible')}:</strong> {t('contact.privacy.responsibleName')}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>{t('contact.privacy.purpose')}:</strong> {t('contact.privacy.purposeText')}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>{t('contact.privacy.legitimacy')}:</strong> {t('contact.privacy.legitimacyText')}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>{t('contact.privacy.recipients')}:</strong> {t('contact.privacy.recipientsText')}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>{t('contact.privacy.rights')}:</strong> {t('contact.privacy.rightsText')}
              </p>
              <p className="text-gray-300">
                <strong>{t('contact.privacy.additionalInfo')}:</strong> {t('contact.privacy.additionalInfoText')}{' '}
                <a href="/politica-privacidad" className="text-gold hover:underline font-medium">
                  {t('contact.form.privacyPolicy')}
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PrivacyInfoDropdown

