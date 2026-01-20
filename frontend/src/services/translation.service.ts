/**
 * Servicio de traducción automática para contenido de la API de Inmovilla
 * Usa MyMemory Translation API (gratuita) para traducir títulos y descripciones
 */

interface TranslationCache {
  [key: string]: string
}

// Cache de traducciones en memoria (persistente en localStorage)
const translationCache: TranslationCache = {}

// Códigos de idioma soportados
const LANGUAGE_CODES: { [key: string]: string } = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  ca: 'ca',
  de: 'de',
  it: 'it',
  pt: 'pt',
}

/**
 * Obtiene el código de idioma para la API de traducción
 */
function getLanguageCode(lang: string): string {
  return LANGUAGE_CODES[lang] || 'en'
}

/**
 * Genera una clave única para el cache basada en el texto y el idioma destino
 */
function getCacheKey(text: string, targetLang: string): string {
  return `${text.substring(0, 50)}_${targetLang}`
}

/**
 * Traduce un texto usando MyMemory Translation API
 * @param text Texto a traducir
 * @param targetLang Idioma destino (es, en, fr, etc.)
 * @param sourceLang Idioma origen (por defecto 'es')
 * @returns Texto traducido o el texto original si falla
 */
export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'es'
): Promise<string> {
  // Si el idioma destino es español, no traducir
  if (targetLang === 'es' || !text || text.trim().length === 0) {
    return text
  }

  // Verificar cache primero
  const cacheKey = getCacheKey(text, targetLang)
  if (translationCache[cacheKey]) {
    console.log(`[TranslationService] Cache hit para: "${text.substring(0, 30)}..." (${targetLang})`)
    return translationCache[cacheKey]
  }

  // Verificar localStorage cache
  const storedCache = localStorage.getItem('translationCache')
  if (storedCache) {
    try {
      const parsedCache = JSON.parse(storedCache)
      if (parsedCache[cacheKey]) {
        translationCache[cacheKey] = parsedCache[cacheKey]
        console.log(`[TranslationService] Cache localStorage hit para: "${text.substring(0, 30)}..." (${targetLang})`)
        return parsedCache[cacheKey]
      }
    } catch (e) {
      console.warn('Error parsing translation cache:', e)
    }
  }

  try {
    const targetCode = getLanguageCode(targetLang)
    const sourceCode = getLanguageCode(sourceLang)

    console.log(`[TranslationService] Traduciendo "${text.substring(0, 50)}..." de ${sourceCode} a ${targetCode}`)

    // MyMemory Translation API (gratuita, límite de 1000 caracteres por request)
    // Aumentar el límite para descripciones más largas
    const maxLength = 2000 // Aumentado para permitir descripciones más largas
    const textToTranslate = text.length > maxLength ? text.substring(0, maxLength) + '...' : text

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=${sourceCode}|${targetCode}`
    )

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      let translated = data.responseData.translatedText
      
      // Limpiar la traducción (a veces la API devuelve texto con caracteres extra)
      translated = translated.trim()
      
      // Si la traducción es igual al original o está vacía, intentar de nuevo o retornar original
      if (translated === text || translated.length === 0) {
        console.warn(`[TranslationService] La traducción es igual al original o está vacía para: "${text.substring(0, 30)}..."`)
        return text
      }

      console.log(`[TranslationService] ✅ Traducido: "${text.substring(0, 30)}..." -> "${translated.substring(0, 30)}..."`)

      // Guardar en cache
      translationCache[cacheKey] = translated

      // Guardar en localStorage (limitar tamaño del cache)
      try {
        const storedCache = localStorage.getItem('translationCache')
        const parsedCache = storedCache ? JSON.parse(storedCache) : {}
        parsedCache[cacheKey] = translated

        // Limitar cache a 1000 entradas
        const keys = Object.keys(parsedCache)
        if (keys.length > 1000) {
          // Eliminar las entradas más antiguas (simplificado: eliminar las primeras)
          const keysToRemove = keys.slice(0, keys.length - 1000)
          keysToRemove.forEach(key => delete parsedCache[key])
        }

        localStorage.setItem('translationCache', JSON.stringify(parsedCache))
      } catch (e) {
        console.warn('Error saving translation cache:', e)
      }

      return translated
    } else {
      console.warn('[TranslationService] Translation API returned unexpected format:', data)
      return text
    }
  } catch (error) {
    console.error('[TranslationService] Error translating text:', error)
    // En caso de error, retornar el texto original
    return text
  }
}

/**
 * Traduce múltiples textos en paralelo
 */
export async function translateMultiple(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'es'
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(text => translateText(text, targetLang, sourceLang))
  )
  return translations
}

/**
 * Limpia el cache de traducciones
 */
export function clearTranslationCache(): void {
  Object.keys(translationCache).forEach(key => delete translationCache[key])
  localStorage.removeItem('translationCache')
}
