import { m } from '@/paraglide/messages'

export const t = (key: string, vars?: Record<string, string | number>) => {
  const message = (m as any)[key]
  if (typeof message !== 'function') {
    return key
  }

  const translated = message(vars ?? {})
  let text = String(translated)
  if (vars) {
    Object.keys(vars).forEach((k) => {
      text = text.replaceAll(`{${k}}`, String(vars[k]))
    })
  }

  return text
}
