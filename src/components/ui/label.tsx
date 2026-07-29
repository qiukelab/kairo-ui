import { Label as LabelPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none',
        // Dims from whichever wrapper reports the disabled state, so the label
        // never has to be told about it: `group/field` for a Field, and the
        // sibling `peer` for a bare `<Label> + <Input>` pair.
        'group-data-[disabled=true]/field:opacity-60 peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
