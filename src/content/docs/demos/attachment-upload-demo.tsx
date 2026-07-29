import { FileCodeIcon } from 'lucide-react'

import {
  Attachment,
  AttachmentBody,
  AttachmentGroup,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
} from '@/components/ui/attachment'
import { formatFileSize } from '@/lib/format'

export default function AttachmentUploadDemo() {
  return (
    <AttachmentGroup className="w-full max-w-md">
      <Attachment status="uploading">
        <AttachmentPreview />
        <AttachmentBody>
          <AttachmentName>sales-dashboard.pdf</AttachmentName>
          {/* The percentage is the announcement — the spinner is aria-hidden,
              so this line is what a screen reader reads as progress. */}
          <AttachmentMeta>Uploading · 64%</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove label="Cancel upload of sales-dashboard.pdf" />
      </Attachment>

      <Attachment>
        <AttachmentPreview>
          <FileCodeIcon aria-hidden className="size-4" />
        </AttachmentPreview>
        <AttachmentBody>
          <AttachmentName>message-renderer.tsx</AttachmentName>
          <AttachmentMeta>TypeScript · {formatFileSize(12_288)}</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove label="Remove message-renderer.tsx" />
      </Attachment>

      <Attachment status="error">
        <AttachmentPreview />
        <AttachmentBody>
          <AttachmentName>quarterly-report.key</AttachmentName>
          <AttachmentMeta>Upload failed · file is larger than 25 MB</AttachmentMeta>
        </AttachmentBody>
        <AttachmentRemove label="Remove quarterly-report.key" />
      </Attachment>
    </AttachmentGroup>
  )
}
