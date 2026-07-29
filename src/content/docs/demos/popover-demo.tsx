import { Button } from '@/components/ui/button'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set dimensions</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-1">
            <p className="font-medium">Dimensions</p>
            <p className="text-sm text-muted-foreground">Set the layer size in pixels.</p>
          </div>
          <div className="grid gap-2">
            <Field orientation="horizontal">
              <FieldLabel className="w-16">Width</FieldLabel>
              <FieldControl>
                <Input defaultValue="100" className="h-8 flex-1" />
              </FieldControl>
            </Field>
            <Field orientation="horizontal">
              <FieldLabel className="w-16">Height</FieldLabel>
              <FieldControl>
                <Input defaultValue="24" className="h-8 flex-1" />
              </FieldControl>
            </Field>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
