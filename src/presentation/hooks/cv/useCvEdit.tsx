import { useRepository } from '@/di/RepositoriesProvider'
import { type UpdateCvRequest, type CvItem } from '@/domain/models/Cv'
import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { useQueryClient } from '@tanstack/react-query'
import { Endpoints } from '@/shared/endpoints'

const updateCvInCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  updatedCv: CvItem,
) => {
  // Get all cached queries and update those that contain CV lists
  const allQueries = queryClient.getQueriesData({})

  allQueries.forEach(([queryKey]) => {
    // Check if this query key is for CV list endpoints
    const keyString = JSON.stringify(queryKey)
    const isCvListQuery =
      keyString.includes(Endpoints.Cv.SEARCH) ||
      keyString.includes(Endpoints.Cv.GET_ALL)

    if (!isCvListQuery) return

    // Handle different response structures
    const updateData = (data: any): any => {
      if (!data) return data

      // Structure 1: { data: { items: [...] } }
      if (data?.data?.items && Array.isArray(data.data.items)) {
        return {
          ...data,
          data: {
            ...data.data,
            items: data.data.items.map((item: CvItem) =>
              item.cv_infos_id === updatedCv.cv_infos_id ? updatedCv : item,
            ),
          },
        }
      }

      // Structure 2: { items: [...], meta: {...} }
      if (data?.items && Array.isArray(data.items)) {
        return {
          ...data,
          items: data.items.map((item: CvItem) =>
            item.cv_infos_id === updatedCv.cv_infos_id ? updatedCv : item,
          ),
        }
      }

      return data
    }

    queryClient.setQueryData(queryKey, updateData)
  })
}

export const useCvEdit = () => {
  const { cvRepository } = useRepository()
  const { mutate: update, isPending, ...rest } = cvRepository.update()
  const queryClient = useQueryClient()

  return {
    updateCv: (
      requestData: UpdateCvRequest,
      onSuccess?: (_data: ResponseCommon<CvItem>) => void,
      onError?: (_error: any) => void,
    ) => {
      if (!requestData.id) {
        const error = new Error('CV ID is required for update')
        onError?.(error)
        return
      }

      update(requestData, {
        onSuccess: (data: ResponseCommon<CvItem>) => {
          if (data?.data) {
            updateCvInCache(queryClient, data.data)
          }

          queryClient.invalidateQueries({
            predicate: (query) => {
              const keyString = JSON.stringify(query.queryKey)
              return (
                keyString.includes(Endpoints.Cv.SEARCH) ||
                keyString.includes(Endpoints.Cv.GET_ALL)
              )
            },
          })

          onSuccess?.(data)
        },
        onError: (error: any) => {
          onError?.(error)
        },
      })
    },
    isLoading: isPending,
    isPending,
    ...rest,
  }
}
