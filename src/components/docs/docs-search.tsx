import { FileTextIcon, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { docsNav } from '@/content/docs/nav'
import { cn } from '@/lib/utils'

export function DocsSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'k' || !(event.metaKey || event.ctrlKey)) return
      // Don't steal ⌘K from a focused text field.
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? '')) {
        return
      }
      event.preventDefault()
      setOpen((previous) => !previous)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const go = useCallback(
    (href: string) => {
      setOpen(false)
      navigate(href)
    },
    [navigate],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-8 items-center gap-2 rounded-md border border-border bg-surface-soft px-3 text-sm text-muted-foreground transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50',
          className,
        )}
      >
        <SearchIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="ml-auto hidden h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Find a page by name. Use the arrow keys to move and Enter to open."
      >
        <CommandInput placeholder="Search documentation..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {docsNav.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  // Group and title only. cmdk scores fuzzy subsequences, so
                  // folding the description in here lets an item win on text
                  // the reader cannot see — typing "tool" ranked "kairo.json"
                  // above "Tooltip".
                  value={`${group.title} ${item.title}`}
                  onSelect={() => go(item.href)}
                  className="cursor-pointer"
                >
                  <FileTextIcon aria-hidden />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
