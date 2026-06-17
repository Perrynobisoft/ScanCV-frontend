export function Avatar({ name, size = 36 }: { name?: string; size?: number }) {
  const initials = (name || '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClass = size === 28 ? 'h-7 w-7 text-xs' : 'h-9 w-9 text-sm'

  return (
    <div
      className={`${sizeClass} inline-flex items-center justify-center rounded-full bg-accent text-white`}
    >
      <span className="font-semibold">{initials}</span>
    </div>
  )
}

export default Avatar
