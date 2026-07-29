import { ChevronRightIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const points = [
  'Choose a schedule (daily, or weekly).',
  'Send to channels or specific teammates.',
  'Include charts, tables, and key metrics.',
]

export default function CardSmDemo() {
  return (
    <Card size="sm" className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Scheduled reports</CardTitle>
        <CardDescription>Weekly snapshots. No more manual exports.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm">
          {points.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
              {point}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t">
        <Button className="w-full">Set up scheduled reports</Button>
        <Button variant="outline" className="w-full">
          See what&rsquo;s new
        </Button>
      </CardFooter>
    </Card>
  )
}
