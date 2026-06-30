import { ROUTES } from './routes'
import { LayoutGrid, Sparkles, UserCog } from 'lucide-react'
import { m } from '@/paraglide/messages'

export const NAVIGATION = [
  { label: () => m.sidebar_nav_cv_hub(), to: ROUTES.CV, icon: LayoutGrid },
  {
    label: () => m.sidebar_nav_smart_search(),
    to: ROUTES.SMART_SEARCH,
    icon: Sparkles,
  },
  {
    label: () => m.sidebar_nav_talent_pool(),
    to: ROUTES.TALENT_POOL,
    icon: UserCog,
  },
  {
    label: () => m.sidebar_nav_user_management(),
    to: ROUTES.USER_MANAGEMENT,
    icon: UserCog,
    adminOnly: true,
  },
]
