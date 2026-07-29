import { FileTextIcon, PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const columns = ['Order', 'Reference', 'Amount', 'Due']

export default function TableEmptyDemo() {
  return (
    <Table className="w-full max-w-lg">
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-transparent">
          {/* The empty state lives in a cell spanning every column. Rendering it
              as a sibling of the table would leave a tbody with no rows, which
              is invalid and reads to a screen reader as a table of nothing. */}
          <TableCell colSpan={columns.length}>
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileTextIcon />
                </EmptyMedia>
                <EmptyTitle>No orders yet</EmptyTitle>
                <EmptyDescription>
                  Orders appear here as soon as a customer places one.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button size="sm">
                  <PlusIcon />
                  New order
                </Button>
              </EmptyContent>
            </Empty>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
