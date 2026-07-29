import { PlusIcon } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const members = [
  { src: '/avatars/01.svg', name: 'Anong Ratana', initials: 'AR' },
  { src: '/avatars/02.svg', name: 'Malee Kittipong', initials: 'MK' },
  { src: '/avatars/03.svg', name: 'Somchai Prasert', initials: 'SP' },
]

export default function AvatarGroupIconDemo() {
  return (
    <AvatarGroup>
      {members.map((member) => (
        <Avatar key={member.name}>
          <AvatarImage src={member.src} alt={member.name} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          {/* An icon here means the slot is an action, so it has to be a real
              button — focusable, and named. */}
          <AvatarGroupCount asChild>
            <button type="button" className="cursor-pointer hover:bg-accent">
              <PlusIcon aria-hidden />
              <span className="sr-only">Invite a member</span>
            </button>
          </AvatarGroupCount>
        </TooltipTrigger>
        <TooltipContent>Invite a member</TooltipContent>
      </Tooltip>
    </AvatarGroup>
  )
}
