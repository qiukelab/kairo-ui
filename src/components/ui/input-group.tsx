import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A single control made of an input plus addons — an icon, a prefix, a small
 * button — all sharing one border and one focus ring.
 *
 * The nested input is neutralised from here rather than by a dedicated
 * `InputGroupInput`, so callers compose the plain `Input` they already know.
 * Same self-adjusting idiom as Card's `[.border-b]:pb-6`.
 */
function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30',
        // The ring belongs to the group: the input inside has no border of its
        // own, so a ring on it would float in the middle of the control.
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        'has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-destructive/20 dark:has-[[aria-invalid=true]]:ring-destructive/40',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60',
        '[&_[data-slot=input]]:h-full [&_[data-slot=input]]:border-0 [&_[data-slot=input]]:bg-transparent [&_[data-slot=input]]:px-0 [&_[data-slot=input]]:shadow-none',
        '[&_[data-slot=input]]:focus-visible:border-0 [&_[data-slot=input]]:focus-visible:ring-0',
        '[&_[data-slot=input]]:aria-invalid:border-0 [&_[data-slot=input]]:aria-invalid:ring-0',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupAddon({
  className,
  align = 'start',
  ...props
}: React.ComponentProps<'div'> & { align?: 'start' | 'end' }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn(
        'flex shrink-0 items-center gap-2 text-muted-foreground',
        // Pointer events off so clicking a decorative icon still focuses the
        // input; anything interactive inside turns them back on.
        'pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto',
        "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        align === 'end' && 'ml-auto',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="input-group-text"
      className={cn('text-sm text-muted-foreground select-none', className)}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupText }
