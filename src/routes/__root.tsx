import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '@/presentation/provider/integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import { GeneralError } from '@/presentation/features/errors/general-error'
import { NotFoundError } from '@/presentation/features/errors/not-found-error'
import type { AuthContext } from '@/presentation/provider/auth/auth-provider'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

const Devtools =
  process.env.NODE_ENV === 'development' ? TanstackDevtools : () => null
export const Route = createRootRouteWithContext<MyRouterContext>()({
  errorComponent: GeneralError,
  notFoundComponent: NotFoundError,
  component: () => (
    <>
      <Outlet />
      <Devtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  ),
})
