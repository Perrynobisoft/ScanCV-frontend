import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(classes.filter(Boolean).join(' '))
}

// ─── Radix Select Primitives ──────────────────────────────────────────────────
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

// ─── Trigger ─────────────────────────────────────────────────────────────────
const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: 'default' | 'sm'
  }
>(({ className, children, size = 'default', ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex w-full items-center justify-between gap-2 rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition-colors',
      'hover:bg-slate-50 focus:border-accent focus:ring-2 focus:ring-accent/20',
      'disabled:cursor-not-allowed disabled:opacity-50',
      '[&[data-placeholder]>span]:text-slate-400',
      size === 'sm' ? 'h-8 py-1 text-xs' : 'h-9 py-2',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 opacity-80" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// ─── Scroll Up Button ─────────────────────────────────────────────────────────
const SelectScrollUpButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// ─── Scroll Down Button ───────────────────────────────────────────────────────
const SelectScrollDownButton = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

// ─── Content ──────────────────────────────────────────────────────────────────
const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-sm border border-slate-200 bg-white text-slate-900 shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// ─── Label ────────────────────────────────────────────────────────────────────
const SelectLabel = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-semibold text-slate-500',
      className,
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// ─── Item ─────────────────────────────────────────────────────────────────────
const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'hover:bg-slate-100 focus:bg-slate-100',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'data-[state=checked]:bg-accent/10 data-[state=checked]:text-accent',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// ─── Separator ────────────────────────────────────────────────────────────────
const SelectSeparator = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-slate-100', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// ─── SimpleSelect ─────────────────────────────────────────────────────────────
// Drop-in replacement for the old native <select> API.
// Radix doesn't accept value="" so empty values are mapped to/from "__EMPTY__".

const EMPTY_SENTINEL = '__EMPTY__'

type SimpleOption = { label: string; value: string }

interface SimpleSelectProps {
  options: SimpleOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  size?: 'default' | 'sm'
}

const SimpleSelect = React.forwardRef<HTMLButtonElement, SimpleSelectProps>(
  ({
    options,
    value = '',
    onChange,
    disabled,
    placeholder,
    className,
    size = 'default',
  }) => {
    // Map '' → EMPTY_SENTINEL for Radix; reverse on change
    const radixValue = value === '' ? EMPTY_SENTINEL : value

    const handleValueChange = (newVal: string) => {
      onChange?.(newVal === EMPTY_SENTINEL ? '' : newVal)
    }

    const currentLabel =
      options.find((o) => o.value === value)?.label ?? placeholder ?? ''

    return (
      <Select
        value={radixValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={className} size={size}>
          <SelectValue placeholder={currentLabel}>{currentLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value === '' ? EMPTY_SENTINEL : option.value}
              value={option.value === '' ? EMPTY_SENTINEL : option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
)
SimpleSelect.displayName = 'SimpleSelect'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SimpleSelect,
}
