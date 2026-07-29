import { TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Delete">
          <TrashIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Delete permanently</TooltipContent>
    </Tooltip>
  )
}
