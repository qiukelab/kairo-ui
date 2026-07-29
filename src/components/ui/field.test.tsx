import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

/**
 * These assert the wiring, not the markup. Every one of them is a bug that
 * would leave a form usable with a mouse and unusable with a screen reader.
 */
describe('Field', () => {
  it('associates the label with the control without any caller-supplied id', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input type="email" />
        </FieldControl>
      </Field>,
    )

    // The user-facing check: can the field be found by its visible label?
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id')
    expect(screen.getByText('Email')).toHaveAttribute('for', input.getAttribute('id'))
  })

  it('points aria-describedby only at elements that exist', () => {
    render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
        <FieldDescription>We will send updates here.</FieldDescription>
        <FieldError>Enter a valid email address.</FieldError>
      </Field>,
    )

    const ids = screen.getByLabelText('Email').getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids).toHaveLength(2)
    for (const id of ids) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('omits an error with no content from aria-describedby', () => {
    // A field that is not currently failing must not describe itself with an
    // empty element — the description would be announced as blank.
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
        <FieldDescription>We will send updates here.</FieldDescription>
        <FieldError>{null}</FieldError>
      </Field>,
    )

    const ids = screen.getByLabelText('Email').getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids).toHaveLength(1)
    expect(document.getElementById(ids[0])).toHaveTextContent('We will send updates here.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('leaves aria-describedby unset when there is nothing to describe', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>,
    )
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-describedby')
  })

  it.each([
    ['invalid', { invalid: true }, 'aria-invalid'],
    ['disabled', { disabled: true }, 'disabled'],
    ['required', { required: true }, 'required'],
  ])('forwards %s from Field to the control', (_name, fieldProps, attribute) => {
    render(
      <Field {...fieldProps}>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>,
    )
    expect(screen.getByLabelText(/Email/)).toHaveAttribute(attribute)
  })

  it('lets the control override the state Field supplies', () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input disabled />
        </FieldControl>
      </Field>,
    )
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })

  it('gives two fields on one page distinct ids', () => {
    render(
      <>
        <Field>
          <FieldLabel>First</FieldLabel>
          <FieldControl>
            <Input />
          </FieldControl>
        </Field>
        <Field>
          <FieldLabel>Second</FieldLabel>
          <FieldControl>
            <Input />
          </FieldControl>
        </Field>
      </>,
    )
    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id)
  })

  it('marks its own state on the DOM for descendants to style against', () => {
    const { container } = render(
      <Field invalid disabled orientation="horizontal">
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input />
        </FieldControl>
      </Field>,
    )
    const field = container.querySelector('[data-slot=field]')
    expect(field).toHaveAttribute('data-invalid', 'true')
    expect(field).toHaveAttribute('data-disabled', 'true')
    expect(field).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('refuses to render its parts outside a Field', () => {
    expect(() => render(<FieldLabel>Orphan</FieldLabel>)).toThrow(/must be used inside <Field>/)
  })
})
