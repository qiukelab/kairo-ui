import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

export default function ComboboxDemo() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const selected = frameworks.find((framework) => framework.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* `role="combobox"` and `aria-expanded` are what make this announce as
            a combobox rather than as a button that happens to open a list. */}
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-56 justify-between font-normal"
        >
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground">Select a framework</span>
          )}
          <ChevronsUpDownIcon aria-hidden className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.label}
                  onSelect={() => {
                    // Selecting the current value clears it, so the control can
                    // be emptied without a separate "none" row.
                    setValue(framework.value === value ? '' : framework.value)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn('text-foreground', value !== framework.value && 'opacity-0')}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
