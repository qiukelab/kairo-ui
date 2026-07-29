import { Button } from '@/components/ui/button'
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputFieldGroupDemo() {
  return (
    <form
      className="w-full max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldControl>
            <Input placeholder="Jordan Lee" />
          </FieldControl>
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input type="email" placeholder="name@example.com" />
          </FieldControl>
          <FieldDescription>We&rsquo;ll send updates to this address.</FieldDescription>
        </Field>

        <div className="flex gap-2">
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </FieldGroup>
    </form>
  )
}
