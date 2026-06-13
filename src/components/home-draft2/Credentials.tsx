import { Shield, Bot } from "lucide-react";
import notionBadges from "@/assets/notion-badges.png";

export function Credentials() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-background p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo/15 text-indigo">
                <Shield className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-medium tracking-tight">
                Notion <span className="font-serif-pro italic text-clay">Certified</span>
              </h3>
            </div>

            <div className="mb-6 overflow-hidden rounded-lg">
              <img
                src={notionBadges}
                alt="Notion certifications: Academy Essentials, Workflows, Advanced, AI, Certified Admin, Service Specialist, Consulting Partner"
                className="h-auto w-full"
              />
            </div>

            <p className="text-[14.5px] leading-relaxed text-ink-soft">
              Certified Notion Admin and official Notion Ambassador. One of a small group
              globally recognised by Notion for workspace design, workflow automation, and
              systems strategy.
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-background p-8 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet/15 text-violet">
                <Bot className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-medium tracking-tight">
                Fluent in <span className="font-serif-pro italic text-clay">AI frameworks</span>
              </h3>
            </div>

            <p className="mb-6 text-[14.5px] leading-relaxed text-ink-soft">
              Anthropic AI Fluency &amp; Foundations certificate and Notion AI Workflows badge.
              Thread &amp; Stack runs as an AI-first business, weaving AI into strategy,
              operations, and creative workflows to give teams back time, attention, and voice.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Anthropic AI Fluency & Foundations",
                "Notion AI Workflows",
                "AI-First Business",
              ].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] font-medium text-ink-soft"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
