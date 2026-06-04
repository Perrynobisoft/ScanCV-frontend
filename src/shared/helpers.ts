import type { QueryClient } from '@tanstack/react-query'
import { clearAuthStorage } from './auth-storage'

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const handleLogout = (queryClient: QueryClient) => {
  // clear cache react query
  queryClient.clear()
  clearAuthStorage()
}

export const convertListForInputSelect = (
  list: Array<Record<string, unknown>>,
  key: string,
  label: string,
) => {
  if (!list) return []

  return list.map((item) => ({
    ...item,
    label: item[label],
    value: item[key],
  }))
}
