import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  getLocale as paraglideGetLocale,
  setLocale as paraglideSetLocale,
  locales as paraglideLocales,
  isLocale,
} from '@/paraglide/runtime.js'

type Locale = (typeof paraglideLocales)[number]

const STORAGE_KEY = 'PARAGLIDE_LOCALE'

/** Read persisted locale from localStorage, fall back to paraglide runtime */
function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isLocale(stored)) return stored as Locale
  } catch {
    // localStorage not available (SSR / private mode)
  }
  try {
    return paraglideGetLocale()
  } catch {
    return 'en'
  }
}

type LocaleContextType = {
  locale: Locale
  setLocale: (locale: Locale) => Promise<void> | void
  locales: readonly Locale[]
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  // Sync paraglide runtime to the initial locale read from localStorage
  useEffect(() => {
    try {
      paraglideSetLocale(locale, { reload: false })
      if (document.documentElement) {
        document.documentElement.lang = locale
      }
    } catch {
      // ignore
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeLocale = (newLocale: Locale) => {
    // Persist to localStorage so it survives page reload
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // ignore
    }

    // Tell paraglide runtime (sets cookie + globalVariable, reload: false = no page reload)
    const result = paraglideSetLocale(newLocale, { reload: false })

    const apply = () => {
      setLocaleState(newLocale)
      try {
        if (document.documentElement) {
          document.documentElement.lang = newLocale
        }
        window.dispatchEvent(
          new CustomEvent('paraglide:localechange', {
            detail: { locale: newLocale },
          }),
        )
      } catch {
        // ignore
      }
    }

    if (result instanceof Promise) {
      return result.then(apply)
    }
    apply()
    return
  }

  // Keep in sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && isLocale(e.newValue)) {
        const newLocale = e.newValue as Locale
        try {
          paraglideSetLocale(newLocale, { reload: false })
        } catch {
          // ignore
        }
        setLocaleState(newLocale)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
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
