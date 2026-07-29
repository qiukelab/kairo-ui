import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="/avatars/01.svg" alt="Anong Ratana" />
      <AvatarFallback>AR</AvatarFallback>
    </Avatar>
  )
}
