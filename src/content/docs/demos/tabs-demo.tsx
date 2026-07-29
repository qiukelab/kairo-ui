import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
        Update your display name and email address.
      </TabsContent>
      <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
        Change your password. You will be signed out of other devices.
      </TabsContent>
      <TabsContent value="billing" className="pt-3 text-sm text-muted-foreground">
        Manage your plan, payment method and invoices.
      </TabsContent>
    </Tabs>
  )
}
