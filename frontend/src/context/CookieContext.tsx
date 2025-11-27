import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CookiePreferences } from '../types'

interface CookieContextType {
  preferences: CookiePreferences
  consentGiven: boolean
  setConsent: (preferences: CookiePreferences) => void
  acceptAll: () => void
  rejectAll: () => void
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Siempre activas
  performance: false,
  functionality: false,
  targeting: false,
  social: false,
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

export const useCookies = () => {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error('useCookies must be used within CookieProvider')
  }
  return context
}

export const CookieProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookiePreferences')
    const consent = localStorage.getItem('cookieConsent')
    if (stored) {
      setPreferences(JSON.parse(stored))
    }
    if (consent === 'true') {
      setConsentGiven(true)
    }
  }, [])

  const setConsent = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences)
    setConsentGiven(true)
    localStorage.setItem('cookiePreferences', JSON.stringify(newPreferences))
    localStorage.setItem('cookieConsent', 'true')
  }

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      performance: true,
      functionality: true,
      targeting: true,
      social: true,
    }
    setConsent(allAccepted)
  }

  const rejectAll = () => {
    setConsent(defaultPreferences)
  }

  return (
    <CookieContext.Provider
      value={{
        preferences,
        consentGiven,
        setConsent,
        acceptAll,
        rejectAll,
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

