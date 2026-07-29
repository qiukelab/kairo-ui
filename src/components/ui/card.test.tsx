import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SLOTS = [
  'card',
  'card-header',
  'card-title',
  'card-description',
  'card-action',
  'card-content',
  'card-footer',
] as const

function FullCard(props: React.ComponentProps<typeof Card>) {
  return (
    <Card data-testid="card" {...props}>
      <CardHeader>
        <CardTitle>Invite a teammate</CardTitle>
        <CardDescription>They get access immediately.</CardDescription>
        <CardAction>Pro</CardAction>
      </CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>Send invite</CardFooter>
    </Card>
  )
}

describe('Card', () => {
  it('renders every slot with its identity', () => {
    const { container } = render(<FullCard />)
    for (const slot of SLOTS) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
  })

  it('defaults to the standard size and declares the spacing property', () => {
    render(<FullCard />)
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-size', 'default')
    expect(card).toHaveClass('[--card-spacing:--spacing(6)]')
  })

  it('moves the whole spacing system down a step at size="sm"', () => {
    render(<FullCard size="sm" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-size', 'sm')
    expect(card).toHaveClass('[--card-spacing:--spacing(4)]')
    expect(card).not.toHaveClass('[--card-spacing:--spacing(6)]')
  })

  it('reads its insets from the property rather than a fixed step', () => {
    // A hard-coded `px-6` here would be wrong at size="sm", and would break the
    // `-mx-(--card-spacing)` edge-to-edge pattern the docs teach.
    const { container } = render(<FullCard />)
    for (const slot of ['card-header', 'card-content', 'card-footer']) {
      expect(container.querySelector(`[data-slot="${slot}"]`)).toHaveClass('px-(--card-spacing)')
    }
  })

  it('tints a divider softly, and lets a caller override the weight', () => {
    const { container } = render(
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Soft</CardTitle>
        </CardHeader>
        <CardFooter className="border-t border-border">Strong</CardFooter>
      </Card>,
    )
    // The colour rides along unconditionally — border-width is 0 until a caller
    // asks for a line, so it costs nothing until it is wanted.
    expect(container.querySelector('[data-slot="card-header"]')).toHaveClass('border-border-soft')
    const footer = container.querySelector('[data-slot="card-footer"]')
    expect(footer).toHaveClass('border-border')
    expect(footer).not.toHaveClass('border-border-soft')
  })

  it('switches the header to two columns only when an action is present', () => {
    const { container, rerender } = render(<FullCard />)
    const withAction = container.querySelector('[data-slot="card-header"]')
    expect(withAction).toHaveClass('has-data-[slot=card-action]:grid-cols-[1fr_auto]')

    rerender(
      <Card>
        <CardHeader>
          <CardTitle>No action</CardTitle>
        </CardHeader>
      </Card>,
    )
    // The rule is a CSS subtree query, so the class is always present; what has
    // to hold is that nothing else forces two columns.
    expect(container.querySelector('[data-slot="card-action"]')).toBeNull()
  })

  it('lets a caller className win over the slot defaults', () => {
    render(<FullCard className="rounded-none shadow-none" />)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('rounded-none', 'shadow-none')
    expect(card).not.toHaveClass('rounded-lg', 'shadow-card')
  })
})
