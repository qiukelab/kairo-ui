import { ChevronRightIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { docsNav, normalizeDocsPath } from '@/content/docs/nav'
import { cn } from '@/lib/utils'

export function DocsSidebar({
  className,
  onNavigate,
}: {
  className?: string
  onNavigate?: () => void
}) {
  const { pathname } = useLocation()
  const current = normalizeDocsPath(pathname)

  return (
    <nav aria-label="Docs" className={cn('flex flex-col gap-1 text-sm', className)}>
      {docsNav.map((group) => (
        <DocsSidebarGroup key={group.title} title={group.title}>
          {group.items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              aria-current={item.href === current ? 'page' : undefined}
              className={cn(
                'flex items-center rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground',
                item.href === current && 'bg-accent font-medium text-accent-foreground',
              )}
            >
              {item.title}
            </Link>
          ))}
        </DocsSidebarGroup>
      ))}
    </nav>
  )
}

/**
 * Groups start expanded. Collapsing is there for readers who want to narrow a
 * long sidebar, not a default state to fight — a collapsed group hides pages
 * from someone who has not yet learned they exist.
 */
function DocsSidebarGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="pb-2">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-1.5 font-medium transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50">
        {title}
        <ChevronRightIcon
          className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-90')}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
