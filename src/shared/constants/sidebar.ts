import { ROUTES } from './routes'
import { LayoutGrid, Sparkles, UserCog } from 'lucide-react'

export const NAVIGATION = [
  { label: 'CV Hub', to: ROUTES.CV, icon: LayoutGrid },
  { label: 'Smart Search', to: ROUTES.SMART_SEARCH, icon: Sparkles },
  { label: 'Talent Pool', to: ROUTES.TALENT_POOL, icon: UserCog },
  {
    label: 'User Management',
    to: ROUTES.USER_MANAGEMENT,
    icon: UserCog,
    adminOnly: true,
  },
  // adminOnly: true to make it only visible for admin users
]
