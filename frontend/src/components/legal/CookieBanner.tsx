import { useState, useEffect } from 'react'
import { useCookies } from '../../context/CookieContext'
import { motion, AnimatePresence } from 'framer-motion'
import CookieSettings from './CookieSettings'

const CookieBanner = () => {
  const { consentGiven, acceptAll, rejectAll } = useCookies()
  const [showSettings, setShowSettings] = useState(false)

  if (consentGiven) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gold z-50 p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-serif text-xl mb-2 text-black-soft">
                  Uso de Cookies
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Este sitio web utiliza cookies propias y/o de terceros para conocer los hábitos de navegación del usuario, 
                  realizar estadísticas y ofrecer contenidos adaptados a sus preferencias. Puede aceptar todas las cookies, 
                  rechazarlas o personalizar cuáles desea deshabilitar.
                </p>
                <p className="text-xs text-gray-500">
                  Para más información, consulta nuestra{' '}
                  <a href="/politica-cookies" className="text-gold hover:underline">
                    Política de Cookies
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={rejectAll}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Rechazar Cookies
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-2 border-2 border-gold text-gold rounded-lg font-medium hover:bg-gold hover:text-white transition-colors"
                >
                  Configurar
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
                >
                  Aceptar Cookies
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {showSettings && (
        <CookieSettings onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}

export default CookieBanner

