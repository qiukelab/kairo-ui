import { CloudUploadIcon } from 'lucide-react'
import { useState } from 'react'

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
import { formatFileSize } from '@/lib/format'

type Picked = { id: string; name: string; size: number }

export default function AttachmentDropzoneDemo() {
  // The dropzone reports what was chosen; the list lives here. That split is
  // the point — an attachment list is normally part of a form whose state
  // already exists somewhere, and a component holding a private copy would
  // fight it.
  const [files, setFiles] = useState<Picked[]>([])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <AttachmentDropzone
        accept="image/*,.pdf,.txt"
        onFiles={(dropped) =>
          setFiles((current) => [
            ...current,
            ...dropped.map((file) => ({
              // Name and size are not unique on their own; the index keeps two
              // identical picks apart without needing crypto.randomUUID.
              id: `${file.name}-${file.size}-${current.length}`,
              name: file.name,
              size: file.size,
            })),
          ])
        }
      >
        <CloudUploadIcon aria-hidden className="size-5" />
        <span>
          <span className="font-medium text-foreground">Choose files</span> or drag them here
        </span>
        <span className="text-xs">Images, PDF or text</span>
      </AttachmentDropzone>

      {files.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground">Nothing attached yet.</p>
      ) : (
        <AttachmentGroup>
          {files.map((file) => (
            <Attachment key={file.id}>
              <AttachmentPreview />
              <AttachmentBody>
                <AttachmentName title={file.name}>{file.name}</AttachmentName>
                <AttachmentMeta>{formatFileSize(file.size)}</AttachmentMeta>
              </AttachmentBody>
              <AttachmentRemove
                label={`Remove ${file.name}`}
                onClick={() => setFiles((current) => current.filter((f) => f.id !== file.id))}
              />
            </Attachment>
          ))}
        </AttachmentGroup>
      )}
    </div>
  )
}
