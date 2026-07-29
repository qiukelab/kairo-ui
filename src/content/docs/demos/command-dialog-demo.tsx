import { GaugeIcon, SettingsIcon, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export default function CommandDialogDemo() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'j' || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      setOpen((previous) => !previous)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <p className="text-xs text-muted-foreground">
        or press <kbd className="font-mono">⌘J</kbd>
      </p>

      {/* CommandDialog supplies the sr-only title and description. Override
          them when the palette is scoped to something narrower than commands. */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Jump to"
        description="Search for a page. Use the arrow keys to move and Enter to open it."
      >
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => setOpen(false)}>
              <GaugeIcon />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <UserIcon />
              Profile
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <SettingsIcon />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
