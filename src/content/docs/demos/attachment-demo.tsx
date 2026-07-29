import {
  Attachment,
  AttachmentGroup,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
} from '@/components/ui/attachment'
import { formatFileSize } from '@/lib/format'

const files = [
  { id: 'a', name: 'workspace.png', type: 'PNG', bytes: 839_680, src: '/placeholder.svg' },
  { id: 'b', name: 'desk-reference.jpg', type: 'JPG', bytes: 1_153_434, src: '/placeholder.svg' },
  { id: 'c', name: 'office-reference.jpg', type: 'JPG', bytes: 962_560, src: '/placeholder.svg' },
]

export default function AttachmentDemo() {
  return (
    <AttachmentGroup layout="grid" className="w-full max-w-lg">
      {files.map((file) => (
        <Attachment key={file.id}>
          <AttachmentPreview src={file.src} />
          <AttachmentName title={file.name}>{file.name}</AttachmentName>
          <AttachmentMeta>
            {file.type} · {formatFileSize(file.bytes)}
          </AttachmentMeta>
          <AttachmentRemove label={`Remove ${file.name}`} />
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}
