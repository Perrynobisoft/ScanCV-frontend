import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        replace: true,
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
