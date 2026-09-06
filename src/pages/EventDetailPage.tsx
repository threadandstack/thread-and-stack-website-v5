import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Loader2,
  MapPin,
  Moon,
  Presentation,
  Sun,
  Video,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/home-draft2/CTA";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHtml } from "@/lib/sanitize";
import { EventItem, formatEventDateRange, isUpcoming } from "@/lib/journalFeed";

interface EventFull extends EventItem {
  htmlContent?: string | null;
  ogImage?: string | null;
}

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("fetch-events", {
        body: { slug },
      });
      if (error) console.error("Error loading event:", error);
      const e = data?.event;
      setEvent(
        e
          ? ({
              kind: "event",
              id: e.id,
              date: e.startDate || null,
              slug: e.slug,
              title: e.title,
              summary: e.summary ?? null,
              coverImage: e.coverImage ?? null,
              ogImage: e.ogImage ?? null,
              role: e.role ?? null,
              format: e.format ?? null,
              startDate: e.startDate ?? null,
              endDate: e.endDate ?? null,
              location: e.location ?? null,
              venue: e.venue ?? null,
              organiser: e.organiser ?? null,
              topics: e.topics || [],
              eventUrl: e.eventUrl ?? null,
              slidesUrl: e.slidesUrl ?? null,
              recordingUrl: e.recordingUrl ?? null,
              featured: !!e.featured,
              htmlContent: e.htmlContent ?? null,
            } as EventFull)
          : null
      );
      setIsLoading(false);
    };
    if (slug) load();
  }, [slug]);

  const links = [
    event?.eventUrl && { href: event.eventUrl, label: "Event page", Icon: ExternalLink },
    event?.slidesUrl && { href: event.slidesUrl, label: "Slides", Icon: Presentation },
    event?.recordingUrl && { href: event.recordingUrl, label: "Recording", Icon: Video },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof ExternalLink }[];

  return (
    <>
      <Helmet>
        <title>{event ? `${event.title} | Events` : "Event"} | Thread &amp; Stack</title>
        <meta name="description" content={eventDescription} />
        <link rel="canonical" href={eventCanonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${event?.title || "Event"} | Events`} />
        <meta property="og:description" content={eventDescription} />
        <meta property="og:image" content={eventShareImage} />
        <meta property="og:url" content={eventCanonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${event?.title || "Event"} | Events`} />
        <meta name="twitter:description" content={eventDescription} />
        <meta name="twitter:image" content={eventShareImage} />
      </Helmet>

      <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
        <Navigation
          variant={theme === "dark" ? "image-hero" : "default"}
          themeToggle={
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/60 text-foreground/70 backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          }
        />

        <main className="pb-10 pt-32 md:pt-40">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              to="/journal?type=events"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : !event ? (
              <p className="py-24 text-center text-muted-foreground">
                This event hasn't been published yet.
              </p>
            ) : (
              <>
                <header className="mt-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px]">
                    {isUpcoming(event) && (
                      <span className="rounded-full bg-tertiary/15 px-2.5 py-0.5 font-medium text-tertiary">
                        Upcoming
                      </span>
                    )}
                    {event.role && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
                        {event.role}
                      </span>
                    )}
                    {event.format && (
                      <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-muted-foreground">
                        {event.format}
                      </span>
                    )}
                  </div>

                  <h1 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
                    {event.title}
                  </h1>

                  {event.summary && (
                    <p className="mt-6 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
                      {event.summary}
                    </p>
                  )}
                </header>

                {event.coverImage && (
                  <div className="mt-10 overflow-hidden rounded-2xl">
                    <img src={event.coverImage} alt={event.title} className="w-full object-cover" />
                  </div>
                )}

                {/* Event detail card */}
                <div className="mt-10 grid gap-4 rounded-2xl bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-muted-foreground">When</p>
                    <p className="mt-1 text-[15px] tabular-nums">
                      {formatEventDateRange(event.startDate, event.endDate)}
                    </p>
                  </div>
                  {(event.location || event.venue) && (
                    <div>
                      <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                        Where
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[15px]">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {[event.venue, event.location].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  )}
                  {event.organiser && (
                    <div>
                      <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                        Organiser
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-[15px]">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {event.organiser}
                      </p>
                    </div>
                  )}
                  {event.topics.length > 0 && (
                    <div>
                      <p className="text-[12px] uppercase tracking-wider text-muted-foreground">
                        Topics
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {event.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-muted px-2.5 py-0.5 text-[12.5px] text-muted-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {links.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-colors hover:bg-muted"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </a>
                    ))}
                  </div>
                )}

                {event.htmlContent && (
                  <div
                    className="blog-content prose prose-lg mt-10 max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.htmlContent) }}
                  />
                )}
              </>
            )}
          </div>

          <div className="mt-20">
            <CTA theme={theme} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EventDetailPage;
