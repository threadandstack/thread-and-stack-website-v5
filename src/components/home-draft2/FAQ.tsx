import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const faqs = [
  {
    q: "Who is Brendan, and why does this matter?",
    a: "Brendan has spent fifteen years at the intersection of marketing and operations — inside global enterprises like eBay and Dentsu, at small nonprofits where no one person could afford to own just one thing, and at startups where the process and the product were being invented simultaneously. In every context, the same pattern surfaced: organisations with genuine motivation and talented people, quietly held back by the way their knowledge was stored, shared, and lost. Operations, more than strategy or ambition, tends to be the real blocker to growth — and having led marketing while almost always inheriting the operational infrastructure around it, he knows how inseparable those two things are in practice. He is a certified Notion Consulting Partner and an Official Notion Ambassador, and built Thread and Stack to bring that full span of experience to the problem most consultancies quietly ignore.",
  },
  {
    q: "Who is Thread and Stack actually built for?",
    a: "Five to fifty-person teams who have outgrown the stack they started with. Usually there is a leader who has quietly become the routing layer — every decision passes through them because no one else has the context to act independently. The work here is to build the information architecture that changes that: a knowledge base that grows in value as the team does, reduces cognitive load, and gives people back the time to do their best work. Most clients come from purpose-led sectors — health, education, communities, impact organisations — though the operational challenge is largely universal.",
  },
  {
    q: "Why do we need a single knowledge hub? We already have folders.",
    a: "When knowledge is structured intentionally and connected properly, it gets more useful over time rather than more outdated. Teams operate with greater confidence. Leaders have access to more cohesive strategy. The business itself becomes more valuable — structurally, and in terms of what it is actually worth when the knowledge it holds is no longer locked inside the heads of people who might leave. You may already have folders, or a system that is fragmented but technically functional. What you may also have is a leader acting as the router for everything — the person all decisions pass through because no one else has the full picture. A genuine centre of truth is what makes that problem structural rather than personal, and fixable rather than permanent.",
  },
  {
    q: "Won't building on Notion lock us in?",
    a: "First: Thread and Stack workspaces are designed to survive any individual tool in them. What your organisation should own is not a platform membership — it is the quality of its thinking and the structure it has built. That survives everything. On Notion specifically: like every major platform it exists within a commercial reality, and yet it locks you in less than almost anything else on the market. Notion has become known for a genuinely porous philosophy — inviting other tools into its ecosystem rather than closing them out. It exports to standard formats, connects openly with external services, and treats integrations as a feature rather than a threat. Every agent and automation built around your workspace is chosen on merit and is interchangeable. The architecture is built to outlast the tools.",
  },
  {
    q: "What is the Stack Diagnostic, and why is it paid?",
    a: "Because it is the work, not the pitch. It is a 90 to 120 minute working session where we map every operational challenge facing your team right now — tools, data, decision-making, the places where growth is quietly being strangled by process. Within 48 hours, you receive a written blueprint: a full picture of what is holding you back and what a solution would actually involve. You could take that and execute it yourself. Most people choose not to, but the point is it has real standalone value. The Diagnostic fee is credited in full against any build that follows.",
  },
  {
    q: "Can you migrate us off Monday / ClickUp / Asana / Sheets?",
    a: "Yes. That is most engagements. Migration is mapped during the Diagnostic so before anything is touched, you know what stays, what goes, what the sequence looks like, and what it costs. Data moves safely, and the team trains on the new system before the old one is switched off. One distinction worth naming: there is a difference between data migration and data digitisation. If significant materials still exist on paper or in formats that need converting before they can move, that is scoped separately — it is handled carefully and priced on a case-by-case basis. If that is relevant to your situation, it is worth raising on the first call.",
  },
  {
    q: "I'm cautious about AI and data security. How do you handle that?",
    a: "Carefully and with genuine scrutiny. Every tool recommended here is assessed against an intentional framework that covers GDPR compliance, data residency, security posture, and — increasingly — sustainability and ethical considerations. No tool enters the stack on convenience alone. I am opinionated about tool stacks, but honest about the fact that even people who follow this space closely struggle to keep up. Policies change, ownerships shift, and what was safe last year may warrant a second look this year. That is why there is a standing practice of maintaining a running record of every tool in use, and routinely searching for new learnings about each one. The aim is not to claim certainty — it is to stay genuinely on top of it. For AI agents specifically: they are scoped to specific tasks with permissioned access only. Your data sits in Notion, which you own and control. Any AI working across it reads and writes within your workspace — it does not absorb your data into a third-party model or use it for training. The choice of which AI providers to work with is always yours. The architecture is model-agnostic by design.",
  },
  {
    q: "What does the relationship look like once the build is done?",
    a: "Something interesting happens when a build is complete: we enter adoption, and adoption surfaces problems that could not have been foreseen during the build phase. That period matters. It is where I stay close — helping the team settle into the new way of working, fixing what needs fixing, and making sure no one gets stranded by a part of the system they do not yet understand. Once adoption is genuinely underway, something shifts. Tasks start flowing. Decisions that used to bottleneck start resolving. The team starts behaving differently in ways that are hard to predict in advance but are unmistakable when they arrive. And a natural question follows: what can we do next? That is where the longer relationship becomes genuinely creative. Systems built for specific functions — content ops, revenue ops, marketing, customer onboarding, website integrations — and the gradual expansion of what the agents can do. Async support, scaled to your rhythm, no tie-in, cancel any month. The base keeps growing. Most clients stay six to twelve months, not because they have to, but because there is always a meaningful next horizon.",
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

        <p className="mt-10 text-center text-[14.5px] text-ink-soft">
          Still curious? Email{" "}
          <a
            href="mailto:br@brendanrodgers.uk"
            className="text-foreground underline decoration-indigo decoration-2 underline-offset-4 hover:decoration-foreground"
          >
            br@brendanrodgers.uk
          </a>.
        </p>
      </div>
    </section>
  );
}
