import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import {
  Attachment,
  AttachmentBody,
  AttachmentDropzone,
  AttachmentGroup,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
} from '@/components/ui/attachment'

function file(name: string, type = 'text/plain') {
  return new File(['x'], name, { type })
}

describe('Attachment', () => {
  it('names the remove button after the file it removes', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <AttachmentGroup>
        <Attachment>
          <AttachmentPreview />
          <AttachmentBody>
            <AttachmentName>report.pdf</AttachmentName>
            <AttachmentMeta>1.2 MB</AttachmentMeta>
          </AttachmentBody>
          <AttachmentRemove label="Remove report.pdf" onClick={onRemove} />
        </Attachment>
      </AttachmentGroup>,
    )

    // "Remove" three times over is useless in a button list — the default
    // exists, but a list should always override it.
    await user.click(screen.getByRole('button', { name: 'Remove report.pdf' }))
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('mirrors status so the preview and meta can react to it', () => {
    const { container } = render(
      <AttachmentGroup>
        <Attachment status="uploading">
          <AttachmentPreview />
          <AttachmentName>report.pdf</AttachmentName>
        </Attachment>
      </AttachmentGroup>,
    )
    expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
      'data-status',
      'uploading',
    )
  })

  it('passes the layout down from the group', () => {
    const { container } = render(
      <AttachmentGroup layout="grid">
        <Attachment>
          <AttachmentName>photo.png</AttachmentName>
        </Attachment>
      </AttachmentGroup>,
    )
    expect(container.querySelector('[data-slot="attachment"]')).toHaveAttribute(
      'data-layout',
      'grid',
    )
  })

  it('renders no image while uploading, so the spinner is what shows', () => {
    render(
      <AttachmentGroup>
        <Attachment status="uploading">
          <AttachmentPreview src="/placeholder.svg" alt="preview" />
          <AttachmentName>photo.png</AttachmentName>
        </Attachment>
      </AttachmentGroup>,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

describe('AttachmentDropzone', () => {
  function drop(target: Element, files: File[]) {
    fireEvent.drop(target, { dataTransfer: { files, types: ['Files'] } })
  }

  it('reports dropped files to the caller', () => {
    const onFiles = vi.fn()
    const { container } = render(
      <AttachmentDropzone onFiles={onFiles}>Drop here</AttachmentDropzone>,
    )
    const zone = container.querySelector('[data-slot="attachment-dropzone"]')!

    drop(zone, [file('a.txt'), file('b.txt')])

    expect(onFiles).toHaveBeenCalledOnce()
    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt', 'b.txt'])
  })

  it('takes only the first file when multiple is false', () => {
    const onFiles = vi.fn()
    const { container } = render(
      <AttachmentDropzone multiple={false} onFiles={onFiles}>
        Drop here
      </AttachmentDropzone>,
    )
    drop(container.querySelector('[data-slot="attachment-dropzone"]')!, [
      file('a.txt'),
      file('b.txt'),
    ])

    expect(onFiles.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt'])
  })

  it('holds the dragging state across child boundaries', () => {
    const { container } = render(
      <AttachmentDropzone onFiles={vi.fn()}>Drop here</AttachmentDropzone>,
    )
    const zone = container.querySelector('[data-slot="attachment-dropzone"]')!

    // dragenter/dragleave fire for every element crossed. A plain boolean
    // flickers off as the pointer moves over a child; the counter must not.
    fireEvent.dragEnter(zone)
    fireEvent.dragEnter(zone)
    fireEvent.dragLeave(zone)
    expect(zone).toHaveAttribute('data-dragging', 'true')

    fireEvent.dragLeave(zone)
    expect(zone).not.toHaveAttribute('data-dragging')
  })

  it('ignores drops while disabled', () => {
    const onFiles = vi.fn()
    const { container } = render(
      <AttachmentDropzone disabled onFiles={onFiles}>
        Drop here
      </AttachmentDropzone>,
    )
    drop(container.querySelector('[data-slot="attachment-dropzone"]')!, [file('a.txt')])
    expect(onFiles).not.toHaveBeenCalled()
  })

  it('keeps the file input in the accessibility tree', () => {
    const { container } = render(
      <AttachmentDropzone onFiles={vi.fn()}>Choose files</AttachmentDropzone>,
    )
    const input = container.querySelector('[data-slot="attachment-input"]')!

    // `display: none` would remove it entirely and leave keyboard users with no
    // way to open the picker. sr-only keeps it focusable and labelled.
    expect(input).toHaveClass('sr-only')
    expect(screen.getByLabelText('Choose files')).toBe(input)
  })
})
