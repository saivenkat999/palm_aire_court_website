import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import faqsData from '@/data/faqs.json';
import type { FAQ } from '@/types';

interface FAQProps {
  category?: string;
  className?: string;
}

export default function FAQ({ category, className = "" }: FAQProps) {
  const faqs = faqsData as FAQ[];
  
  const filteredFAQs = category 
    ? faqs.filter(faq => faq.category === category)
    : faqs;

  if (filteredFAQs.length === 0) return null;

  return (
    <div className={className} data-testid="faq-section">
      <Accordion type="single" collapsible className="w-full">
        {filteredFAQs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-item-${faq.id}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
