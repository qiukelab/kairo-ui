import { Switch as SwitchPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * A control that takes effect the moment it is flipped.
 *
 * That is the whole difference from [Checkbox](/docs/components/checkbox): a
 * switch commits immediately, a checkbox is a value you submit later. Choosing
 * between them by which one looks nicer is how a form ends up with toggles that
 * quietly need a Save button — see switch.mdx.
 *
 * Radix gives it `role="switch"` and `aria-checked`. There is no third state:
 * unlike a checkbox, "partly on" means nothing here.
 */
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/70',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-background ring-0 transition-transform',
          // 16px of travel across a 36px track with a 2px inset either side.
          'data-[state=checked]:translate-x-[calc(100%+2px)] data-[state=unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
