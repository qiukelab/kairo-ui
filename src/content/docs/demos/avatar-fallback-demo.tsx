import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AvatarFallbackDemo() {
  return (
    // The src is deliberately a path that does not exist. Radix drops the <img>
    // from the DOM once it fails, so the fallback is not a layer showing
    // through — it is the only thing left, and the only thing announced.
    <Avatar>
      <AvatarImage src="/avatars/does-not-exist.svg" alt="Malee Kittipong" />
      <AvatarFallback>MK</AvatarFallback>
    </Avatar>
  )
}
