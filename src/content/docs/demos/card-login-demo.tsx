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
import { Field, FieldControl, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function CardLoginDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button variant="link" size="sm" className="px-0">
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldControl>
              <Input type="email" placeholder="m@example.com" />
            </FieldControl>
          </Field>
          <Field>
            {/* FieldLabel takes its `htmlFor` from context, not from its position,
                so it can sit inside a layout row without losing the association. */}
            <div className="flex items-center justify-between gap-2">
              <FieldLabel>Password</FieldLabel>
              <a
                href="#reset"
                className="text-sm underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                Forgot your password?
              </a>
            </div>
            <FieldControl>
              <Input type="password" />
            </FieldControl>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-2 border-t">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  )
}
