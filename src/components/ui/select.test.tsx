import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function Timezones({ onValueChange = () => {} }: { onValueChange?: (value: string) => void }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger aria-label="Timezone">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ict">Indochina Time</SelectItem>
        <SelectItem value="jst">Japan Standard Time</SelectItem>
        <SelectItem value="cet">Central European Time</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe('Select', () => {
  it('is named by the trigger, not by its current value', () => {
    render(<Timezones />)
    // The visible text is the chosen value, which is not a name — without an
    // explicit label the control announces only whatever happens to be picked.
    expect(screen.getByRole('combobox', { name: 'Timezone' })).toBeInTheDocument()
  })

  it('shows the placeholder until something is chosen', () => {
    render(<Timezones />)
    expect(screen.getByRole('combobox')).toHaveTextContent('Select a timezone')
  })

  it('opens, chooses with the pointer, and reports the value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Timezones onValueChange={onValueChange} />)

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Japan Standard Time' }))

    expect(onValueChange).toHaveBeenCalledWith('jst')
    expect(screen.getByRole('combobox')).toHaveTextContent('Japan Standard Time')
  })

  it('is operable by keyboard alone', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Timezones onValueChange={onValueChange} />)

    await user.tab()
    expect(screen.getByRole('combobox')).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(await screen.findByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{ArrowDown}{Enter}')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('closes on Escape without choosing', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Timezones onValueChange={onValueChange} />)

    await user.click(screen.getByRole('combobox'))
    await screen.findByRole('listbox')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('mirrors its size for styling', () => {
    render(
      <Select>
        <SelectTrigger size="sm" aria-label="Compact">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'sm')
  })
})
