import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * The table brings its own scroll container.
 *
 * A table is the one element that cannot be made to fit — its width is the sum
 * of its columns — so leaving the overflow to the caller means every caller
 * eventually forgets and a column falls off the page. Wrapping here makes the
 * failure mode a scrollbar instead.
 */
function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        // `caption-bottom` so a TableCaption reads as a footnote rather than as
        // a heading competing with the page's own.
        className={cn('w-full caption-bottom border-collapse text-sm', className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('[&_tr]:border-b [&_tr]:border-border', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'border-t border-border bg-muted/40 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      // Rows divide with the soft step: the frame is the structure, the rows
      // inside it only need grouping. See the ramp in styles/tokens.css.
      className={cn(
        'border-b border-border-soft transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/60',
        className,
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      // `scope` is what ties a header to its column for a screen reader. It is
      // not optional and it is not inferred, so it is set here rather than left
      // to every caller to remember.
      scope="col"
      className={cn(
        'h-10 px-3 text-left align-middle font-medium whitespace-nowrap text-muted-foreground',
        // A checkbox column should not carry the text gutter.
        '[&:has([role=checkbox])]:w-px [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'px-3 py-2.5 align-middle',
        '[&:has([role=checkbox])]:w-px [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The table's accessible name. Prefer it to a heading beside the table — a
 * caption is associated with the table itself, so it is announced when someone
 * lands on the table rather than only when they read past it.
 */
function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
