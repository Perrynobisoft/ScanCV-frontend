import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './presentation/provider/integrations/tanstack-query/root-provider.tsx'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles/styles.css'
import reportWebVitals from './reportWebVitals.ts'
import { RepositoryProvider } from './di/RepositoriesProvider.tsx'
import {
  AuthProvider,
  useAuth,
} from './presentation/provider/auth/auth-provider.tsx'
import { env } from './env'
import { Toaster } from 'sonner'
import { overwriteGetLocale } from './paraglide/runtime.js'
import { resolvePreferredLocale } from './shared/locale'

overwriteGetLocale(resolvePreferredLocale)

async function enableMocking() {
  if (import.meta.env.DEV && env.VITE_APP_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })
  }
  return Promise.resolve()
}

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined!,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,

  // rewrite: {
  //   input: ({ url }) => {
  //     try {
  //       return deLocalizeUrl(url)
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.error(
  //         'Failed to de-localize URL in router rewrite input:',
  //         error,
  //       )
  //       return url
  //     }
  //   },
  //   output: ({ url }) => {
  //     try {
  //       return localizeUrl(url)
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.error('Failed to localize URL in router rewrite output:', error)
  //       return url
  //     }
  //   },
  // },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const InnerApp = () => {
  const auth = useAuth()
  return (
    <RouterProvider
      router={router}
      context={{
        ...TanStackQueryProviderContext,
        auth,
      }}
    />
  )
}

// Render the app
enableMocking().then(() => {
  const rootElement = document.getElementById('app')
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <StrictMode>
        <RepositoryProvider>
          <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
            <AuthProvider>
              <InnerApp />
              <Toaster position="top-right" richColors />
            </AuthProvider>
          </TanStackQueryProvider.Provider>
        </RepositoryProvider>
      </StrictMode>,
    )
  }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
