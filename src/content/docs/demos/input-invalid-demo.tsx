import { Field, FieldControl, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputInvalidDemo() {
  return (
    <Field invalid className="w-full max-w-xs">
      <FieldLabel>Invalid Input</FieldLabel>
      <FieldControl>
        <Input defaultValue="Error" />
      </FieldControl>
      <FieldError>This field contains validation errors.</FieldError>
    </Field>
  )
}
