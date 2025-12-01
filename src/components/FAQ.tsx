import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export const FAQ = ({ items, title = "Common Questions" }: FAQProps) => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl mb-12 text-center font-light">
          {title}
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {items.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/20 rounded-xl px-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6 text-lg not-italic">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 pb-6 leading-relaxed not-italic">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
