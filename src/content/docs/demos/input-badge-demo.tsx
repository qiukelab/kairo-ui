import { Badge } from '@/components/ui/badge'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputBadgeDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>
        Webhook URL
        <Badge variant="muted" size="sm" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <FieldControl>
        <Input type="url" placeholder="https://api.example.com/webhook" />
      </FieldControl>
    </Field>
  )
}
