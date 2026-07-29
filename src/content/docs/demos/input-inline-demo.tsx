import { Button } from '@/components/ui/button'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputInlineDemo() {
  return (
    <Field orientation="horizontal" className="w-full max-w-sm">
      <FieldLabel className="sr-only">Search</FieldLabel>
      <FieldControl>
        <Input type="search" placeholder="Search..." className="flex-1" />
      </FieldControl>
      <Button type="submit">Search</Button>
    </Field>
  )
}
