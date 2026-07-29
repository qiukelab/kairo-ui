import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function Menu({ onSelect = () => {} }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelect}>Profile</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('opens from the trigger', async () => {
    const user = userEvent.setup()
    render(<Menu />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('runs an item handler and closes', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<Menu onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('menuitem', { name: 'Profile' }))

    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Menu />)

    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('mirrors the variant so destructive rows can be styled', async () => {
    const user = userEvent.setup()
    render(<Menu />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(screen.getByRole('menuitem', { name: /Profile/ })).toHaveAttribute(
      'data-variant',
      'default',
    )
    expect(screen.getByRole('menuitem', { name: /Log out/ })).toHaveAttribute(
      'data-variant',
      'destructive',
    )
  })

  it('keeps the shortcut out of the accessible name', async () => {
    const user = userEvent.setup()
    render(<Menu />)
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    // "Log out ⇧⌘Q" read as one label is worse than "Log out".
    expect(screen.getByRole('menuitem', { name: 'Log out' })).toBeInTheDocument()
  })

  it('highlights with the keyboard, not only the pointer', async () => {
    const user = userEvent.setup()
    render(<Menu />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.keyboard('{ArrowDown}')

    // Radix drives both pointer and keyboard from data-highlighted; styling
    // these with `hover:` instead would leave arrow keys with no visible state.
    expect(screen.getByRole('menuitem', { name: /Profile/ })).toHaveAttribute('data-highlighted')
  })
})
