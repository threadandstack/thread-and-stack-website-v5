const credentials = [
  "Notion Certified Consulting Partner",
  "Notion AI Power Hour",
  "Notion Ambassador (UK)",
  "Hosted Notion Developer Platform launch · London",
  "Claude · Cowork integrator",
  "THREAD framework",
];

export function Logos() {
  return (
    <section className="border-b border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-[11.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Credentials &amp; affiliations
        </p>
      </div>
      <div className="relative overflow-hidden pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
        />
        <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap">
          {[...credentials, ...credentials].map((l, i) => (
            <span
              key={`${l}-${i}`}
              className="text-[15px] font-medium tracking-tight text-ink-soft/80"
            >
              {l}
              <span className="ml-12 text-muted-foreground/50">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
