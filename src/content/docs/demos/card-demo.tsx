import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Invite a teammate</CardTitle>
        <CardDescription>They will get access to this workspace immediately.</CardDescription>
        <CardAction>
          <Badge variant="secondary">Pro</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Input type="email" placeholder="teammate@example.com" aria-label="Email address" />
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost">Cancel</Button>
        <Button>Send invite</Button>
      </CardFooter>
    </Card>
  )
}
