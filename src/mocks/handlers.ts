import { http, HttpResponse } from 'msw'
import { Endpoints } from '@/shared/endpoints'
import { env } from '@/env'
import { cvMockData } from './cv'
import { smartSearchCvMockData } from './smartSearch'

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
  http.get(`${API_URL}/${Endpoints.Users.GET}`, ({ params }) => {
    const id = Number(params.id)
    const user = mockUsers.find((u) => u.id === id) ?? mockUsers[0]
    return HttpResponse.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.status,
          lastActive: user.updatedAt,
        },
      },
    })
  }),

  http.get(`http://localhost/${Endpoints.Users.GET}`, ({ params }) => {
    const id = Number(params.id)
    const user = mockUsers.find((u) => u.id === id) ?? mockUsers[0]
    return HttpResponse.json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user: {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: user.status,
          lastActive: user.updatedAt,
        },
      },
    })
  }),

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

  http.post(`${API_URL}/${Endpoints.Auth.LOGIN}`, async ({ request }) => {
    const body = (await request.json()) as { email?: string }
    const email = String(body?.email ?? '')
      .trim()
      .toLowerCase()

    // Tìm user theo email, fallback về admin nếu không khớp
    const matched = mockUsers.find((u) => u.email.toLowerCase() === email)
    const loginUser = matched ?? mockUsers[0]

    return HttpResponse.json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        accessToken: 'mock-access-token-jwt',
        accessTokenExpiresAt: new Date(
          Date.now() + 15 * 60 * 1000,
        ).toISOString(), // 15 min
        // refreshToken KHÔNG có trong body — backend set qua Set-Cookie HttpOnly
        user: {
          id: loginUser.id,
          email: loginUser.email,
          fullName: `${loginUser.firstName} ${loginUser.lastName}`,
          role: loginUser.role,
          status: loginUser.status,
          lastActive: loginUser.updatedAt,
        },
      },
    })
  }),

  http.get(`${API_URL}/${Endpoints.Auth.ME}`, async () => {
    return HttpResponse.json({
      data: {
        id: 1,
        email: 'admin@recruitai.io',
        fullName: 'Nguyen Van Admin',
        role: 'Admin',
        status: 'Active',
        lastActive: new Date().toISOString(),
      },
      success: true,
    })
  }),

  http.get(`http://localhost/${Endpoints.Auth.ME}`, async () => {
    return HttpResponse.json({
      data: {
        id: 1,
        email: 'admin@recruitai.io',
        fullName: 'Nguyen Van Admin',
        role: 'Admin',
        status: 'Active',
        lastActive: new Date().toISOString(),
      },
      success: true,
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
      ? smartSearchCvMockData.filter((item) =>
          [
            item.full_name,
            item.position,
            item.email,
            item.summary,
            ...(item.skills ?? []),
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedQuery),
            ),
        )
      : [...smartSearchCvMockData]

    // Sort by AI score descending so UI shows best matches first
    filtered.sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0))

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
    const result =
      cvMockData.find((item) => item.cv_infos_id === id) ?? cvMockData[0]

    return HttpResponse.json({
      data: result,
    })
  }),
]
