import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Field, FieldControl, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes and save when you are done.</DrawerDescription>
          </DrawerHeader>

          <div className="grid gap-4 px-4">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <FieldControl>
                <Input defaultValue="Anong Ratana" />
              </FieldControl>
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <FieldControl>
                <Input defaultValue="@anong" />
              </FieldControl>
            </Field>
          </div>

          <DrawerFooter>
            <Button>Save changes</Button>
            {/* Dragging closes it too, but that is a pointer gesture — a
                keyboard user needs a real control, and Escape. */}
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
