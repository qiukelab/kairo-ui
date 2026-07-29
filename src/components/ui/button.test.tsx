import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('defaults to the primary variant and standard size', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveAttribute('data-variant', 'default')
    expect(button).toHaveAttribute('data-size', 'default')
    expect(button).toHaveClass('bg-primary')
  })

  it('exposes the chosen variant and size as data attributes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Delete' })
    expect(button).toHaveAttribute('data-variant', 'destructive')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('lets a caller className win over the variant default', () => {
    // tailwind-merge must drop bg-primary rather than emit both.
    render(<Button className="bg-card">Themed</Button>)
    const button = screen.getByRole('button', { name: 'Themed' })
    expect(button).toHaveClass('bg-card')
    expect(button).not.toHaveClass('bg-primary')
  })

  it('renders as its child with asChild', () => {
    render(
      <Button asChild>
        <a href="/docs">Get Started</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Get Started' })
    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveClass('bg-primary')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
