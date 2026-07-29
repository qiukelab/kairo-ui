import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * The state a list reaches when it has nothing in it — which is not an error,
 * and should not look like one.
 *
 * Distinguish the three cases in the copy you pass: nothing created yet (offer
 * the action that creates one), nothing matching the current filter (offer to
 * clear it), and a failure to load (that is an `Alert`, not this).
 */
function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-col items-center justify-center gap-1 px-6 py-12 text-center',
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex max-w-sm flex-col items-center gap-1', className)}
      {...props}
    />
  )
}

/** Not exported, for the reason given in button.tsx. */
const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center text-muted-foreground',
  {
    variants: {
      variant: {
        // A bare glyph: the icon *is* the illustration.
        default: '[&_svg]:size-6',
        // A tinted tile behind it, for a page-level empty state that needs
        // more presence than a table cell does.
        icon: 'size-10 rounded-lg bg-muted [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      // Decorative by default: the title and description carry the meaning, and
      // an announced icon would only repeat them.
      aria-hidden
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn('text-sm text-balance text-muted-foreground', className)}
      {...props}
    />
  )
}

/** Actions. Keep it to the one thing that resolves the emptiness. */
function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn('mt-4 flex flex-wrap items-center justify-center gap-2', className)}
      {...props}
    />
  )
}

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent }
