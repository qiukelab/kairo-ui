import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const scopes = ['Read', 'Write', 'Delete']

export default function CheckboxIndeterminateDemo() {
  const [checked, setChecked] = useState<string[]>(['Read'])

  // Three states, because "some" is not "all" and not "none". Radix reports
  // this one as aria-checked="mixed".
  const all = checked.length === scopes.length
  const parent = all ? true : checked.length > 0 ? 'indeterminate' : false

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="scopes-all"
          checked={parent}
          onCheckedChange={() => setChecked(all ? [] : scopes)}
        />
        <Label htmlFor="scopes-all">All permissions</Label>
      </div>

      <div className="flex flex-col gap-2 border-l border-border-soft pl-4">
        {scopes.map((scope) => (
          <div key={scope} className="flex items-center gap-2">
            <Checkbox
              id={`scope-${scope}`}
              checked={checked.includes(scope)}
              onCheckedChange={(value) =>
                setChecked((current) =>
                  value ? [...current, scope] : current.filter((item) => item !== scope),
                )
              }
            />
            <Label htmlFor={`scope-${scope}`}>{scope}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
