import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function Faq({ type = 'single' as 'single' | 'multiple' }) {
  const props =
    type === 'single'
      ? ({ type: 'single', collapsible: true } as const)
      : ({ type: 'multiple' } as const)

  return (
    <Accordion {...props}>
      <AccordionItem value="one">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First answer</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second answer</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('starts closed and opens the panel its trigger names', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    expect(screen.queryByText('First answer')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'First' }))
    expect(screen.getByText('First answer')).toBeInTheDocument()
  })

  it('closes again when collapsible', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const trigger = screen.getByRole('button', { name: 'First' })
    await user.click(trigger)
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the previous panel at type="single"', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    await user.click(screen.getByRole('button', { name: 'First' }))
    await user.click(screen.getByRole('button', { name: 'Second' }))

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps both open at type="multiple"', async () => {
    const user = userEvent.setup()
    render(<Faq type="multiple" />)

    await user.click(screen.getByRole('button', { name: 'First' }))
    await user.click(screen.getByRole('button', { name: 'Second' }))

    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('asks for the animation utilities by name', () => {
    // These classes are the whole reason tw-animate-css is a declared
    // dependency. If they are dropped the panel still works, silently, with no
    // animation — which is exactly the bug this pins.
    const { container } = render(<Faq />)
    const content = container.querySelector('[data-slot="accordion-content"]')
    expect(content).toHaveClass(
      'data-[state=open]:animate-accordion-down',
      'data-[state=closed]:animate-accordion-up',
    )
  })
})
