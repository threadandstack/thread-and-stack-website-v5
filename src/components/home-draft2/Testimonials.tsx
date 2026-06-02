const testimonials = [
  {
    quote:
      "This Notion Mentorship sprint has been genuinely transformative for me. In just a few weeks, I significantly upped my productivity and efficiency — not just in how much I get done, but in how clearly I can show the value of my work.",
    name: "Jasmine Stone",
    role: "Marketing Manager",
    initials: "JS",
  },
  {
    quote:
      "Brendan is like a Swiss army knife when it comes to marketing — strategic and hands-on. He helped me build a system that actually works for The IMMA Collective, I've now got real peace of mind, a clear vision for the business, and marketing that feels properly joined up.",
    name: "Lilli Graf",
    role: "Founder, The IMMA Collective",
    initials: "LG",
  },
  {
    quote:
      "Brendan has been a dream. His support totally invigorated us. We've made more progress in the last couple of months than we had in the previous year.",
    name: "Alex Aggidis",
    role: "Head of Marketing, Fundraising Everywhere",
    initials: "AA",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
              What clients say
            </div>
            <h2 className="font-sans not-italic mt-5 max-w-2xl text-4xl font-medium leading-[1.03] tracking-[-0.025em] md:text-[56px]">
              Receipts, not <span className="font-serif-pro italic text-clay">promises.</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="text-[14px] font-medium text-foreground underline decoration-indigo decoration-2 underline-offset-4 hover:decoration-foreground"
          >
            Talk to a past client →
          </a>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between gap-8 bg-background p-8"
            >
              <blockquote className="font-serif-pro italic text-[26px] leading-[1.2] text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 text-[13px]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-[12px] font-medium text-background">
                  {t.initials}
                </span>
                <span>
                  <span className="block font-medium text-foreground">{t.name}</span>
                  <span className="text-muted-foreground">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
