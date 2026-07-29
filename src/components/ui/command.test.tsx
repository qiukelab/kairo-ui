import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'

function Palette({ onSelect = () => {} }: { onSelect?: () => void }) {
  return (
    <Command>
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={onSelect}>Home</CommandItem>
          <CommandItem>Inbox</CommandItem>
          <CommandItem>
            Documents
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

describe('Command', () => {
  it('filters as you type', async () => {
    const user = userEvent.setup()
    render(<Palette />)

    expect(screen.getAllByRole('option')).toHaveLength(3)
    await user.type(screen.getByPlaceholderText('Type a command...'), 'inb')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    expect(screen.getByRole('option')).toHaveTextContent('Inbox')
  })

  it('shows the empty state only when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Palette />)

    expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
    await user.type(screen.getByPlaceholderText('Type a command...'), 'zzzzz')
    expect(screen.getByText('No results found.')).toBeInTheDocument()
    expect(screen.queryAllByRole('option')).toHaveLength(0)
  })

  it('runs an item handler on Enter', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Palette onSelect={onSelect} />)

    await user.type(screen.getByPlaceholderText('Type a command...'), 'home')
    await user.keyboard('{Enter}')
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('keeps the shortcut out of the item name', () => {
    render(<Palette />)
    // "Documents ⌘D" announced as one label is worse than "Documents".
    expect(screen.getByRole('option', { name: 'Documents' })).toBeInTheDocument()
  })

  it('gives the dialog an accessible name and description', () => {
    render(
      <CommandDialog open title="Jump to" description="Search for a page.">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </CommandDialog>,
    )

    // A palette with no name is announced as "dialog" and nothing else, which
    // is why CommandDialog supplies both rather than leaving it to callers.
    const dialog = screen.getByRole('dialog', { name: 'Jump to' })
    expect(dialog).toHaveAccessibleDescription('Search for a page.')
  })

  it('ships no close button in the dialog form', () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Dashboard</CommandItem>
        </CommandList>
      </CommandDialog>,
    )
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })
})
