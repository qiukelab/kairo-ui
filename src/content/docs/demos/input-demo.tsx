import { Input } from '@/components/ui/input'

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <Input type="email" placeholder="you@example.com" aria-label="Email" />
      <Input placeholder="Disabled" disabled aria-label="Disabled example" />
      <Input defaultValue="not-an-email" aria-invalid aria-label="Invalid example" />
    </div>
  )
}
