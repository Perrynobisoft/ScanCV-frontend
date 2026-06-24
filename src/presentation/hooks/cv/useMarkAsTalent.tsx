import { useRepository } from '@/di/RepositoriesProvider'
import { type CvItem } from '@/domain/models/Cv'
import { type ResponseCommon } from '@/application/dto/response/ResponseCommon'

export const useMarkAsTalent = () => {
  const { cvRepository } = useRepository()
  const { mutate: mark, isPending, ...rest } = cvRepository.markAsTalent()

  return {
    markAsTalent: (
      id: number,
      is_marked: boolean,
      onSuccess?: (data: ResponseCommon<CvItem>) => void,
      onError?: (error: unknown) => void,
    ) => {
      mark(
        { id, is_marked },
        {
          onSuccess: (data) => onSuccess?.(data),
          onError: (error) => onError?.(error),
        },
      )
    },
    isPending,
    ...rest,
  }
}
