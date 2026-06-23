import type { FormattedError } from '@/application/dto/response/ErrorResponse'
import ErrorHandler from '@/infrastructure/services/ErrorHandler'
import { buildUrl } from '@/shared/url'
import {
  type MutationFunctionContext,
  type MutationOptions,
  type UseQueryOptions,
  useMutation,
  useQueries,
  useQuery,
} from '@tanstack/react-query'
import { type AxiosRequestConfig } from 'axios'
import useAxios from './useAxios'

export type ApiError = FormattedError

export interface ApiConfig<TResponse, TRequest> {
  showErrorToast?: boolean
  successMessage?: string
  silentError?: boolean
  onError?: (error: ApiError, variables?: TRequest, context?: unknown) => void
  onSuccess?: (data: TResponse, variables: TRequest, context: unknown) => void
}

const handleApiError = <TRequest>(
  error: ApiError,
  onError?: (error: ApiError, variables?: TRequest, context?: unknown) => void,
  _silentError?: boolean,
  variables?: TRequest | undefined,
  context?: unknown,
) => {
  // Centralized error handling: show toast unless explicitly silenced.
  const cfg = (context as ApiConfig<unknown, TRequest>) || {}
  const silent =
    _silentError || cfg.silentError === true || cfg.showErrorToast === false
  if (!silent) {
    ErrorHandler.notifyApiError(error)
  }
  if (onError) onError(error, variables, context)
}

export const useGetApi = <TResponse>({
  endpoint,
  urlParams = {},
  queryParams = {},
  options = {},
}: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  options?: Omit<UseQueryOptions<TResponse, ApiError>, 'queryKey' | 'queryFn'>
}) => {
  const { axiosInstance, newAbortSignal } = useAxios()

  /* eslint-disable @tanstack/query/exhaustive-deps */
  return useQuery<TResponse, ApiError>({
    // `axiosInstance` and `newAbortSignal` are stable values from the Axios hook.
    // They should not be part of the query key for request caching.
    queryKey: [endpoint, urlParams, queryParams],
    queryFn: async () => {
      const response = await axiosInstance.get<TResponse>(
        buildUrl(endpoint, urlParams, queryParams),
        { signal: newAbortSignal() },
      )
      return response.data
    },
    ...options,
  })
  /* eslint-enable @tanstack/query/exhaustive-deps */
}

export const useQueriesApi = <TResponse>({
  requests,
}: {
  requests: Array<{
    endpoint: string
    urlParams?: Record<string, string | number>
    queryParams?: Record<string, string | number | boolean | undefined>
    options?: Omit<UseQueryOptions<TResponse, ApiError>, 'queryKey' | 'queryFn'>
  }>
}) => {
  const { axiosInstance, newAbortSignal } = useAxios()

  /* eslint-disable @tanstack/query/exhaustive-deps */
  return useQueries({
    queries: requests.map(
      ({ endpoint, urlParams = {}, queryParams = {}, options = {} }) => ({
        // `axiosInstance` and `newAbortSignal` are stable values from the Axios hook.
        queryKey: [endpoint, urlParams, queryParams],
        queryFn: async () => {
          const response = await axiosInstance.get<TResponse>(
            buildUrl(endpoint, urlParams, queryParams),
            { signal: newAbortSignal() },
          )
          return response.data
        },
        ...options,
      }),
    ),
  })
  /* eslint-enable @tanstack/query/exhaustive-deps */
}

