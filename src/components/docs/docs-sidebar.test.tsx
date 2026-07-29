import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { docsNav, docsNavFlat } from '@/content/docs/nav'

function renderSidebar(path = '/docs') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DocsSidebar />
    </MemoryRouter>,
  )
}

describe('DocsSidebar', () => {
  it('renders a heading for every group', () => {
    renderSidebar()
    for (const group of docsNav) {
      expect(screen.getByRole('button', { name: new RegExp(group.title, 'i') })).toBeInTheDocument()
    }
  })

  it('renders a link for every page in the nav config', () => {
    renderSidebar()
    for (const item of docsNavFlat) {
      expect(screen.getByRole('link', { name: item.title })).toHaveAttribute('href', item.href)
    }
  })

  it('marks the current page', () => {
    renderSidebar('/docs/components/button')
    expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Card' })).not.toHaveAttribute('aria-current')
  })

  it('treats a trailing slash as the same page', () => {
    renderSidebar('/docs/theming/')
    expect(screen.getByRole('link', { name: 'Theming' })).toHaveAttribute('aria-current', 'page')
  })
})
