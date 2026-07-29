import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sizes = ['sm', 'default', 'lg'] as const

export default function AvatarSizesDemo() {
  return (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src="/avatars/04.svg" alt="Thanya Nopparat" />
          <AvatarFallback>TN</AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}
