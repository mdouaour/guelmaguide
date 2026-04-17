'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { type Language, isArabicLanguage } from '@/lib/i18n'

const STORAGE_KEY = 'guelmaguide:language'

interface LanguageContextValue {
  lang: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const isValidStored = stored === 'en' || stored === 'ar'
    const isArabicBrowser = isArabicLanguage(navigator.language)
    const detected: Language = isValidStored ? stored : isArabicBrowser ? 'ar' : 'en'

    if (detected === 'en') return

    // Defer the language switch so the first client render still matches SSR (en/ltr), then apply detected language safely.
    const timeoutId = window.setTimeout(() => {
      setLang(detected)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLanguage: setLang,
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }
  return context
}
