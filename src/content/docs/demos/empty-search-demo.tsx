import { SearchXIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export default function EmptySearchDemo() {
  return (
    // "Nothing matches this filter" is a different state from "nothing exists",
    // and the action that resolves it is different too: clear the filter, not
    // create a record. Saying "No projects yet" here would be a lie.
    <Empty className="w-full max-w-sm rounded-lg border border-dashed border-input">
      <EmptyHeader>
        <EmptyMedia>
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>No results for &ldquo;polaris&rdquo;</EmptyTitle>
        <EmptyDescription>Check the spelling, or search for something broader.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  )
}
