import { Field, FieldControl, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputFileDemo() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Picture</FieldLabel>
      <FieldControl>
        <Input type="file" accept="image/*" />
      </FieldControl>
      <FieldDescription>Select a picture to upload.</FieldDescription>
    </Field>
  )
}
