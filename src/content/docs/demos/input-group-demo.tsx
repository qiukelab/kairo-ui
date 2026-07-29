import { InfoIcon } from 'lucide-react'

import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupText } from '@/components/ui/input-group'

export default function InputGroupDemo() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel>Website URL</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <FieldControl>
          <Input placeholder="example.com" />
        </FieldControl>
        <InputGroupAddon align="end">
          <InfoIcon aria-hidden />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
