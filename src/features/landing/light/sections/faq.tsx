import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faq } from "@/features/landing/content"

import { Section } from "../primitives"
import { SectionIntro } from "../section-intro"

export function Faq() {
  return (
    <Section id="faq" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <SectionIntro
          id="faq-title"
          eyebrow={faq.eyebrow}
          title={faq.title}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <Accordion className="border-y border-border">
          {faq.items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="gap-4 py-5 text-base font-medium transition-colors hover:text-brand hover:no-underline sm:text-[1.0625rem]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-prose pb-5 text-base leading-relaxed text-muted-foreground">
                <p>{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  )
}
