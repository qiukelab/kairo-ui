import { Field, FieldControl, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputFieldDemo() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Username</FieldLabel>
      <FieldControl>
        <Input placeholder="Enter your username" />
      </FieldControl>
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  )
}
