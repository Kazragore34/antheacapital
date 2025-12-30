import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PrivacyInfoDropdown = () => {
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
          Información de Protección de Datos
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
                <strong>Responsable:</strong> Anthea Capital Consulting
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Finalidad:</strong> La finalidad de la recogida de sus datos es para poder atender sus solicitudes de información y prestarle nuestros servicios, así como enviarle comunicaciones comerciales sobre nuestros productos y/o servicios.
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Legitimación:</strong> Su consentimiento previo facilitado mediante la casilla correspondiente establecida a tal efecto más abajo o en su caso la ejecución de un contrato del que usted sea parte.
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Destinatarios:</strong> Con carácter general los datos no se cederán a terceros salvo en los casos en que exista una obligación legal.
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Derechos:</strong> Podrá ejercer los derechos de acceso, rectificación, limitación de tratamiento, supresión, portabilidad y oposición al tratamiento de sus datos de carácter personal, así como a la retirada del consentimiento prestado para el tratamiento de los mismos.
              </p>
              <p className="text-gray-300">
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
  )
}

export default PrivacyInfoDropdown

