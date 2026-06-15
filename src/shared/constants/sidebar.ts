import { ROUTES } from './routes'
import { LayoutGrid, Sparkles, UserCog, ChartNoAxesColumn } from 'lucide-react'

export const NAVIGATION = [
  { label: 'CV Hub', to: ROUTES.CV, icon: LayoutGrid },
  { label: 'Smart Search', to: ROUTES.SMART_SEARCH, icon: Sparkles },
  { label: 'Talent Pool', to: ROUTES.TALENT_POOL, icon: UserCog },
  { label: 'User Management', to: ROUTES.USER_MANAGEMENT, icon: UserCog },
  {
    label: 'API Usage',
    to: ROUTES.API_USAGE,
    icon: ChartNoAxesColumn,
    adminOnly: false,
  },
  // adminOnly: true to make it only visible for admin users
]
