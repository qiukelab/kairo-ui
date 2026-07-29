import { AspectRatio as AspectRatioPrimitive } from 'radix-ui'
import type * as React from 'react'

/**
 * Reserves space at a given ratio before the content loads.
 *
 * Reach for Tailwind's `aspect-video` / `aspect-square` first — they are pure
 * CSS and need no JavaScript. This exists for the case those cannot express: a
 * ratio that is a runtime value rather than a class you can write in advance.
 */
function AspectRatio(props: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
