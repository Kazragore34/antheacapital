import { useState } from 'react'
import { useCookies } from '../../context/CookieContext'
import { motion, AnimatePresence } from 'framer-motion'

interface CookieSettingsProps {
  onClose: () => void
}

const CookieSettings = ({ onClose }: CookieSettingsProps) => {
  const { preferences, setConsent } = useCookies()
  const [localPrefs, setLocalPrefs] = useState(preferences)

  const handleSave = () => {
    setConsent(localPrefs)
    onClose()
  }

  const togglePreference = (key: keyof typeof localPrefs) => {
    if (key === 'necessary') return // No se puede desactivar
    setLocalPrefs({ ...localPrefs, [key]: !localPrefs[key] })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-black-soft">Configuración de Cookies</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black-soft transition-colors"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Cookies Necesarias */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Cookies Necesarias - Cookies Técnicas</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      SIEMPRE ACTIVAS. Estas cookies son necesarias para que el sitio web funcione y no se pueden desactivar.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gold font-semibold">SIEMPRE ACTIVAS</span>
                  </div>
                </div>
              </div>

              {/* Cookies de Rendimiento */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Cookies de Rendimiento</h3>
                    <p className="text-sm text-gray-600">
                      Permiten analizar el uso del sitio web para mejorar su rendimiento.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={localPrefs.performance}
                      onChange={() => togglePreference('performance')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              {/* Cookies de Funcionalidad */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Cookies de Funcionalidad</h3>
                    <p className="text-sm text-gray-600">
                      Permiten recordar tus preferencias y personalizar tu experiencia.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={localPrefs.functionality}
                      onChange={() => togglePreference('functionality')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              {/* Cookies Dirigidas */}
              <div className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Cookies Dirigidas</h3>
                    <p className="text-sm text-gray-600">
                      Utilizadas para mostrar publicidad relevante según tus intereses.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={localPrefs.targeting}
                      onChange={() => togglePreference('targeting')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>

              {/* Cookies de Redes Sociales */}
              <div className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Cookies de Redes Sociales</h3>
                    <p className="text-sm text-gray-600">
                      Permiten compartir contenido en redes sociales.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={localPrefs.social}
                      onChange={() => togglePreference('social')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gold text-white rounded-lg font-medium hover:bg-gold-dark transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CookieSettings

