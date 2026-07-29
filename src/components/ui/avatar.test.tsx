import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'

describe('Avatar', () => {
  it('shows the fallback while the image has not loaded', () => {
    // jsdom never actually loads an image, so Radix keeps the avatar in its
    // pending state — the same DOM a real broken src ends at, and the case that
    // matters: the fallback is the only thing announced.
    render(
      <Avatar>
        <AvatarImage src="/avatars/nope.svg" alt="Malee Kittipong" />
        <AvatarFallback>MK</AvatarFallback>
      </Avatar>,
    )

    expect(screen.getByText('MK')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('defaults to the standard size and mirrors it to the DOM', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'default')
  })

  it('exposes the chosen size', () => {
    render(
      <Avatar size="lg" data-testid="avatar">
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByTestId('avatar')).toHaveAttribute('data-size', 'lg')
  })

  it('keeps the badge visible by not clipping the avatar', () => {
    // The badge is positioned outside the circle, so `overflow-hidden` here
    // would silently cut it in half.
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByTestId('avatar')).toHaveClass('overflow-visible')
  })

  it('renders a group count that is not interactive by default', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <span aria-hidden>+3</span>
          <span className="sr-only">3 more members</span>
        </AvatarGroupCount>
      </AvatarGroup>,
    )

    expect(screen.getByText('3 more members')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('becomes a real button with asChild, keeping its accessible name', () => {
    render(
      <AvatarGroupCount asChild>
        <button type="button">
          <span className="sr-only">Invite a member</span>
        </button>
      </AvatarGroupCount>,
    )

    const button = screen.getByRole('button', { name: 'Invite a member' })
    expect(button).toHaveAttribute('data-slot', 'avatar-group-count')
  })
})
