import { ExternalLink, CalendarDays, ArrowUpRight } from "lucide-react";

interface NotionCalendarEmbedProps {
  url: string;
  title?: string;
  /** Optional context line under the title, e.g. "30 minutes • free". */
  meta?: string;
  /** CTA button label. */
  cta?: string;
}

/**
 * Notion Calendar scheduling links cannot be iframed (their CSP only allows
 * app.notion.com as a frame-ancestor). This renders a prominent CTA card that
 * opens the scheduler in a new tab.
 */
export function NotionCalendarEmbed({
  url,
  title = "Pick a time",
  meta,
  cta = "Open scheduler",
}: NotionCalendarEmbedProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-hairline bg-card p-6 transition-all hover:-translate-y-px hover:shadow-lg sm:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50"
        style={{ background: "radial-gradient(closest-side, hsl(var(--indigo)), transparent)" }}
      />
      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-background text-indigo">
          <CalendarDays className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="font-sans text-lg font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </div>
          {meta && (
            <div className="text-[13px] text-muted-foreground">{meta}</div>
          )}
          <div className="pt-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium text-accent-foreground"
              style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
            >
              {cta}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </span>
          </div>
          <p className="pt-2 text-[11.5px] text-muted-foreground">
            Opens Notion Calendar in a new tab.{" "}
            <span className="inline-flex items-center gap-0.5">
              <ExternalLink className="h-3 w-3" />
            </span>
          </p>
        </div>
      </div>
    </a>
  );
}
