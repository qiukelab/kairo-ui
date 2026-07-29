import { CheckIcon, CircleDotIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export default function BadgeSizesDemo() {
  return (
    <>
      <Badge size="sm" variant="muted">
        Freelance
      </Badge>
      <Badge size="default" variant="muted">
        <CircleDotIcon />
        Part time
      </Badge>
      <Badge size="lg">
        All listings
        <CheckIcon />
      </Badge>
    </>
  )
}
