import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import luciaImage from '../../assets/lucia.png'

const FloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black-soft rounded-full w-16 h-16 shadow-2xl flex items-center justify-center hover:shadow-gold/50 transition-all duration-300"
        aria-label="Abrir asistente virtual Lucia"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Panel del Asistente */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black-soft p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-black-soft/20">
                    <img 
                      src={luciaImage} 
                      alt="Lucia" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Lucia</h3>
                    <p className="text-xs opacity-80">Asistente Virtual</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black-soft hover:opacity-70 transition-opacity"
                  aria-label="Cerrar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      ¡Hola! Soy Lucia, tu asistente virtual. Estoy aquí para ayudarte con cualquier pregunta sobre nuestras propiedades y servicios.
                    </p>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={luciaImage} 
                        alt="Lucia" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-gold"
                      />
                    </div>
                    <p className="text-gray-400 text-sm">
                      El asistente virtual estará disponible próximamente
                    </p>
                  </div>
                </div>
              </div>

              {/* Input (deshabilitado por ahora) */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Escribe tu pregunta..."
                    disabled
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    disabled
                    className="bg-gold text-black-soft px-4 py-2 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Enviar mensaje"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FloatingAssistant

