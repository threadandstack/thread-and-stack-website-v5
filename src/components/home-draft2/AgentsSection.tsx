import { Bot, BrainCircuit, Workflow, Sparkles } from "lucide-react";

const agentCapabilities = [
  {
    icon: BrainCircuit,
    title: "Reasoning agents",
    description:
      "Agents that understand context, make decisions, and handle complex workflows without constant prompting.",
  },
  {
    icon: Workflow,
    title: "Process automation",
    description:
      "Repetitive tasks handed off to agents that run quietly in the background, freeing your team for higher-order work.",
  },
  {
    icon: Sparkles,
    title: "Embedded in your stack",
    description:
      "Not bolted on — woven into your Notion workspace, your data, and how your team actually works.",
  },
];

/**
 * Agents section — sits below the personal intro on the homepage.
 * Explains how AI agents fit into the Thread & Stack approach.
 */
export function AgentsSection() {
  return (
    <section aria-label="AI agents">
      <div className="mx-auto max-w-5xl px-6 py-14 md:px-10 md:py-20">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_2fr] md:gap-14">
          {/* Left column — headline */}
          <div>
            <span className="mb-4 inline-block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              Agents & Connectivity
            </span>
            <h2 className="font-serif-pro italic font-normal text-balance text-3xl leading-[1.1] tracking-[-0.02em] md:text-[44px]">
              Custom Agents that solve
              <span className="text-clay"> the hassle.</span>
            </h2>
          </div>

          {/* Right column — intro + cards */}
          <div className="max-w-2xl">
            <p className="text-[15.5px] leading-relaxed text-ink-soft">
              The systems I build don't just sit there — they think, watch and do. This means your operating system, your SOPs, your tasks — get where they need to be, without adding pointless busy work. Meaning you and your team can focus on the real value: connecting with customers, creative problem solving, and contributing to those around us.
            </p>

            <p className="mt-4 text-[15.5px] leading-relaxed text-ink-soft">
              Using my own architected THREAD Agent Framework, I design and embed intelligent agents that are token efficient, guardrailed, and targeted.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {agentCapabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="rounded-xl border border-hairline bg-background/60 p-5 backdrop-blur-sm transition-colors hover:bg-background"
                >
                  <cap.icon
                    className="mb-3 h-5 w-5 text-clay"
                    strokeWidth={1.75}
                  />
                  <h3 className="mb-1 text-[14px] font-semibold text-foreground">
                    {cap.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-ink-soft">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Bot className="h-5 w-5 text-ink-soft" strokeWidth={1.75} />
              <p className="text-[13px] italic text-ink-soft">
                Built on the systems your team already uses. No new logins. No
                context switching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
