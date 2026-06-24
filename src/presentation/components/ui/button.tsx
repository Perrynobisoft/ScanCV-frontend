import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'default' | 'ghost' | 'primary' | 'accent' | 'login'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-white border border-gray-200 text-sm px-3 py-2 text-slate-900 hover:bg-gray-50',
  ghost: 'bg-transparent text-sm px-3 py-2 text-slate-900 hover:bg-slate-100',
  primary: 'bg-slate-950 text-white text-sm px-4 py-2 hover:bg-slate-800',
  accent: 'bg-accent rounded-sm text-white text-sm px-4 py-2 hover:bg-cyan-700',
  login:
    'w-full rounded-lg bg-[#0d9488] font-semibold text-white hover:bg-[#0b7c71] disabled:cursor-not-allowed disabled:opacity-60',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      className={`flex items-center justify-center gap-2 rounded-md font-semibold transition cursor-pointer ${variantStyles[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'

export default Button
