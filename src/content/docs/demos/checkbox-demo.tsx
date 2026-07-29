import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      {/* Radix renders a button, not an <input>, so the association is by id
          rather than by wrapping — and without it the box has no name at all. */}
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  )
}
