import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { siteConfig } from '@/lib/site'
import { Landing } from '@/pages/landing'
import { ThemeProvider } from '@/theme/theme-provider'

function renderLanding() {
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={['/']}>
        <Landing />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('Landing', () => {
  it('renders the hero headline', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(siteConfig.tagline)
  })

  it('points Get Started at the docs', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '/docs')
  })

  it('links to the GitHub repository', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /view on github/i })).toHaveAttribute(
      'href',
      `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`,
    )
  })

  it('renders every feature card', () => {
    renderLanding()
    const features = screen.getByRole('heading', {
      name: /built for projects that outlive their dependencies/i,
    }).parentElement?.parentElement

    expect(features).toBeTruthy()
    expect(within(features!).getByText('You own the code')).toBeInTheDocument()
    expect(within(features!).getByText('A real CLI')).toBeInTheDocument()
  })
})
