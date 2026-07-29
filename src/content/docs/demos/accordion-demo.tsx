import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    value: 'ownership',
    question: 'Who owns the code after I install a component?',
    answer:
      'You do. The CLI writes the source into your repository, so there is no package to upgrade and nothing stopping you editing it.',
  },
  {
    value: 'theming',
    question: 'Can I change the colours?',
    answer:
      'Every value comes from a CSS custom property in tokens.css. Change the token and every component follows, in both themes.',
  },
  {
    value: 'updates',
    question: 'How do I get later fixes?',
    answer:
      'Run the add command again with --overwrite. Because the files are yours, review the diff first — anything you changed will be replaced.',
  },
]

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="ownership" className="w-full max-w-md">
      {faqs.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
