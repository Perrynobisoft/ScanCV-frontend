import { http, HttpResponse } from 'msw'
import { Endpoints } from '@/shared/endpoints'
import { env } from '@/env'
import { cvMockData, talentPoolMockData } from './cv'
import { smartSearchCvMockData } from './smartSearch'

const API_URL = env.VITE_APP_API_URL

const mockUsers = [
  {
    id: 10,
    email: 'admin@recruitai.io',
    fullName: 'Nguyen Van Admin',
    role: 'Admin',
    status: 'Active',
    lastActive: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    email: 'thi.recruiter@company.com',
    fullName: 'Tran Thi Recruiter',
    role: 'Interviewer',
    status: 'Active',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 1,
    email: 'admin@recruitai.io',
    fullName: 'Nguyen Van Admin',
    role: 'Admin',
    status: 'Active',
    lastActive: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    email: 'thi.recruiter@company.com',
    fullName: 'Tran Thi Recruiter',
    role: 'Recruiter',
    status: 'Active',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    email: 'thi.recruiter@company.com',
    fullName: 'Tran Thi Recruiter',
    role: 'Recruiter',
    status: 'Active',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    email: 'van.le@company.com',
    fullName: 'Le Van Recruiter',
    role: 'Recruiter',
    status: 'Active',
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    email: 'thi.pham@company.com',
    fullName: 'Pham Thi Interviewer',
    role: 'Interviewer',
    status: 'Active',
    lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    email: 'van.hoang@company.com',
    fullName: 'Hoang Van Interviewer',
    role: 'Interviewer',
    status: 'Inactive',
    lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          lastActive: user.lastActive,
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
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
          lastActive: user.lastActive,
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
          fullName: loginUser.fullName,
          role: loginUser.role,
          status: loginUser.status,
          lastActive: loginUser.lastActive,
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

  // In-memory store so mark/unmark changes persist within a session
  // We start with a copy of talentPoolMockData as mutable state
  ...(() => {
    // Mutable store for talent pool — keyed by cv_infos_id
    const store = new Map(
      talentPoolMockData.map((cv) => [cv.cv_infos_id, { ...cv }]),
    )

    return [
      http.post(
        `${API_URL}/${Endpoints.Cv.GET_TALENT_POOL}`,
        async ({ request }) => {
          const body = (await request.json()) as {
            page?: number
            limit?: number
          }
          const page = Math.max(1, Number(body?.page ?? 1))
          const limit = Math.max(1, Number(body?.limit ?? 10))

          const items = Array.from(store.values()).filter((cv) => cv.is_marked)
          const total = items.length
          const totalPages = Math.max(1, Math.ceil(total / limit))
          const paged = items.slice((page - 1) * limit, page * limit)

          return HttpResponse.json({
            success: true,
            statusCode: 200,
            message: 'OK',
            data: {
              items: paged,
              meta: { total, page, limit, totalPages },
            },
          })
        },
      ),

      http.patch(
        `${API_URL}/${Endpoints.Cv.MARK_AS_TALENT}`,
        async ({ params, request }) => {
          const id = Number(params.id)
          const body = (await request.json()) as { is_marked: boolean }

          // Look up across both stores: talent pool store + general cv data
          const existing =
            store.get(id) ?? cvMockData.find((cv) => cv.cv_infos_id === id)

          if (!existing) {
            return HttpResponse.json(
              {
                success: false,
                statusCode: 404,
                message: 'CV not found',
                data: null,
              },
              { status: 404 },
            )
          }

          const updated = {
            ...existing,
            is_marked: body.is_marked,
            updated_at: new Date().toISOString(),
          }
          store.set(id, updated)

          return HttpResponse.json({
            success: true,
            statusCode: 200,
            message: body.is_marked
              ? 'CV marked as talent successfully'
              : 'CV removed from talent pool',
            data: updated,
          })
        },
      ),
    ]
  })(),
]
