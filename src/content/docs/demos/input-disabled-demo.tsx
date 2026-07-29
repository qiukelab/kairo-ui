import { Field, FieldControl, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputDisabledDemo() {
  return (
    <Field disabled className="w-full max-w-xs">
      <FieldLabel>Email</FieldLabel>
      <FieldControl>
        <Input type="email" placeholder="Email" />
      </FieldControl>
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  )
}
