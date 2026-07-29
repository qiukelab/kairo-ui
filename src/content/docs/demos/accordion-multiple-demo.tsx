import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function AccordionMultipleDemo() {
  return (
    <Accordion type="multiple" defaultValue={['shipping']} className="w-full max-w-md">
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Orders leave the warehouse within two business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Unopened items can be returned within thirty days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">
          Replies arrive within one business day, in Thai or English.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
