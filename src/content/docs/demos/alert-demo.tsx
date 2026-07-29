import { RocketIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AlertDemo() {
  return (
    <Alert className="w-full max-w-md">
      <RocketIcon />
      <AlertTitle>Deployment finished</AlertTitle>
      <AlertDescription>
        kairo-ui v0.1.0 is live. It may take a minute to reach every edge region.
      </AlertDescription>
    </Alert>
  )
}
