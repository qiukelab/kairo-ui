import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const invoices = [
  { id: 'INV-001', status: 'Paid', method: 'Card', total: 250 },
  { id: 'INV-002', status: 'Pending', method: 'Transfer', total: 150 },
  { id: 'INV-003', status: 'Unpaid', method: 'Transfer', total: 350 },
]

const tone = {
  Paid: 'soft',
  Pending: 'muted',
  Unpaid: 'destructive',
} as const

export default function TableDemo() {
  return (
    <Table>
      <TableCaption>Invoices for the last quarter.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          {/* Numbers align right so their digits line up column-wise. */}
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.id}</TableCell>
            <TableCell>
              <Badge variant={tone[invoice.status as keyof typeof tone]} size="sm">
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell className="text-right tabular-nums">${invoice.total}.00</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">$750.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
