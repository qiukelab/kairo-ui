import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Not exported — see the note in button.tsx. Use `asChild` instead.
 *
 * No variant draws a border. Emphasis is carried entirely by the fill, which is
 * why the variants are named after their fill rather than after an outline that
 * no longer exists.
 */
const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80',
        soft: 'bg-primary/10 text-primary dark:bg-primary/15 [a&]:hover:bg-primary/15 dark:[a&]:hover:bg-primary/25',
        muted: 'bg-muted text-muted-foreground [a&]:hover:bg-muted/70 [a&]:hover:text-foreground',
        destructive:
          'bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/70 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
      },
      // Padding, text and icon move together — a badge whose icon does not
      // scale with its text reads as misaligned at both ends of the range.
      //
      // `sm` pairs an explicit line-height with its arbitrary font size. Without
      // one it inherits the surrounding leading, which made the small badge
      // render *taller* than the default. Resulting heights: 18 / 20 / 28px.
      size: {
        sm: 'gap-1 px-2 py-0.5 text-[0.6875rem]/[0.875rem] [&>svg]:size-3',
        default: 'gap-1.5 px-2.5 py-0.5 text-xs [&>svg]:size-3',
        lg: 'gap-1.5 px-3 py-1 text-sm [&>svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge }
