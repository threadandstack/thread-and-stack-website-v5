import { Link } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";

interface WhoItsForProps {
  onBookDiagnostic?: () => void;
}

interface SignItem {
  title: string;
  description: string;
  linkText: string;
  linkUrl?: string;
  action?: "diagnostic";
  tag: string;
  tagClass: string;
}

const signs: SignItem[] = [
  {
    title: "The business is working. The system isn't ready to scale with it.",
    description:
      "Revenue is growing. The team is capable. But you've quietly hit a ceiling that has nothing to do with talent or ambition — the infrastructure can't hold the weight of what's coming next. You could take on more clients tomorrow. You're choosing not to, because you know the current setup would crack under the pressure. You've paused to fix it before something breaks rather than after. That's the right instinct. This is exactly where we start.",
    linkText: "See how the build works →",
    linkUrl: "/how-i-work",
    tag: "Sign 01",
    tagClass: "bg-orange-100 text-orange-700",
  },
  {
    title:
      "Your team is fragmented across tools, folders, and spreadsheets — and it's slowing everything down.",
    description:
      "The information exists. It's just not in one place, and nobody's quite sure which version is current. Something lives in Slack, something else in a Google Drive folder nobody's opened in three months, and the thing you actually need is in someone's inbox. The team isn't the problem. The fragmentation is. When everything is scattered, every task costs more effort than it should — and the people absorbing that cost are the ones who can least afford to.",
    linkText: "Start with a diagnostic →",
    action: "diagnostic",
    tag: "Sign 02",
    tagClass: "bg-pink-100 text-pink-700",
  },
  {
    title: "You serve a lot of people, and they all need their own way in.",
    description:
      "Clients, members, collaborators, beneficiaries — the people your organisation exists to serve need to see something. Their progress, their documents, their status, their slice of what's happening. Right now that probably means email threads, shared folders, or manually assembled updates that someone has to chase. A workspace that reaches beyond the building — with client portals, community spaces, and external-facing interfaces built in from the start — changes what your service actually feels like to receive.",
    linkText: "See what an external-facing build looks like →",
    linkUrl: "/notion-systems",
    tag: "Sign 03",
    tagClass: "bg-blue-100 text-blue-700",
  },
];

export function WhoItsFor({ onBookDiagnostic }: WhoItsForProps) {
  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader eyebrow="Which one of these is you?">
          Three signs it's <span className="text-clay">time.</span>
        </SectionHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {signs.map((s) => (
            <article
              key={s.title}
              className="flex flex-col items-center rounded-2xl border border-hairline bg-background p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-5">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium ${s.tagClass}`}
                >
                  {s.tag}
                </span>
              </div>

              <h3 className="font-serif-pro italic text-[24px] leading-tight">
                {s.title}
              </h3>

              <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                {s.description}
              </p>

              {s.action === "diagnostic" && onBookDiagnostic ? (
                <button
                  onClick={onBookDiagnostic}
                  className="mt-6 inline-flex items-center text-[13px] italic text-indigo hover:text-indigo/80 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {s.linkText}
                </button>
              ) : (
                <Link
                  to={s.linkUrl!}
                  className="mt-6 inline-flex items-center text-[13px] italic text-indigo hover:text-indigo/80 transition-colors"
                >
                  {s.linkText}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
