import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

function Panel() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes and save when you are done.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

describe('Drawer', () => {
  it('opens from its trigger, named by its title', async () => {
    const user = userEvent.setup()
    render(<Panel />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Edit profile' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Edit profile')
    expect(dialog).toHaveAccessibleDescription('Make changes and save when you are done.')
  })

  it('closes from a real control, not only by dragging', async () => {
    const user = userEvent.setup()
    render(<Panel />)

    // Dragging is a pointer gesture with no keyboard equivalent, so the panel
    // has to be dismissible some other way or it traps keyboard users.
    await user.click(screen.getByRole('button', { name: 'Edit profile' }))
    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<Panel />)

    await user.click(screen.getByRole('button', { name: 'Edit profile' }))
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('hides the drag handle from assistive technology', async () => {
    const user = userEvent.setup()
    const { container } = render(<Panel />)

    await user.click(screen.getByRole('button', { name: 'Edit profile' }))
    await screen.findByRole('dialog')

    const content = container.ownerDocument.querySelector('[data-slot=drawer-content]')
    const handle = content?.firstElementChild
    expect(handle).toHaveAttribute('aria-hidden')
  })
})
