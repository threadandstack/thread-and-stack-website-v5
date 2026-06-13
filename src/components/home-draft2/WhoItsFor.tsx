import { Link } from "react-router-dom";

const audiences = [
  {
    title: "Your marketing no longer feels like you.",
    description:
      "The brand made sense when you started. Now it doesn't. Your values and ambition have shifted, but your story still speaks in an older voice. You need clarity, updated language, and direction that reflect who you are today.",
    linkText: "Explore narrative realignment",
    linkUrl: "/narratives-strategy",
    tag: "Narrative",
    tagClass: "bg-orange-100 text-orange-700",
  },
  {
    title: "You're working harder but it's not compounding.",
    description:
      "You've hired the right specialists — an agency, a freelancer, a website provider — but nobody owns the whole picture. Your GTM strategy is overwhelmed by fragmentation. The work isn't landing where it should.",
    linkText: "See how integration changes the game",
    linkUrl: "/how-i-work",
    tag: "Strategy",
    tagClass: "bg-pink-100 text-pink-700",
  },
  {
    title: "You can feel the leakage but can't see it.",
    description:
      "You know there's a cost somewhere. Your marketing, brand, and operations grew up separately and they aren't talking to each other. The founder is absorbing increasing risk from disconnected signals.",
    linkText: "Discover the systems layer",
    linkUrl: "/notion-systems",
    tag: "Systems",
    tagClass: "bg-blue-100 text-blue-700",
  },
] as const;

export function WhoItsFor() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif-pro italic font-normal max-w-3xl text-balance text-5xl leading-[1.05] tracking-[-0.02em] md:text-[64px]">
              For makers, founders, <span className="text-clay">and teams.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] text-ink-soft">
            Three signals that the gap between intention and execution has become too costly to leave alone.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <article
              key={a.title}
              className="flex flex-col rounded-2xl border border-hairline bg-background p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium ${a.tagClass}`}
                >
                  {a.tag}
                </span>
              </div>

              <h3 className="font-serif-pro italic text-[26px] leading-tight">
                {a.title}
              </h3>

              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                {a.description}
              </p>

              <Link
                to={a.linkUrl}
                className="mt-6 inline-flex items-center text-[13px] italic text-indigo hover:text-indigo/80 transition-colors"
              >
                {a.linkText} →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
