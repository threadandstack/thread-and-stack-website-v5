import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const faqs = [
  {
    q: "Why is the Diagnostic paid?",
    a: "Because it's the work, not the pitch. Ninety minutes live plus a written blueprint within 48 hours. You leave with a plan you could execute alone. The £395 is credited in full against any build you choose afterwards.",
  },
  {
    q: "Why do your build prices look higher than other Notion consultants?",
    a: "Adoption support is included by default. Other quotes look cheaper until the system arrives, the team doesn't use it, and no one is wired in for the questions that surface in week three. Every build here includes training, a Loom library, and 30–90 days of adoption support depending on tier.",
  },
  {
    q: "Will an AI agent put our data or our clients at risk?",
    a: "Notion holds the knowledge. Claude reasons over it through Cowork. It reads and writes in your workspace and does not absorb your data into someone else's model. Custom agents are scoped to specific tasks with permissioned access. No black boxes.",
  },
  {
    q: "Won't building on Notion lock us in?",
    a: "You own the base. Notion is the most open data store of any modern workspace, exportable in standard formats whenever you want. Claude, the agents, and the automations around it are all interchangeable on merit. The architecture survives the tools.",
  },
  {
    q: "Can you migrate us off Monday / ClickUp / Asana / Sheets?",
    a: "Yes. That's most engagements. Migration is mapped in the Diagnostic so you know the cost and what stays vs. goes before anything is touched. Data moves safely. The team trains on the new system before the old one is shut down.",
  },
  {
    q: "What happens after the build is done?",
    a: "Rolling Stack Support. From £495/mo, async access, scaled per half-day, no tie-in, cancel any month. The base keeps growing and the agents keep getting smarter. Most clients stay 6 to 12 months.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq">
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader eyebrow="FAQ">
          Hard <span className="text-clay">questions.</span>
        </SectionHeader>

        <div className="overflow-hidden rounded-2xl border border-hairline bg-background shadow-[0_2px_8px_rgba(0,0,0,0.04)]">

            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-hairline last:border-b-0">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-background"
                  >
                    <span className="text-[15.5px] font-medium tracking-tight text-foreground">{f.q}</span>
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border border-hairline bg-background transition-transform ${
                        isOpen ? "rotate-45 border-indigo text-indigo" : ""
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="max-w-prose px-6 pb-5 text-[14px] leading-relaxed text-ink-soft">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
