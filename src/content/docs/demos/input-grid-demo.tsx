import { Field, FieldControl, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputGridDemo() {
  return (
    <FieldGroup className="w-full max-w-md gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <FieldControl>
          <Input placeholder="Jordan" />
        </FieldControl>
      </Field>

      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl>
          <Input placeholder="Lee" />
        </FieldControl>
      </Field>
    </FieldGroup>
  )
}
