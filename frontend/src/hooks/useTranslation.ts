import { useLanguage } from '../context/LanguageContext'
import translations from '../i18n/translations'

export const useTranslation = () => {
  const { language } = useLanguage()

  const t = (key: string): string | string[] => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Si no se encuentra la traducción, intentar en español como fallback
        let fallbackValue: any = translations['es']
        for (const fk of keys) {
          if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
            fallbackValue = fallbackValue[fk]
          } else {
            return key // Devolver la clave si no se encuentra
          }
        }
        return typeof fallbackValue === 'string' || Array.isArray(fallbackValue) ? fallbackValue : key
      }
    }

    return typeof value === 'string' || Array.isArray(value) ? value : key
  }

  // Función helper que siempre retorna string (para casos donde se necesita garantizar string)
  const tString = (key: string): string => {
    const result = t(key)
    if (Array.isArray(result)) {
      // Si es un array, retornar el primer elemento o la clave
      return result[0] || key
    }
    return result
  }

  return { t, tString, language }
}