const useMutationApi = <TRequest = void, TResponse = unknown>(
  method: 'post' | 'put' | 'delete' | 'patch' | 'patch',
  {
    endpoint,
    urlParams = {},
    queryParams = {},
    buildQueryParams,
    buildUrlParams,
    options = {},
  }: {
    endpoint: string
    urlParams?: Record<string, string | number>
    queryParams?: Record<string, string | number | boolean | undefined>
    buildQueryParams?: (
      payload: TRequest,
    ) => Record<string, string | number | boolean | undefined>
    buildUrlParams?: (payload: TRequest) => Record<string, string | number>
    options?: MutationOptions<
      TResponse,
      ApiError,
      TRequest,
      ApiConfig<TResponse, TRequest>
    >
  },
) => {
  const { axiosInstance, newAbortSignal } = useAxios()
  return useMutation<
    TResponse,
    ApiError,
    TRequest,
    ApiConfig<TResponse, TRequest>
  >({
    mutationFn: async (payload: TRequest): Promise<TResponse> => {
      const resolvedUrlParams = {
        ...urlParams,
        ...(buildUrlParams ? buildUrlParams(payload) : {}),
      }
      const resolvedQueryParams = {
        ...queryParams,
        ...(buildQueryParams ? buildQueryParams(payload) : {}),
      }
      const config: AxiosRequestConfig = {
        signal: newAbortSignal(),
        headers: options?.meta?.headers as Record<string, string>,
      }
      const url = buildUrl(endpoint, resolvedUrlParams, resolvedQueryParams)

      const response =
        method === 'delete'
          ? await axiosInstance.delete<TResponse>(url, {
              ...config,
              data: payload,
            })
          : await axiosInstance[method]<TResponse>(url, payload, config)
      return response.data
    },
    ...options,
    retry: false,
    onError: (
      error: ApiError,
      variables: TRequest,
      context: ApiConfig<TResponse, TRequest> | undefined,
    ) => {
      const config = context || {}
      handleApiError(
        error,
        options.onError as
          | ((error: ApiError, variables?: TRequest, context?: unknown) => void)
          | undefined,
        config.silentError,
        variables,
        context,
      )
    },
    onSuccess: (
      data: TResponse,
      variables: TRequest,
      onMutateResult: ApiConfig<TResponse, TRequest>,
      context: MutationFunctionContext,
    ) => {
      if (options.onSuccess) {
        options.onSuccess(
          data,
          variables,
          onMutateResult,
          context || ({} as ApiConfig<TResponse, TRequest>),
        )
      }
    },
  })
}
export const usePostApi = <TRequest = void, TResponse = unknown>(props: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  buildUrlParams?: (payload: TRequest) => Record<string, string | number>
  options?: MutationOptions<
    TResponse,
    ApiError,
    TRequest,
    ApiConfig<TResponse, TRequest>
  >
}) => useMutationApi<TRequest, TResponse>('post', props)

export const usePutApi = <TRequest = void, TResponse = unknown>(props: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  buildUrlParams?: (payload: TRequest) => Record<string, string | number>
  options?: MutationOptions<
    TResponse,
    ApiError,
    TRequest,
    ApiConfig<TResponse, TRequest>
  >
}) => useMutationApi<TRequest, TResponse>('put', props)

export const usePatchApi = <TRequest = void, TResponse = unknown>(props: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  buildUrlParams?: (payload: TRequest) => Record<string, string | number>
  buildQueryParams?: (
    payload: TRequest,
  ) => Record<string, string | number | boolean | undefined>
  options?: MutationOptions<
    TResponse,
    ApiError,
    TRequest,
    ApiConfig<TResponse, TRequest>
  >
}) => useMutationApi<TRequest, TResponse>('patch', props)

export const useDeleteApi = <TRequest = void, TResponse = unknown>(props: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  buildUrlParams?: (payload: TRequest) => Record<string, string | number>
  buildQueryParams?: (
    payload: TRequest,
  ) => Record<string, string | number | boolean | undefined>
  options?: MutationOptions<
    TResponse,
    ApiError,
    TRequest,
    ApiConfig<TResponse, TRequest>
  >
}) => useMutationApi<TRequest, TResponse>('delete', props)

export const usePostFormApi = <TResponse = unknown>(props: {
  endpoint: string
  urlParams?: Record<string, string | number>
  queryParams?: Record<string, string | number | boolean | undefined>
  options?: MutationOptions<
    TResponse,
    ApiError,
    FormData,
    ApiConfig<TResponse, FormData>
  >
}) => {
  const defaultHeaders = {
    'Content-Type': 'multipart/form-data',
  }
  return useMutationApi<FormData, TResponse>('post', {
    ...props,
    options: {
      ...props.options,
      meta: {
        ...props.options?.meta,
        headers: {
          ...defaultHeaders,
          ...(props.options?.meta?.headers || {}),
        },
      },
    },
  })
}
