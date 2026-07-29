import { CheckIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export default function BadgeDemo() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="soft">Soft</Badge>
      <Badge variant="muted">Muted</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="soft">
        Verified
        <CheckIcon />
      </Badge>
    </>
  )
}
