import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime.js'
import type { FormattedError } from '@/application/dto/response/ErrorResponse'
import type { RefreshTokenResponse } from '@/domain/models/Auth'
// import { RefreshTokenResponse } from '@/domain/models/Auth';
import LoggerService from '@/infrastructure/services/LoggerServiceImpl'
import { Endpoints } from '@/shared/endpoints'
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthTokens,
} from '@/shared/auth-storage'
import { handleLogout } from '@/shared/helpers'
import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from '@/env'
import { queryClient } from '@/presentation/provider/integrations/tanstack-query/root-provider'

class HttpClient {
  private instance: AxiosInstance
  private isRefreshing: boolean = false
  private refreshQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []
  private readonly loggerService: LoggerService = new LoggerService()
  private readonly TIMEOUT: number
  constructor(timeout: number = Number(env.VITE_APP_TIMEOUT) || 30000) {
    this.TIMEOUT = timeout

    this.instance = axios.create({
      baseURL: env.VITE_APP_API_URL,
      timeout: this.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'x-custom-lang': getLocale(),
      },
    })

    this.addInterceptors()
  }

  private addInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.handleRequest(config),
      (error: AxiosError) => Promise.reject(error),
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.handleResponse(response),
      (error: AxiosError) => this.handleResponseError(error),
    )
  }

  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    const token = getStoredAccessToken()
    const refreshToken = getStoredRefreshToken()
    config.headers['x-custom-lang'] = getLocale()
    if (token && config.url !== Endpoints.Auth.REFRESH_TOKEN) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (refreshToken && config.url === Endpoints.Auth.REFRESH_TOKEN) {
      config.headers.Authorization = `Bearer ${refreshToken}`
    }

    return config
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    this.loggerService.info(
      `✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} | Success`,
    )
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
    }
  }

  private async handleResponseError(
    error: AxiosError,
    _: number = 0,
  ): Promise<any> {
    if (!error.response) {
      this.loggerService.error('Network Error:', error.message)
      throw this.formatError({
        message: m.network_error(),
        status: undefined,
        path: error.config?.url,
      })
    }
    const { status } = error.response
    if (status === 401) return this.handle401Error(error)
    // if ([500, 502, 503, 504, 429].includes(status) && retryCount < this.MAX_RETRIES) {
    //   return this.retryRequest(config!, retryCount);
    // }
    // return this.handle401Error(error);
    throw this.formatError({
      payload: error.response.data,
      status,
      path: error.config?.url,
    })
  }

  private async handle401Error(error: AxiosError): Promise<any> {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    // if request is refresh token, do not retry
    if (originalRequest.url === Endpoints.Auth.REFRESH_TOKEN) {
      this.loggerService.error('Refresh token request failed:', error.message)
      return this.handleLogout()
    }

    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({
          resolve: (newToken) => {
            originalRequest.headers!.Authorization = `Bearer ${newToken}`
            resolve(this.instance(originalRequest))
          },
          reject,
        })
      })
    }

    this.isRefreshing = true
    const refreshToken = getStoredRefreshToken()
    if (!refreshToken) {
      this.rejectRefreshQueue(new Error(m.missing_refresh_token()))
      return this.handleLogout()
    }
    try {
      const { data } = await this.instance.post<RefreshTokenResponse>(
        Endpoints.Auth.REFRESH_TOKEN,
        {},
      )
      const accessToken = data.token
      persistAuthTokens(data)

      this.refreshQueue.forEach((queueItem) => queueItem.resolve(accessToken))
      this.refreshQueue = []
      originalRequest.headers!.Authorization = `Bearer ${accessToken}`
      return this.instance(originalRequest)
    } catch (refreshError) {
      this.rejectRefreshQueue(refreshError)
      return this.handleLogout()
    } finally {
      this.isRefreshing = false
    }
  }

  private handleLogout(): void {
    handleLogout(queryClient)
    window.location.assign('/auth/login')
  }

  private rejectRefreshQueue(error: unknown): void {
    this.refreshQueue.forEach((queueItem) => queueItem.reject(error))
    this.refreshQueue = []
  }

  private formatError({
    payload,
    message,
    status,
    path,
  }: {
    payload?: unknown
    message?: string
    status?: number
    path?: string
  }): FormattedError {
    const normalizedPayload = payload as
      | {
          message?: string
          error?: {
            message?: string
          }
          errors?: Record<string, string>
          path?: string
          status?: number
        }
      | undefined

    return {
      error: {
        message:
          message ||
          Object.values(normalizedPayload?.errors || {}).join(', ') ||
          normalizedPayload?.message ||
          normalizedPayload?.error?.message ||
          m.common_error_generic(),
        status: status ?? normalizedPayload?.status,
        timestamp: new Date().toISOString(),
        path: path ?? normalizedPayload?.path,
      },
    }
  }

  public createAbortSignal(): AbortSignal {
    const abortController = new AbortController()
    return abortController.signal
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance
  }
}

export default new HttpClient()
