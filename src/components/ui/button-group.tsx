import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Joins adjacent controls into one unit — an input and its submit button, or a
 * row of related buttons.
 *
 * Inner radii are flattened and each child after the first is pulled back by a
 * pixel, so two 1px borders collapse into the single line that makes the group
 * read as one control instead of two that happen to touch.
 */
function ButtonGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="button-group"
      role="group"
      className={cn(
        'flex w-full items-stretch',
        '[&>*]:relative [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
        // A focused child has to sit above its neighbour, or the neighbour's
        // border paints over one edge of the focus ring.
        '[&>*:focus-visible]:z-10 [&>*:focus-within]:z-10',
        className,
      )}
      {...props}
    />
  )
}

function ButtonGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="button-group-text"
      className={cn(
        'flex items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground select-none',
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupText }
