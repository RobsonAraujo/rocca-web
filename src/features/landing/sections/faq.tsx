import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { faq } from "../content"
import { SectionHeading } from "../components/section-heading"

export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />

      <Accordion className="mx-auto mt-12 max-w-2xl">
        {faq.items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="py-4 text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
