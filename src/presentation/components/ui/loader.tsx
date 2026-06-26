/**
 * Animated loading indicators — modern, accent-colored.
 *
 * Components:
 *   Spinner   — classic circular spinner (most common)
 *   DotsLoader — three bouncing dots (good for inline / button states)
 *   PulseLoader — growing/shrinking single circle (subtle, minimal)
 *   BarLoader  — 4 bars equaliser animation (great for data pages)
 *   PageLoader — full-area centered loader (drop-in for loading pages)
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ---------------------------------------------------------------------------
// Spinner — circular border spinner
// ---------------------------------------------------------------------------
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSize = {
  xs: 'h-3.5 w-3.5 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full',
        'border-slate-200 border-t-accent',
        spinnerSize[size],
        className,
      )}
    />
  )
}

// ---------------------------------------------------------------------------
// DotsLoader — three bouncing dots
// ---------------------------------------------------------------------------
interface DotsLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const dotSize = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
}

export function DotsLoader({ size = 'md', className }: DotsLoaderProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-center gap-1', className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 160}ms` }}
          className={cn(
            'inline-block rounded-full bg-accent animate-bounce',
            dotSize[size],
          )}
        />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// PulseLoader — single pulsing circle (minimal / subtle)
// ---------------------------------------------------------------------------
interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const pulseSize = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

export function PulseLoader({ size = 'md', className }: PulseLoaderProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('relative inline-flex', pulseSize[size], className)}
    >
      {/* ping ring */}
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30',
        )}
      />
      {/* solid center */}
      <span
        className={cn(
          'relative inline-flex rounded-full bg-accent',
          pulseSize[size],
        )}
      />
    </span>
  )
}

// ---------------------------------------------------------------------------
// BarLoader — 4-bar equaliser animation
// ---------------------------------------------------------------------------
interface BarLoaderProps {
  className?: string
}

export function BarLoader({ className }: BarLoaderProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-flex items-end gap-0.5 h-5', className)}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            animationDelay: `${i * 120}ms`,
            animationDuration: '0.9s',
          }}
          className="inline-block w-1 rounded-full bg-accent animate-[bounce_0.9s_ease-in-out_infinite]"
          // heights staggered via inline style so we don't need arbitrary values
        />
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// PageLoader — centered full-area loader, drop-in replacement
// ---------------------------------------------------------------------------
interface PageLoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse'
  message?: string
  className?: string
}

export function PageLoader({
  variant = 'spinner',
  message,
  className,
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message ?? 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-24',
        className,
      )}
    >
      {variant === 'spinner' && <Spinner size="lg" />}
      {variant === 'dots' && <DotsLoader size="lg" />}
      {variant === 'pulse' && <PulseLoader size="lg" />}

      {message && (
        <p className="text-sm font-medium text-slate-400">{message}</p>
      )}
    </div>
  )
}
