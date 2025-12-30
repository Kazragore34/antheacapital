import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ca', name: 'Català', flag: '🏴' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
]

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0]) // Español por defecto
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors border border-gray-700 h-10"
        aria-label="Seleccionar idioma"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span className="text-xl leading-none inline-flex items-center justify-center">{currentLang.flag}</span>
        <span className="hidden md:inline-block text-sm font-medium leading-none">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform leading-none inline-flex items-center justify-center ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1">
              {/* Idiomas principales */}
              <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase border-b border-gray-800">
                Principales
              </div>
              {languages.slice(0, 4).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang)
                    setIsOpen(false)
                    // TODO: Implementar cambio de idioma
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-800 transition-colors ${
                    currentLang.code === lang.code ? 'bg-gray-800 text-gold' : 'text-white'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                  {currentLang.code === lang.code && (
                    <svg className="w-4 h-4 ml-auto text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
              
              {/* Separador */}
              {languages.length > 4 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase border-t border-b border-gray-800 mt-1">
                    Otros
                  </div>
                  {languages.slice(4).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang)
                        setIsOpen(false)
                        // TODO: Implementar cambio de idioma
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-800 transition-colors ${
                        currentLang.code === lang.code ? 'bg-gray-800 text-gold' : 'text-white'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                      {currentLang.code === lang.code && (
                        <svg className="w-4 h-4 ml-auto text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSelector

