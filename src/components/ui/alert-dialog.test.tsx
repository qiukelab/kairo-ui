import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

function Confirm({ onConfirm = () => {} }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('takes its accessible name from the title', async () => {
    const user = userEvent.setup()
    render(<Confirm />)

    await user.click(screen.getByRole('button', { name: 'Delete project' }))
    expect(screen.getByRole('alertdialog', { name: 'Delete this project?' })).toBeInTheDocument()
  })

  it('renders Action as a real Button, keeping its identity and variant', async () => {
    const user = userEvent.setup()
    render(<Confirm />)
    await user.click(screen.getByRole('button', { name: 'Delete project' }))

    const action = screen.getAllByRole('button', { name: 'Delete project' }).at(-1)
    // A data-slot passed through would have replaced Button's own, quietly
    // exempting these two from any global [data-slot=button] styling.
    expect(action).toHaveAttribute('data-slot', 'button')
    expect(action).toHaveAttribute('data-variant', 'destructive')
  })

  it('defaults Cancel to the outline variant', async () => {
    const user = userEvent.setup()
    render(<Confirm />)
    await user.click(screen.getByRole('button', { name: 'Delete project' }))

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute(
      'data-variant',
      'outline',
    )
  })

  it('runs the action handler and closes', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Confirm onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Delete project' }))
    await user.click(screen.getAllByRole('button', { name: 'Delete project' }).at(-1)!)

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes on Cancel without running the action', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(<Confirm onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Delete project' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('ships no dismiss button — the choice has to be deliberate', async () => {
    const user = userEvent.setup()
    render(<Confirm />)
    await user.click(screen.getByRole('button', { name: 'Delete project' }))

    // Exactly Cancel and the action. A corner X would put back the escape
    // hatch that separates this from a plain Dialog.
    const dialog = screen.getByRole('alertdialog')
    const names = Array.from(dialog.querySelectorAll('button')).map((b) => b.textContent?.trim())
    expect(names).toEqual(['Cancel', 'Delete project'])
  })
})
