import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const plans = [
  { name: 'Starter', seats: 3, price: 0 },
  { name: 'Team', seats: 20, price: 49 },
  { name: 'Business', seats: 100, price: 149 },
]

export default function TableRoundedDemo() {
  return (
    // `overflow-hidden` is what makes the radius real: without it the header
    // and footer fills paint square corners over the rounded frame.
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader className="bg-surface-soft">
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.name}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell className="tabular-nums">{plan.seats}</TableCell>
              <TableCell className="text-right tabular-nums">
                {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>3 plans</TableCell>
            <TableCell className="text-right tabular-nums">from $0</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
