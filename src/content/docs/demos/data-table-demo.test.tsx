import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import DataTableDemo from '@/content/docs/demos/data-table-demo'

/**
 * The data table is a guide rather than a component, so the demo *is* the
 * artefact — and the parts a data table gets wrong by default (sort state,
 * per-row names, the third checkbox state) are exactly what a copy-paste
 * reader inherits.
 */
function rows() {
  return within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
}

describe('DataTableDemo', () => {
  it('announces sort state, not just a chevron', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    const header = screen.getByRole('columnheader', { name: /Job/ })
    expect(header).not.toHaveAttribute('aria-sort')

    await user.click(within(header).getByRole('button', { name: /Job/ }))
    expect(header).toHaveAttribute('aria-sort', 'ascending')

    await user.click(within(header).getByRole('button', { name: /Job/ }))
    expect(header).toHaveAttribute('aria-sort', 'descending')
  })

  it('actually reorders the rows when sorted', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    const first = () => rows()[0].textContent
    const before = first()
    await user.click(screen.getByRole('button', { name: /Job/ }))
    expect(first()).not.toEqual(before)
  })

  it('narrows the rows as you filter, and restores them', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    const filter = screen.getByRole('textbox', { name: 'Filter jobs by title' })
    const before = rows().length

    await user.type(filter, 'checkout')
    expect(rows()).toHaveLength(1)

    await user.clear(filter)
    expect(rows()).toHaveLength(before)
  })

  it('names every row checkbox distinctly', () => {
    render(<DataTableDemo />)
    const names = screen
      .getAllByRole('checkbox')
      .map((box) => box.getAttribute('aria-label'))
      .filter(Boolean)

    // Six identical "Select" controls are useless in a control list.
    expect(new Set(names).size).toBe(names.length)
  })

  it('uses the mixed state for a partial selection', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows on this page' })
    expect(selectAll).toHaveAttribute('aria-checked', 'false')

    const firstRow = within(rows()[0]).getByRole('checkbox')
    await user.click(firstRow)

    // Not "true": the other rows are not selected.
    expect(selectAll).toHaveAttribute('aria-checked', 'mixed')
  })

  it('goes fully checked once every row on the page is selected', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows on this page' })
    await user.click(selectAll)
    expect(selectAll).toHaveAttribute('aria-checked', 'true')
  })

  it('paginates rather than rendering every row', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    expect(rows()).toHaveLength(4)
    const next = screen.getByRole('button', { name: 'Next' })
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    await user.click(next)
    expect(rows()).toHaveLength(2)
    expect(next).toBeDisabled()
  })

  it('shows an empty row when the filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<DataTableDemo />)

    await user.type(screen.getByRole('textbox', { name: 'Filter jobs by title' }), 'zzzzz')
    expect(screen.getByText('No jobs match that filter.')).toBeInTheDocument()
    // Still one row, so the tbody is never left empty.
    expect(rows()).toHaveLength(1)
  })
})
