import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ButtonSizesDemo() {
  return (
    <>
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </>
  )
}
