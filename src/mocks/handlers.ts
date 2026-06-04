import { http, HttpResponse } from 'msw'
import { Endpoints } from '@/shared/endpoints'
import { env } from '@/env'

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
]
