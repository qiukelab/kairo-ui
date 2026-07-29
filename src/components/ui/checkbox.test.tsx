import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

describe('Checkbox', () => {
  it('takes its name from an associated label', () => {
    render(
      <>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </>,
    )
    // Radix renders a button with role=checkbox, so the association is by id.
    // Without it the control has no name at all.
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument()
  })

  it('toggles on click and reports the new value', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Subscribe" onCheckedChange={onCheckedChange} />)

    const box = screen.getByRole('checkbox', { name: 'Subscribe' })
    expect(box).toHaveAttribute('aria-checked', 'false')

    await user.click(box)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(box).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label="Subscribe" />)

    await user.tab()
    expect(screen.getByRole('checkbox')).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('reports indeterminate as mixed, not as checked', () => {
    // The state a select-all needs for a partial selection. Announcing it as
    // checked would claim every row is selected.
    render(<Checkbox aria-label="Select all" checked="indeterminate" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed')
  })

  it('shows a distinct glyph for indeterminate and for checked', () => {
    const { container, rerender } = render(<Checkbox aria-label="a" checked="indeterminate" />)
    const indeterminate = container.querySelector('[data-slot=checkbox-indicator]')?.innerHTML

    rerender(<Checkbox aria-label="a" checked />)
    const checked = container.querySelector('[data-slot=checkbox-indicator]')?.innerHTML

    expect(indeterminate).toBeTruthy()
    expect(indeterminate).not.toEqual(checked)
  })

  it('does not respond while disabled', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="Subscribe" disabled onCheckedChange={onCheckedChange} />)

    await user.click(screen.getByRole('checkbox'))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
