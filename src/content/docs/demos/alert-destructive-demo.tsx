import { CircleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AlertDestructiveDemo() {
  return (
    <Alert variant="destructive" className="w-full max-w-md">
      <CircleAlertIcon />
      <AlertTitle>Payment could not be processed</AlertTitle>
      <AlertDescription>
        <p>Your card was declined. Try another card, or contact your bank.</p>
      </AlertDescription>
    </Alert>
  )
}
