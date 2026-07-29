import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CardEdgeToEdgeDemo() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Terms of Service</CardTitle>
        <CardDescription>Review the terms before accepting the agreement.</CardDescription>
      </CardHeader>
      {/*
        `-mx-(--card-spacing)` cancels the card's own inset so the scroll region
        reaches both edges, and `-mb-(--card-spacing)` closes the gap the card
        would otherwise put between this section and the footer — leaving the
        region's own hairline as the only line between them.
      */}
      <CardContent className="-mx-(--card-spacing) -mb-(--card-spacing)">
        <div className="max-h-48 space-y-4 overflow-y-auto border-y border-border-soft px-(--card-spacing) py-4 text-sm">
          <p>
            These terms govern your use of the workspace, including access to shared documents,
            project files, and collaboration tools.
          </p>
          <p>
            You are responsible for the content you upload and for ensuring that your team has the
            appropriate permissions to view or edit it.
          </p>
          <p>
            We may update these terms as the product changes. Material updates are announced in the
            workspace at least thirty days before they take effect.
          </p>
          <p>
            Accounts inactive for twelve months may be archived. Archived data stays recoverable for
            a further ninety days.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 pt-(--card-spacing)">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </CardFooter>
    </Card>
  )
}
