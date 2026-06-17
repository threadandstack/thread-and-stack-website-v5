import { useState } from "react";
import { ExternalLink, Loader2, CalendarDays } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

interface NotionCalendarEmbedProps {
  url: string;
  title?: string;
  height?: number;
}

/**
 * Embeds a Notion Calendar scheduling link in an iframe.
 * Provides an "Open in new tab" fallback in case the embed is blocked
 * by the browser or Notion's frame-ancestor policy.
 */
export function NotionCalendarEmbed({
  url,
  title = "Pick a time",
  height = 720,
}: NotionCalendarEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wider text-ink-soft">
          <CalendarDays className="h-3.5 w-3.5 text-indigo" strokeWidth={2} />
          {title}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-indigo underline-offset-4 hover:underline"
        >
          Open in new tab <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-hairline bg-card"
        style={{ height }}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        <iframe
          src={url}
          title={title}
          onLoad={() => setLoaded(true)}
          className="h-full w-full"
          style={{ border: 0 }}
          allow="clipboard-write"
        />
      </div>

      <p className="text-[11.5px] text-muted-foreground">
        Trouble loading?{" "}
        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
          Open the booking page in a new tab
        </a>
        .
      </p>
    </div>
  );
}
