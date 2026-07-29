import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'

const members = [
  { src: '/avatars/01.svg', name: 'Anong Ratana', initials: 'AR' },
  { src: '/avatars/02.svg', name: 'Malee Kittipong', initials: 'MK' },
  { src: '/avatars/03.svg', name: 'Somchai Prasert', initials: 'SP' },
]

export default function AvatarGroupCountDemo() {
  return (
    <AvatarGroup>
      {members.map((member) => (
        <Avatar key={member.name}>
          <AvatarImage src={member.src} alt={member.name} />
          <AvatarFallback>{member.initials}</AvatarFallback>
        </Avatar>
      ))}
      {/* "+3" is a summary, not a name — spell it out so it is not read as
          "plus three" with no object. */}
      <AvatarGroupCount>
        <span aria-hidden>+3</span>
        <span className="sr-only">3 more members</span>
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
