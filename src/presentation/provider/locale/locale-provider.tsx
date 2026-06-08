import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocale as paraglideGetLocale,
  setLocale as paraglideSetLocale,
  locales as paraglideLocales,
} from '@/paraglide/runtime.js'

type Locale = (typeof paraglideLocales)[number]

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => Promise<void> | void
  locales: readonly Locale[]
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      return paraglideGetLocale()
    } catch {
      return 'en'
    }
  })

  const changeLocale = (newLocale: Locale) => {
    const result = paraglideSetLocale(newLocale, { reload: false })
    if (result instanceof Promise) {
      return result.then(() => setLocaleState(newLocale))
    }
    setLocaleState(newLocale)
    try {
      // update document lang for a11y and external libs
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = newLocale
      }
      // notify other listeners in the app (components not using the provider)
      window.dispatchEvent(
        new CustomEvent('paraglide:localechange', {
          detail: { locale: newLocale },
        }),
      )
      // also write to localStorage to allow cross-tab updates
      try {
        localStorage.setItem('PARAGLIDE_LOCALE', newLocale)
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
    return
  }

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'PARAGLIDE_LOCALE') {
        try {
          setLocaleState(paraglideGetLocale())
        } catch {
          // ignore
        }
      }
    }
    const onGlobal = () => {
      try {
        setLocaleState(paraglideGetLocale())
      } catch {
        // ignore
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('paraglide:localechange', onGlobal)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('paraglide:localechange', onGlobal)
    }
  }, [])

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale: changeLocale, locales: paraglideLocales }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return ctx
}

export default LocaleProvider
