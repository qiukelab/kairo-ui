import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      {/* Radix renders a button, so the label is associated by id — the same
          as Checkbox, and just as necessary. */}
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  )
}
