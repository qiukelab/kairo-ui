import { Field, FieldControl, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputRequiredDemo() {
  return (
    <Field required className="w-full max-w-xs">
      <FieldLabel>Required Field</FieldLabel>
      <FieldControl>
        <Input placeholder="This field is required" />
      </FieldControl>
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  )
}
