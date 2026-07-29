import { FileIcon, LoaderCircleIcon, TriangleAlertIcon, XIcon } from 'lucide-react'
import { createContext, useContext, useId, useRef, useState } from 'react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

type AttachmentLayout = 'grid' | 'list'
type AttachmentStatus = 'idle' | 'uploading' | 'error'

const LayoutContext = createContext<AttachmentLayout>('list')
const StatusContext = createContext<AttachmentStatus>('idle')

/**
 * Arranges attachments, and tells each one which shape to take.
 *
 * `layout` travels by context rather than by prop so a card and a row stay the
 * same component in two arrangements — the same reason `Field` distributes its
 * ids instead of asking every part for them.
 */
function AttachmentGroup({
  className,
  layout = 'list',
  ...props
}: React.ComponentProps<'div'> & { layout?: AttachmentLayout }) {
  return (
    <LayoutContext value={layout}>
      <div
        data-slot="attachment-group"
        data-layout={layout}
        className={cn(
          layout === 'grid'
            ? 'grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3'
            : 'flex flex-col gap-2',
          className,
        )}
        {...props}
      />
    </LayoutContext>
  )
}

function Attachment({
  className,
  status = 'idle',
  ...props
}: React.ComponentProps<'div'> & { status?: AttachmentStatus }) {
  const layout = useContext(LayoutContext)

  return (
    <StatusContext value={status}>
      <div
        data-slot="attachment"
        data-layout={layout}
        data-status={status}
        className={cn(
          'group/attachment relative rounded-lg border border-input bg-card text-card-foreground transition-colors',
          layout === 'grid' ? 'flex flex-col overflow-hidden p-2' : 'flex items-center gap-3 p-2',
          status === 'error' && 'border-destructive/50 bg-destructive/5',
          className,
        )}
        {...props}
      />
    </StatusContext>
  )
}

/**
 * The square at the start of an attachment. Renders the thumbnail when there is
 * one, a spinner while uploading, a warning on error, and a generic file icon
 * otherwise — the caller passes `src` and the state decides the rest.
 */
function AttachmentPreview({
  className,
  src,
  alt = '',
  children,
  ...props
}: React.ComponentProps<'div'> & { src?: string; alt?: string }) {
  const layout = useContext(LayoutContext)
  const status = useContext(StatusContext)

  return (
    <div
      data-slot="attachment-preview"
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground',
        layout === 'grid' ? 'mb-2 aspect-square w-full' : 'size-10',
        status === 'error' && 'bg-destructive/10 text-destructive',
        className,
      )}
      {...props}
    >
      {status === 'uploading' ? (
        // `aria-hidden`: the percentage in AttachmentMeta is the announcement,
        // and a spinner with its own label would say it twice.
        <LoaderCircleIcon aria-hidden className="size-4 animate-spin" />
      ) : status === 'error' ? (
        <TriangleAlertIcon aria-hidden className="size-4" />
      ) : src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        (children ?? <FileIcon aria-hidden className="size-4" />)
      )}
    </div>
  )
}

function AttachmentName({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-name"
      // File names are long and the interesting part is the start, so they
      // truncate rather than wrap. `min-w-0` is what actually lets truncate
      // work inside the flex row.
      className={cn('min-w-0 truncate text-sm font-medium', className)}
      {...props}
    />
  )
}

function AttachmentMeta({ className, ...props }: React.ComponentProps<'div'>) {
  const status = useContext(StatusContext)

  return (
    <div
      data-slot="attachment-meta"
      className={cn(
        'min-w-0 truncate text-xs',
        status === 'error' ? 'text-destructive' : 'text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

/** Wraps name + meta so they stack and share the row's remaining width. */
function AttachmentBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="attachment-body"
      className={cn('flex min-w-0 flex-1 flex-col gap-0.5', className)}
      {...props}
    />
  )
}

/**
 * Follows the `DialogClose` precedent: an icon plus visually-hidden text, so
 * the control always has an accessible name. Pass `label` to say *which*
 * attachment it removes — "Remove" three times over is not much use to anyone
 * navigating by button list.
 */
function AttachmentRemove({
  className,
  label = 'Remove attachment',
  ...props
}: React.ComponentProps<'button'> & { label?: string }) {
  const layout = useContext(LayoutContext)

  return (
    <button
      type="button"
      data-slot="attachment-remove"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
        layout === 'grid' ? 'absolute top-3 right-3 size-6 bg-card/80 backdrop-blur' : 'size-8',
        className,
      )}
      {...props}
    >
      <XIcon aria-hidden />
      <span className="sr-only">{label}</span>
    </button>
  )
}

/**
 * A drop target with a real file input behind it.
 *
 * Holds no file list of its own — it reports what was chosen through `onFiles`
 * and the caller owns the state. That is deliberate: an attachment list is
 * almost always part of a form whose state already lives somewhere, and a
 * component that kept a private copy would fight it.
 *
 * The input is `sr-only`, not `hidden`. `display: none` removes an element from
 * the accessibility tree, which would leave keyboard users with no way in at
 * all — this way the label is a real focus stop that opens the file picker.
 */
function AttachmentDropzone({
  className,
  children,
  onFiles,
  accept,
  multiple = true,
  disabled = false,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onDrop' | 'onDragOver'> & {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
}) {
  const inputId = useId()
  const [dragging, setDragging] = useState(false)
  // dragenter/dragleave fire for every child element crossed, so a plain
  // boolean flickers as the pointer moves over the label or the icon. Counting
  // enters against leaves is what makes the state stable.
  const depth = useRef(0)

  function reset() {
    depth.current = 0
    setDragging(false)
  }

  return (
    <div
      data-slot="attachment-dropzone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        'relative rounded-lg border border-dashed border-input p-6 text-center transition-colors',
        'has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/50',
        dragging && 'border-primary bg-primary/5',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      onDragEnter={(event) => {
        if (disabled) return
        event.preventDefault()
        depth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => {
        if (disabled) return
        // Without this the browser navigates to the dropped file instead.
        event.preventDefault()
      }}
      onDragLeave={() => {
        if (disabled) return
        depth.current -= 1
        if (depth.current <= 0) reset()
      }}
      onDrop={(event) => {
        if (disabled) return
        event.preventDefault()
        reset()
        const files = Array.from(event.dataTransfer?.files ?? [])
        if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1))
      }}
      {...props}
    >
      <input
        id={inputId}
        data-slot="attachment-input"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          if (files.length > 0) onFiles(files)
          // Clear it, or choosing the same file twice in a row fires nothing.
          event.target.value = ''
        }}
      />
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center gap-1 text-sm text-muted-foreground"
      >
        {children}
      </label>
    </div>
  )
}

export {
  Attachment,
  AttachmentBody,
  AttachmentDropzone,
  AttachmentGroup,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
}
