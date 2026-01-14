import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language } from '../i18n/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Obtener idioma del localStorage o usar español por defecto
    const saved = localStorage.getItem('language') as Language
    return saved && ['es', 'en', 'fr', 'ca', 'de', 'it', 'pt'].includes(saved) ? saved : 'es'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = lang
  }

  useEffect(() => {
    // Establecer el idioma inicial en el HTML
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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

