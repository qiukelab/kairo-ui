import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function DropdownMenuCheckboxesDemo() {
  const [columns, setColumns] = useState({ status: true, owner: false })
  const [density, setDensity] = useState('comfortable')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={columns.status}
          // Radix would close the menu on select; toggling several columns in a
          // row is the normal case, so the default is worth overriding here.
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={(checked) => setColumns((prev) => ({ ...prev, status: checked }))}
        >
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.owner}
          onSelect={(event) => event.preventDefault()}
          onCheckedChange={(checked) => setColumns((prev) => ({ ...prev, owner: checked }))}
        >
          Owner
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Density</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
