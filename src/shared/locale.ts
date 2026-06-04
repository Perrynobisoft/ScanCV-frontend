import { baseLocale, cookieName, locales } from '@/paraglide/runtime.js'

export const resolvePreferredLocale = () => {
  if (typeof document !== 'undefined') {
    const cookieLocale = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${cookieName}=`))
      ?.split('=')[1]

    if (
      cookieLocale &&
      locales.includes(cookieLocale as (typeof locales)[number])
    ) {
      return cookieLocale as (typeof locales)[number]
    }
  }

  if (typeof navigator !== 'undefined') {
    const browserLocales = navigator.languages?.length
      ? navigator.languages
      : [navigator.language]

    for (const locale of browserLocales) {
      const normalizedLocale = locale.toLowerCase()
      const exactMatch = locales.find(
        (supportedLocale) => supportedLocale.toLowerCase() === normalizedLocale,
      )

      if (exactMatch) {
        return exactMatch
      }

      const languageMatch = locales.find(
        (supportedLocale) =>
          supportedLocale.toLowerCase() === normalizedLocale.split('-')[0],
      )

      if (languageMatch) {
        return languageMatch
      }
    }
  }

  return baseLocale
}
