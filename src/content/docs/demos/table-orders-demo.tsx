import { AlarmClockIcon, ArrowRightIcon, FileTextIcon, InfoIcon } from 'lucide-react'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const columns = [
  { label: 'Job', info: 'The job this order was placed against' },
  { label: 'Order number', info: null },
  { label: 'Price (THB)', info: null },
  { label: 'Due', info: 'Delivery is counted from the day payment clears' },
  { label: 'Chat', info: null },
]

function HeadInfo({ label }: { label: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="rounded-sm text-muted-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <InfoIcon aria-hidden className="size-3.5" />
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export default function TableOrdersDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
        >
          <AlarmClockIcon className="size-4" />
        </span>
        <div>
          <p className="font-semibold">Orders to ship</p>
          <p className="text-xs text-muted-foreground">0 orders</p>
        </div>
        <a
          href="#orders"
          className="ml-auto inline-flex items-center gap-1 rounded-sm text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          See all
          <ArrowRightIcon aria-hidden className="size-4" />
        </a>
      </div>

      <Table>
        <TableHeader className="bg-surface-soft">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.label}>
                <span className="inline-flex items-center gap-1">
                  {column.label}
                  {column.info && <HeadInfo label={column.info} />}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            {/* One cell across every column. As a sibling of the table this
                would leave a tbody with no rows — see the Empty page. */}
            <TableCell colSpan={columns.length}>
              <Empty className="py-8">
                <EmptyHeader>
                  <EmptyMedia>
                    <FileTextIcon />
                  </EmptyMedia>
                  <EmptyTitle>No orders yet</EmptyTitle>
                  <EmptyDescription>
                    Orders appear here as soon as a customer places one.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
