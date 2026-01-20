import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { Language } from '../i18n/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const VALID_LANGUAGES: Language[] = ['es', 'en', 'fr', 'ca', 'de', 'it', 'pt']
const LANGUAGE_STORAGE_KEY = 'language'

// Función helper para obtener el idioma del localStorage de forma segura
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es'
  
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language
    if (saved && VALID_LANGUAGES.includes(saved)) {
      return saved
    }
  } catch (error) {
    console.error('Error reading language from localStorage:', error)
  }
  
  return 'es'
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Inicializar el estado desde localStorage solo una vez
  const [language, setLanguageState] = useState<Language>(getStoredLanguage)

  // Función para establecer el idioma de forma consistente
  const setLanguage = useCallback((lang: Language) => {
    // Validar que el idioma sea válido
    if (!VALID_LANGUAGES.includes(lang)) {
      console.warn(`Invalid language: ${lang}. Defaulting to 'es'`)
      lang = 'es'
    }

    // Actualizar el estado
    setLanguageState(lang)
    
    // Guardar en localStorage
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    } catch (error) {
      console.error('Error saving language to localStorage:', error)
    }
    
    // Actualizar el atributo lang del HTML inmediatamente
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [])

  // Sincronizar con localStorage cuando cambia el idioma desde otra pestaña/ventana
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && e.newValue) {
        const newLang = e.newValue as Language
        if (VALID_LANGUAGES.includes(newLang) && newLang !== language) {
          setLanguageState(newLang)
          if (typeof document !== 'undefined') {
            document.documentElement.lang = newLang
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [language])

  // Establecer el idioma inicial en el HTML y asegurar sincronización
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
    
    // Verificar que el localStorage esté sincronizado
    const stored = getStoredLanguage()
    if (stored !== language) {
      // Si hay una discrepancia, usar el valor del localStorage (más reciente)
      setLanguageState(stored)
      if (typeof document !== 'undefined') {
        document.documentElement.lang = stored
      }
    }
  }, [language])

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

