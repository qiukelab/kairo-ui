import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Not exported, for the reason given in button.tsx: a caller who wants a card's
 * look on a different element should pass `className` to `Card`, not rebuild it
 * from a class string.
 *
 * `size` sets one custom property rather than a set of padding utilities, and
 * every slot below reads it. That indirection is the point: it makes the card's
 * inset a value the *content* can reach too, so an element can cancel it with
 * `-mx-(--card-spacing)` and run edge to edge without hard-coding a number that
 * would then be wrong at `size="sm"`.
 *
 * Separated by elevation, not by a line. `shadow-card` carries a hairline ring
 * of its own under `.dark`, where a blurred shadow would vanish — see the token
 * definition in styles/tokens.css.
 */
const cardVariants = cva(
  'flex flex-col gap-(--card-spacing) rounded-lg bg-card py-(--card-spacing) text-card-foreground shadow-card transition-shadow',
  {
    variants: {
      size: {
        default: '[--card-spacing:--spacing(6)]',
        sm: '[--card-spacing:--spacing(4)]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ size }), className)}
      {...props}
    />
  )
}

/**
 * `border-border-soft` on a slot that draws no border of its own is deliberate:
 * border-width is 0 by default, so the colour lies dormant until a caller adds
 * `border-b`/`border-t`, and then the divider is the lighter step without them
 * asking. A caller who wants the full-strength line writes
 * `className="border-b border-border"` and tailwind-merge lets them win.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 border-border-soft px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('border-border-soft px-(--card-spacing)', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center border-border-soft px-(--card-spacing) [.border-t]:pt-(--card-spacing)',
        className,
      )}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
