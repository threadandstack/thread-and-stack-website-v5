import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarDays } from "lucide-react";

interface CalEmbedProps {
  /** e.g. "thread-and-stack/stack-diagnostic-session" */
  calLink: string;
  /** Namespace for the Cal instance, unique per event type. */
  namespace: string;
  title?: string;
  meta?: string;
  /** Prefill values from the checkout session. */
  name?: string | null;
  email?: string | null;
}

/**
 * Inline Cal.com scheduler. Cal.com allows iframing, so we render the booker
 * directly on the page instead of bouncing the visitor to a new tab.
 */
export function CalEmbed({
  calLink,
  namespace,
  title = "Pick a time",
  meta,
  name,
  email,
}: CalEmbedProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace });
      if (cancelled) return;
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#ff007e" },
          dark: { "cal-brand": "#ff8900" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [namespace]);

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="flex items-start gap-4 border-b border-hairline p-5 sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-background text-indigo">
          <CalendarDays className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="font-sans text-lg font-semibold leading-tight tracking-tight text-foreground">
            {title}
          </div>
          {meta && <div className="text-[13px] text-muted-foreground">{meta}</div>}
        </div>
      </div>
      <div className="relative min-h-[560px]">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading the calendar…
          </div>
        )}
        <Cal
          namespace={namespace}
          calLink={calLink}
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            ...(name ? { name } : {}),
            ...(email ? { email } : {}),
          }}
        />
      </div>
      <div className="border-t border-hairline px-5 py-3 text-[11.5px] text-muted-foreground sm:px-6">
        Trouble loading?{" "}
        <a
          href={`https://cal.com/${calLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Open the scheduler in a new tab
        </a>
        .
      </div>
    </div>
  );
}
