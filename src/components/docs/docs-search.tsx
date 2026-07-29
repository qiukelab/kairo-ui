import { Command } from 'cmdk'
import { FileTextIcon, SearchIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Search documentation</DialogTitle>
          <DialogDescription className="sr-only">
            Find a page by name. Use the arrow keys to move and Enter to open.
          </DialogDescription>

          <Command
            loop
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <Command.Input
                placeholder="Search documentation..."
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <Command.List className="max-h-80 overflow-y-auto overscroll-contain p-1">
              <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>

              {docsNav.map((group) => (
                <Command.Group key={group.title} heading={group.title}>
                  {group.items.map((item) => (
                    <Command.Item
                      key={item.href}
                      // Group and title only. cmdk scores fuzzy subsequences,
                      // so folding the description in here lets an item win on
                      // text the reader cannot see — typing "tool" ranked
                      // "kairo.json" above "Tooltip".
                      value={`${group.title} ${item.title}`}
                      onSelect={() => go(item.href)}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                    >
                      <FileTextIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      {item.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
