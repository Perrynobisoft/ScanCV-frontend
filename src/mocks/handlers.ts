import { http, HttpResponse } from 'msw'
import { Endpoints } from '@/shared/endpoints'
import { env } from '@/env'
import { cvMockData } from './cv'

const API_URL = env.VITE_APP_API_URL

const mockUsers = [
  {
    id: 1,
    email: 'admin@recruitai.io',
    firstName: 'Nguyen Van',
    lastName: 'Admin',
    provider: 'email',
    socialId: '',
    role: 'Admin',
    status: 'Active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    deletedAt: null,
  },
  {
    id: 2,
    email: 'thi.recruiter@company.com',
    firstName: 'Tran Thi',
    lastName: 'Recruiter',
    provider: 'email',
    socialId: '',
    role: 'Recruiter',
    status: 'Active',
    createdAt: '2026-01-02T00:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deletedAt: null,
  },
  {
    id: 3,
    email: 'van.le@company.com',
    firstName: 'Le Van',
    lastName: 'Recruiter',
    provider: 'email',
    socialId: '',
    role: 'Recruiter',
    status: 'Active',
    createdAt: '2026-01-03T00:00:00Z',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deletedAt: null,
  },
  {
    id: 4,
    email: 'thi.pham@company.com',
    firstName: 'Pham Thi',
    lastName: 'Interviewer',
    provider: 'email',
    socialId: '',
    role: 'Interviewer',
    status: 'Active',
    createdAt: '2026-01-04T00:00:00Z',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deletedAt: null,
  },
  {
    id: 5,
    email: 'van.hoang@company.com',
    firstName: 'Hoang Van',
    lastName: 'Interviewer',
    provider: 'email',
    socialId: '',
    role: 'Interviewer',
    status: 'Inactive',
    createdAt: '2026-01-05T00:00:00Z',
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deletedAt: null,
  },
]

export const handlers = [
  http.get(`${API_URL}/${Endpoints.Users.GET_ALL}`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const start = (page - 1) * limit
    const items = mockUsers.slice(start, start + limit)

    return HttpResponse.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        items,
        meta: {
          page,
          limit,
          total: mockUsers.length,
          totalPages: Math.ceil(mockUsers.length / limit),
        },
      },
    })
  }),

  http.put(`${API_URL}/${Endpoints.Users.UPDATE}`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'User updated successfully',
    })
  }),

  http.delete(`${API_URL}/${Endpoints.Users.DELETE}`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  }),

  http.post(`${API_URL}/${Endpoints.Users.CREATE}`, async () => {
    return HttpResponse.json({
      success: true,
      message: 'User created successfully',
      data: { id: Date.now() },
    })
  }),

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
          role: { id: 1, name: 'Admin' },
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
        role: { id: 1, name: 'Admin' },
      },
    })
  }),

  http.post(`${API_URL}/${Endpoints.Auth.LOGOUT}`, async () => {
    return HttpResponse.json({ result: true })
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
