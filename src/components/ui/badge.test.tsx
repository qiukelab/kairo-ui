import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from '@/components/ui/badge'

const VARIANTS = ['default', 'secondary', 'soft', 'muted', 'destructive'] as const

describe('Badge', () => {
  it('defaults to the primary variant at the standard size', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toHaveAttribute('data-variant', 'default')
    expect(badge).toHaveAttribute('data-size', 'default')
  })

  it('exposes the chosen variant and size as data attributes', () => {
    render(
      <Badge variant="soft" size="lg">
        Pro
      </Badge>,
    )
    const badge = screen.getByText('Pro')
    expect(badge).toHaveAttribute('data-variant', 'soft')
    expect(badge).toHaveAttribute('data-size', 'lg')
  })

  it.each(VARIANTS)('renders %s without any border utility', (variant) => {
    // The house style carries emphasis in the fill. A border creeping back into
    // one variant is the kind of drift that only shows up in a screenshot.
    render(<Badge variant={variant}>Label</Badge>)
    const classes = screen.getByText('Label').className.split(/\s+/)
    expect(classes.filter((name) => /(^|:)border(-|$)/.test(name))).toEqual([])
  })

  it('gives each size a distinct text scale', () => {
    render(
      <>
        <Badge size="sm">Small</Badge>
        <Badge size="default">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </>,
    )
    // `sm` must carry an explicit line-height. Left to inherit the surrounding
    // leading, it rendered taller than the default size.
    expect(screen.getByText('Small')).toHaveClass('text-[0.6875rem]/[0.875rem]')
    expect(screen.getByText('Medium')).toHaveClass('text-xs')
    expect(screen.getByText('Large')).toHaveClass('text-sm')
  })

  it('renders as its child with asChild', () => {
    render(
      <Badge variant="muted" asChild>
        <a href="/changelog">v0.1.0</a>
      </Badge>,
    )
    const link = screen.getByRole('link', { name: 'v0.1.0' })
    expect(link).toHaveAttribute('href', '/changelog')
    expect(link).toHaveAttribute('data-slot', 'badge')
  })

  it('lets a caller className win over the variant fill', () => {
    render(<Badge className="bg-card">Themed</Badge>)
    const badge = screen.getByText('Themed')
    expect(badge).toHaveClass('bg-card')
    expect(badge).not.toHaveClass('bg-primary')
  })
})
