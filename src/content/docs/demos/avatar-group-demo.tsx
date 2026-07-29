import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar'

const members = [
  { src: '/avatars/01.svg', name: 'Anong Ratana', initials: 'AR' },
  { src: '/avatars/02.svg', name: 'Malee Kittipong', initials: 'MK' },
  { src: '/avatars/03.svg', name: 'Somchai Prasert', initials: 'SP' },
]

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      {members.map((member) => (
        <Avatar key={member.name}>
          <AvatarImage src={member.src} alt={member.name} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  )
}
