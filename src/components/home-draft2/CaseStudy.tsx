const stats = [
  { v: "−40%", l: "Internal meetings", d: "after lake + agents shipped" },
  { v: "£82", l: "Monthly infra", d: "down from ~£640 across 7 tools" },
  { v: "94%", l: "Team adoption", d: "measured at day 30" },
  { v: "1", l: "Source of truth", d: "Notion replaced 6 walled gardens" },
];

export function CaseStudy() {
  return (
    <section
      id="work"
      className="relative overflow-hidden border-b border-hairline bg-ink text-foreground"
    >
      <div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11.5px] uppercase tracking-wider text-foreground/70">
              Case study · London School of Sailing
            </div>
            <h2 className="mt-5 text-4xl font-medium leading-[1.05] tracking-[-0.025em] md:text-[56px]">
              We replaced 7 tools with{" "}
              <span className="font-serif-pro italic text-clay-soft">one lake.</span>
            </h2>
            <p className="mt-6 max-w-lg text-[15.5px] leading-relaxed text-foreground/70">
              LSS came in with Monday, Squarespace, WhatsApp, Sheets, and three more —
              knowledge scattered, the leadership team routing every question by hand.
              We built the lake in their Notion, wired Claude over it with Cowork, and
              shipped two custom agents for booking triage and invoice capture.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="#contact"
                className="inline-flex h-11 items-center rounded-md bg-background px-5 text-[14px] font-medium text-foreground transition-transform hover:-translate-y-px"
              >
                Book the Diagnostic →
              </a>
              <a
                href="#how"
                className="inline-flex h-11 items-center rounded-md border border-white/20 px-5 text-[14px] font-medium text-foreground/90 transition-colors hover:bg-white/[0.06]"
              >
                See the architecture
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12">
            {stats.map((s) => (
              <div key={s.l} className="bg-ink p-6 md:p-7">
                <div className="font-serif-pro italic text-[44px] leading-none text-clay-soft md:text-[56px]">
                  {s.v}
                </div>
                <div className="mt-3 text-[13.5px] font-medium text-foreground">{s.l}</div>
                <div className="mt-1 text-[12px] text-foreground/55">{s.d}</div>
              </div>
            ))}
          </div>
        </div>

        <figure className="mt-14 max-w-3xl border-l-2 border-indigo pl-6">
          <blockquote className="font-serif-pro italic text-2xl leading-snug text-foreground md:text-[32px]">
            "Thread &amp; Stack didn't sell us Notion. They sold us back the
            evenings and weekends our leadership team was losing to admin."
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3 text-[13px] text-foreground/60">
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold text-accent-foreground"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--indigo)), hsl(var(--orange)))" }}
            >
              RP
            </span>
            <span>
              <span className="text-foreground">Ruaraidh Plummer</span> —
              Principal, London School of Sailing
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
