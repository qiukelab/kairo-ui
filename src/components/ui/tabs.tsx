import { Tabs as TabsPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        'flex flex-col gap-2',
        // Radix stamps data-orientation on every part, so the row layout a
        // vertical tab set needs is handled here rather than by the caller.
        'data-[orientation=vertical]:flex-row data-[orientation=vertical]:gap-4',
        className,
      )}
      {...props}
    />
  )
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex w-full items-center justify-start gap-1 border-b border-border text-muted-foreground',
        'data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-l',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // The indicator is a pseudo-element so activating a tab changes colour
        // only — no layout shift, and no second element to keep in sync.
        // `-bottom-px` lays the 2px bar over the list's 1px rule, which is what
        // makes the two read as a single line.
        'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors',
        'data-[state=active]:text-primary data-[state=active]:after:bg-primary',
        'data-[orientation=vertical]:justify-start data-[orientation=vertical]:after:inset-x-auto data-[orientation=vertical]:after:inset-y-0 data-[orientation=vertical]:after:-left-px data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-0.5',
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
