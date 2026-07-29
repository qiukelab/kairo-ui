import { cva, type VariantProps } from 'class-variance-authority'
import { Avatar as AvatarPrimitive, Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '@/lib/utils'

/** Not exported, for the reason given in button.tsx. */
const avatarVariants = cva(
  'relative flex shrink-0 overflow-visible rounded-full [&>[data-slot=avatar-fallback]]:rounded-full [&>[data-slot=avatar-image]]:rounded-full',
  {
    variants: {
      size: {
        sm: 'size-6 text-[0.625rem]',
        default: 'size-8 text-xs',
        lg: 'size-10 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

/**
 * `overflow-visible` on the root, with the radius pushed onto the image and the
 * fallback instead. Clipping here would cut off `AvatarBadge`, which is
 * deliberately positioned outside the circle.
 */
function Avatar({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full object-cover', className)}
      {...props}
    />
  )
}

/**
 * Radix removes the image from the DOM entirely when it fails to load, so this
 * is not a layer showing through — it is what is left. That also means it is
 * the only thing a screen reader ever sees for a broken avatar, which is why
 * initials belong here rather than in a `title` on the image.
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center bg-muted font-medium text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

/**
 * A status dot at the bottom-right. The ring is drawn in `--background` so the
 * badge reads as sitting *in front of* the avatar rather than touching it; pass
 * `className="ring-card"` when the avatar sits on a card instead.
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        'absolute right-0 bottom-0 size-1/4 min-h-2 min-w-2 translate-x-[15%] translate-y-[15%] rounded-full bg-emerald-500 ring-2 ring-background',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Overlapping row. Each avatar gets its own ring so the overlap reads as depth
 * rather than as a collision, and `[&>*]` rather than `space-x-*` so the rule
 * reaches `AvatarGroupCount` too — it is not an `Avatar`, but it has to sit in
 * the same stack.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'flex items-center [&>*]:ring-2 [&>*]:ring-background [&>*:not(:first-child)]:-ml-2',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The "+3" (or an icon) that closes an `AvatarGroup`. Sizing is inherited from
 * the group's avatars rather than set here, so a group of `size="lg"` avatars
 * does not end in a small circle — pass the same `size` you gave them.
 *
 * A `span` by default, because a count is not interactive. When it stands for
 * an action — the "+" that opens an invite dialog — use `asChild` to make it a
 * real button rather than putting a click handler on the span.
 */
function AvatarGroupCount({
  className,
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof avatarVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="avatar-group-count"
      data-size={size}
      className={cn(
        avatarVariants({ size }),
        'items-center justify-center rounded-full bg-muted font-medium text-muted-foreground [&>svg]:size-3.5',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount }
