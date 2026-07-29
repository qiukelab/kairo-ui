import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CardImageDemo() {
  return (
    // `pt-0` drops the card's top inset so the image starts at the edge, and
    // `overflow-hidden` clips its corners to the card's radius.
    <Card className="w-full max-w-sm overflow-hidden pt-0">
      <img
        src="/placeholder.svg"
        alt=""
        className="aspect-video w-full object-cover"
        width={1200}
        height={675}
      />
      <CardHeader>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping faster.
        </CardDescription>
        <CardAction>
          <Badge variant="soft">Featured</Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="border-t">
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  )
}
