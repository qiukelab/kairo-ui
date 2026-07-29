import { CheckIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export default function BadgeDemo() {
  return (
    <>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="secondary">
        <CheckIcon />
        Verified
      </Badge>
    </>
  )
}
