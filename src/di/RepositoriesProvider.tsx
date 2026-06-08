import { AuthRepositoryImpl } from '@/infrastructure/repositories/AuthRepositoryImpl'
import { type ReactNode, createContext, useContext, useMemo } from 'react'
import { UsersRepositoryImpl } from '@/infrastructure/repositories/UsersRepositoryImpl'
import { CvRepositoryImpl } from '@/infrastructure/repositories/CvRepositoryImpl'

// 1. Define interface for repositories
export interface RepositoryContainer {
  authRepository: ReturnType<typeof AuthRepositoryImpl>
  usersRepository: ReturnType<typeof UsersRepositoryImpl>
  cvRepository: ReturnType<typeof CvRepositoryImpl>
}

// 2. Create context with explicit type
const RepositoryContext = createContext<RepositoryContainer | undefined>(
  undefined,
)

// 3. Define props for Provider
interface RepositoryProviderProps {
  children: ReactNode
}

// 4. Implement Provider
export const RepositoryProvider = ({ children }: RepositoryProviderProps) => {
  const repositories = useMemo<RepositoryContainer>(
    () => ({
      authRepository: AuthRepositoryImpl(),
      usersRepository: UsersRepositoryImpl(),
      cvRepository: CvRepositoryImpl(),
    }),
    [],
  )

  return (
    <RepositoryContext.Provider value={repositories}>
      {children}
    </RepositoryContext.Provider>
  )
}

// 5. Create custom hook
export const useRepository = (): RepositoryContainer => {
  const context = useContext(RepositoryContext)
  if (!context) {
    throw new Error('useRepository must be used within a RepositoryProvider')
  }
  return context
}
