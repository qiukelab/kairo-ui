import { Slot } from 'radix-ui'
import { Children, createContext, isValidElement, useContext, useId, useMemo } from 'react'
import type * as React from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type FieldContextValue = {
  controlId: string
  descriptionId: string
  errorId: string
  /** Pre-joined, and only ever naming ids that are actually rendered. */
  describedBy: string | undefined
  invalid: boolean
  disabled: boolean
  required: boolean
}

const FieldContext = createContext<FieldContextValue | null>(null)

function useFieldContext(component: string) {
  const context = useContext(FieldContext)
  if (!context) {
    throw new Error(`<${component}> must be used inside <Field>`)
  }
  return context
}

/** An element of this type that will actually render something. */
function hasPart(children: React.ReactNode, type: React.ElementType) {
  return Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      child.type === type &&
      Boolean((child.props as { children?: React.ReactNode }).children),
  )
}

/**
 * Groups a label, a control, a description and an error, and wires the
 * accessibility relationships between them so a caller never has to invent an
 * id or remember an `aria-*` attribute.
 */
function Field({
  className,
  children,
  orientation = 'vertical',
  invalid = false,
  disabled = false,
  required = false,
  ...props
}: React.ComponentProps<'div'> & {
  orientation?: 'vertical' | 'horizontal'
  invalid?: boolean
  disabled?: boolean
  required?: boolean
}) {
  const id = useId()
  const controlId = `${id}control`
  const descriptionId = `${id}description`
  const errorId = `${id}error`

  // Scanned synchronously rather than registered from an effect. Registration
  // would mean setState inside useEffect — a cascading second render on every
  // field — and this has to be right on the first paint anyway, because an
  // aria-describedby naming an id that was never rendered is worse than none.
  // The cost is that the scan sees direct children only; anything nested deeper
  // needs an explicit aria-describedby.
  const describedBy =
    [hasPart(children, FieldDescription) && descriptionId, hasPart(children, FieldError) && errorId]
      .filter(Boolean)
      .join(' ') || undefined

  const value = useMemo<FieldContextValue>(
    () => ({ controlId, descriptionId, errorId, describedBy, invalid, disabled, required }),
    [controlId, descriptionId, errorId, describedBy, invalid, disabled, required],
  )

  return (
    <FieldContext value={value}>
      <div
        data-slot="field"
        data-orientation={orientation}
        data-invalid={invalid ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(
          'group/field',
          orientation === 'horizontal'
            ? 'flex flex-wrap items-center gap-3'
            : 'grid content-start gap-2',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </FieldContext>
  )
}

function FieldLabel({ className, children, ...props }: React.ComponentProps<typeof Label>) {
  const field = useFieldContext('FieldLabel')

  return (
    <Label
      data-slot="field-label"
      htmlFor={field.controlId}
      className={cn('group-data-[invalid=true]/field:text-destructive', className)}
      {...props}
    >
      {children}
      {field.required && (
        // Decorative: `required` on the control is what assistive technology
        // reads, so announcing "star" here would only duplicate it.
        <span aria-hidden className="text-destructive">
          *
        </span>
      )}
    </Label>
  )
}

/**
 * Injects the field's id and state onto whatever single element it wraps, so
 * the control itself stays a plain `<Input>` (or textarea, or select).
 */
function FieldControl({ children, ...props }: React.ComponentProps<'input'>) {
  const field = useFieldContext('FieldControl')

  // Slot forwards arbitrary props to its child at runtime, but its type only
  // models HTMLAttributes — which excludes `disabled` and `required`.
  const Comp = Slot.Root as React.ComponentType<React.ComponentProps<'input'>>

  // No `data-slot` of its own: Slot renders nothing, and stamping one here
  // would land on the child and overwrite the identity it already has.
  return (
    <Comp
      id={field.controlId}
      aria-describedby={field.describedBy}
      aria-invalid={field.invalid || undefined}
      disabled={field.disabled || undefined}
      required={field.required || undefined}
      {...props}
    >
      {children}
    </Comp>
  )
}

function FieldDescription({ className, children, ...props }: React.ComponentProps<'p'>) {
  const field = useFieldContext('FieldDescription')
  // Nothing to describe, nothing to point aria-describedby at — see the scan
  // in Field, which agrees with this condition.
  if (!children) return null

  return (
    <p
      data-slot="field-description"
      id={field.descriptionId}
      className={cn(
        'text-sm text-muted-foreground group-data-[disabled=true]/field:opacity-60',
        'group-data-[orientation=horizontal]/field:basis-full',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

function FieldError({ className, children, ...props }: React.ComponentProps<'p'>) {
  const field = useFieldContext('FieldError')
  if (!children) return null

  return (
    <p
      data-slot="field-error"
      id={field.errorId}
      role="alert"
      className={cn(
        'text-sm font-medium text-destructive',
        'group-data-[orientation=horizontal]/field:basis-full',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/** Stacks fields. Pass grid classes to lay them out side by side. */
function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('grid gap-6', className)} {...props} />
}

export { Field, FieldLabel, FieldControl, FieldDescription, FieldError, FieldGroup }
