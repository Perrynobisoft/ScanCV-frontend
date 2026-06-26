import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Base Skeleton — shimmer pulse block
// ---------------------------------------------------------------------------
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200/80', className)}
    />
  )
}

// ---------------------------------------------------------------------------
// SkeletonText — a few lines of text placeholder
// ---------------------------------------------------------------------------
interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SkeletonAvatar — circle avatar placeholder
// ---------------------------------------------------------------------------
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const avatarSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: SkeletonAvatarProps) {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', avatarSizes[size], className)}
    />
  )
}

// ---------------------------------------------------------------------------
// SkeletonCard — generic card placeholder
// ---------------------------------------------------------------------------
interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// SkeletonTableRow — one row placeholder for tables
// ---------------------------------------------------------------------------
interface SkeletonTableRowProps {
  cols?: number
  className?: string
}

export function SkeletonTableRow({
  cols = 5,
  className,
}: SkeletonTableRowProps) {
  return (
    <tr className={cn('border-b border-gray-100', className)}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <SkeletonAvatar size="sm" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : (
            <Skeleton className="h-3.5 w-20" />
          )}
        </td>
      ))}
    </tr>
  )
}

// ---------------------------------------------------------------------------
// SkeletonTable — full table skeleton with configurable rows
// ---------------------------------------------------------------------------
interface SkeletonTableProps {
  rows?: number
  cols?: number
  className?: string
}

export function SkeletonTable({
  rows = 6,
  cols = 5,
  className,
}: SkeletonTableProps) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LoadingSpinner — accent-colored spinner for inline / overlay use
// ---------------------------------------------------------------------------
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export function LoadingSpinner({
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-slate-200 border-t-accent animate-spin',
        spinnerSizes[size],
        className,
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// PageLoader — full-area centered loading state (replaces blank pages)
// ---------------------------------------------------------------------------
interface PageLoaderProps {
  message?: string
  className?: string
}

export function PageLoader({
  message = 'Loading…',
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-24 text-slate-400',
        className,
      )}
      role="status"
      aria-label={message}
    >
      <LoadingSpinner size="lg" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}
