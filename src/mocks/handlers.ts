import { http, HttpResponse } from 'msw'
import { Endpoints } from '@/shared/endpoints'
import { env } from '@/env'
import { cvMockData } from './cv'

// Get API URL from environment variable
const API_URL = env.VITE_APP_API_URL

// MSW v2 can match full URLs or use wildcards
// Match requests to the API URL from env
export const handlers = [
  http.post(`${API_URL}/${Endpoints.Auth.LOGIN}`, async () => {
    return HttpResponse.json({
      data: {
        userId: 1,
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
        isPasswordChangeRequired: false,
        tokenExpires: Date.now() + 1000 * 60 * 60,
        user: {
          id: 1,
          email: 'test@test.com',
          socialId: '1234567890',
          firstName: 'Test',
          lastName: 'User',
          provider: 'email',
          role: {
            id: 2,
            name: 'user',
          },
        },
      },
      success: true,
    })
  }),

  http.get(`${API_URL}/${Endpoints.Auth.ME}`, async () => {
    return HttpResponse.json({
      result: {
        id: 1,
        email: 'test@test.com',
        socialId: '1234567890',
        firstName: 'Test',
        lastName: 'User',
        provider: 'email',
        role: {
          id: 2,
          name: 'user',
        },
      },
    })
  }),

  http.post(`${API_URL}/${Endpoints.Auth.LOGOUT}`, async () => {
    return HttpResponse.json({
      result: true,
    })
  }),

  http.post(`${API_URL}/${Endpoints.Cv.GET_ALL}`, async () => {
    return HttpResponse.json({
      data: {
        items: cvMockData,
        meta: {
          total: cvMockData.length,
          page: 1,
          limit: cvMockData.length,
        },
      },
    })
  }),

  http.post(`${API_URL}/${Endpoints.Cv.SEARCH}`, async ({ request }) => {
    const body = (await request.json()) as { query?: string }
    const { query } = body
    const normalizedQuery = String(query ?? '')
      .trim()
      .toLowerCase()
    const filtered = normalizedQuery
      ? cvMockData.filter(
          (item) =>
            item.full_name.toLowerCase().includes(normalizedQuery) ||
            item.position.toLowerCase().includes(normalizedQuery) ||
            item.email.toLowerCase().includes(normalizedQuery),
        )
      : cvMockData

    return HttpResponse.json({
      data: {
        items: filtered,
        meta: {
          total: filtered.length,
          page: 1,
          limit: filtered.length,
        },
      },
    })
  }),

  http.get(`${API_URL}/${Endpoints.Cv.GET}`, async ({ request }) => {
    const id = Number(new URL(String(request.url)).searchParams.get('id'))
    const result = cvMockData.find((item) => item.id === id) ?? cvMockData[0]

    return HttpResponse.json({
      data: result,
    })
  }),
]
