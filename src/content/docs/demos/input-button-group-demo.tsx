import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function InputButtonGroupDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Search</FieldLabel>
      <ButtonGroup>
        <FieldControl>
          <Input type="search" placeholder="Type to search..." />
        </FieldControl>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </ButtonGroup>
    </Field>
  )
}
