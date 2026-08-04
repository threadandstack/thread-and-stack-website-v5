import { useEffect, useRef, useState } from "react";
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

declare global {
  interface Window {
    Cal?: any;
  }
}

/** Loads Cal.com's embed script once and returns the global Cal function. */
function loadCal(): any {
  const C = window as any;
  if (!C.Cal) {
    const d = document;
    C.Cal = function () {
      const cal = C.Cal;
      const ar = arguments as any;
      const p = (a: any, args: any) => a.q.push(args);
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const s = d.createElement("script");
        s.src = "https://app.cal.com/embed/embed.js";
        d.head.appendChild(s);
        cal.loaded = true;
      }
      if (ar[0] === "init") {
        const api = function () {
          p(api, arguments);
        };
        (api as any).q = (api as any).q || [];
        const ns = ar[1];
        if (typeof ns === "string") {
          cal.ns[ns] = cal.ns[ns] || api;
          p(cal.ns[ns], ar);
          p(cal, ["initNamespace", ns]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  }
  return C.Cal;
}

/**
 * Inline Cal.com scheduler. Cal.com allows iframing, so the booker renders
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
  const containerId = `cal-inline-${namespace}`;
  const initialised = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const Cal = loadCal();
    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;

    Cal.ns[namespace]("inline", {
      elementOrSelector: `#${containerId}`,
      config: {
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
      calLink,
    });

    Cal.ns[namespace]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#ff007e" },
        dark: { "cal-brand": "#ff8900" },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    Cal.ns[namespace]("on", {
      action: "linkReady",
      callback: () => setReady(true),
    });
  }, [calLink, namespace, containerId, name, email]);

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
      <div className="relative min-h-[620px]">
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading the calendar…
          </div>
        )}
        <div id={containerId} style={{ width: "100%", height: "100%", overflow: "scroll" }} />
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
