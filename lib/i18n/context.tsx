"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { translations, type Locale, type TranslationKey } from "./translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string>) => string
  availableLocales: Locale[]
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = "infoflow-locale"
const DEFAULT_LOCALE: Locale = "pt-BR"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && translations[stored]) {
      setLocaleState(stored)
    } else {
      // Detectar idioma do navegador
      const browserLang = navigator.language
      if (browserLang.startsWith("es")) {
        setLocaleState("es")
      } else if (browserLang.startsWith("en")) {
        setLocaleState("en")
      }
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback((key: TranslationKey, params?: Record<string, string>): string => {
    let text = translations[locale][key] || translations[DEFAULT_LOCALE][key] || key
    
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{{${paramKey}}}`, value)
      })
    }
    
    return text
  }, [locale])

  const availableLocales: Locale[] = Object.keys(translations) as Locale[]

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, availableLocales }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

// Componente para seleção de idioma
export function LocaleSelector() {
  const { locale, setLocale, availableLocales } = useI18n()

  const localeNames: Record<Locale, string> = {
    "pt-BR": "Português",
    "en": "English",
    "es": "Español"
  }

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="bg-transparent border rounded px-2 py-1 text-sm"
      aria-label="Selecionar idioma"
    >
      {availableLocales.map(loc => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  )
}
