import { Field, FieldControl, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SelectDemo() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel>Timezone</FieldLabel>
      <FieldControl>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ict">Indochina Time (UTC+7)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (UTC+9)</SelectItem>
            <SelectItem value="cet">Central European Time (UTC+1)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (UTC−8)</SelectItem>
          </SelectContent>
        </Select>
      </FieldControl>
      <FieldDescription>Used for scheduling and timestamps.</FieldDescription>
    </Field>
  )
}
