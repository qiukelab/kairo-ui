import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AvatarBadgeDemo() {
  return (
    <Avatar size="lg">
      <AvatarImage src="/avatars/03.svg" alt="Somchai Prasert" />
      <AvatarFallback>SP</AvatarFallback>
      {/* The dot carries no text, so the state has to be named for anyone who
          cannot see the colour — never signal by colour alone. */}
      <AvatarBadge>
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  )
}
