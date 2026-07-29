import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  it('is a switch, not a checkbox', () => {
    // The role is what tells a reader this takes effect now rather than on
    // submit. Getting it wrong makes the two indistinguishable by ear.
    render(<Switch aria-label="Airplane mode" />)
    const control = screen.getByRole('switch', { name: 'Airplane mode' })
    expect(control).toHaveAttribute('aria-checked', 'false')
  })

  it('takes its name from an associated label', () => {
    render(
      <>
        <Switch id="wifi" />
        <Label htmlFor="wifi">Wi-Fi</Label>
      </>,
    )
    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument()
  })

  it('toggles on click and reports the new value', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Wi-Fi" onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('switch'))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Switch aria-label="Wi-Fi" />)

    await user.tab()
    expect(screen.getByRole('switch')).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('ignores both pointer and keyboard while disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="Wi-Fi" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('switch'))
    await user.keyboard(' ')
    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it('has no third state', () => {
    // A checkbox can be indeterminate; "partly on" means nothing for a switch,
    // and Radix reports only true/false.
    render(<Switch aria-label="Wi-Fi" checked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })
})
