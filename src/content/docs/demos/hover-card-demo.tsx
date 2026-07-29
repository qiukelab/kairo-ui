import { CalendarDaysIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* A real link, so the preview is supplementary: on a touch screen
            there is no hover, and following the link is the way through. */}
        <a
          href="#profile"
          className="rounded-sm font-medium underline underline-offset-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          @anong
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar size="lg">
            <AvatarImage src="/avatars/01.svg" alt="" />
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-semibold">Anong Ratana</p>
            <p className="text-muted-foreground">
              Design engineer. Maintains the component library.
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDaysIcon aria-hidden className="size-3.5" />
              Joined March 2024
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
