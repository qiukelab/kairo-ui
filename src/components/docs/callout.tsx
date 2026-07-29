import { cn } from '@/lib/utils'

/** An inset note. Available in MDX without an import. */
export function Callout({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'my-6 rounded-lg border border-border bg-surface-soft px-4 py-3 text-sm [&>p]:my-0',
        className,
      )}
      {...props}
    />
  )
}
