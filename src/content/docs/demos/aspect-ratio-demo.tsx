import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
        <img src="/placeholder.svg" alt="" className="size-full object-cover" />
      </AspectRatio>
    </div>
  )
}
