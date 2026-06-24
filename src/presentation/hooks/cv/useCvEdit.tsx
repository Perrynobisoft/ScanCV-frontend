import { useRepository } from '@/di/RepositoriesProvider'
import { type UpdateCvRequest, type CvItem } from '@/domain/models/Cv'
import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'
import { useQueryClient } from '@tanstack/react-query'
import { Endpoints } from '@/shared/endpoints'

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
          // Invalidate all CV list queries (GET_ALL endpoint)
          // This will trigger refetch of all paginated/filtered lists
          queryClient.invalidateQueries({
            queryKey: [Endpoints.Cv.GET_ALL],
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
