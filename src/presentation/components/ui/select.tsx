import { forwardRef, type SelectHTMLAttributes } from 'react'

type Option = {
  label: string
  value: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, ...props }, ref) => (
    <select
      ref={ref}
      className={`w-fit rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-200 ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
)

Select.displayName = 'Select'

export default Select
