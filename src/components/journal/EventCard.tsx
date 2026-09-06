import { Link } from "react-router-dom";
import { MapPin, Mic, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EventItem, formatEventDateRange, isUpcoming } from "@/lib/journalFeed";

const ROLE_STYLES: Record<string, string> = {
  Hosted: "bg-magenta/15 text-magenta",
  Spoke: "bg-violet/20 text-violet",
  Panel: "bg-orange/20 text-orange",
  Attended: "bg-muted text-muted-foreground",
};

const monthShort = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { month: "short" });
};

const dayNumber = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : String(d.getDate());
};

export const EventCard = ({ event }: { event: EventItem }) => {
  const upcoming = isUpcoming(event);

  return (
    <Link to={`/journal/events/${event.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        {event.coverImage && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={event.coverImage}
              alt={event.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex gap-4 p-6">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-muted text-center leading-none">
            <span className="text-lg font-semibold tabular-nums">{dayNumber(event.startDate)}</span>
            <span className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              {monthShort(event.startDate)}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
              {upcoming && (
                <span className="rounded-full bg-tertiary/15 px-2.5 py-0.5 font-medium text-tertiary">
                  Upcoming
                </span>
              )}
              {event.role && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${
                    ROLE_STYLES[event.role] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {event.role === "Attended" ? (
                    <Users className="h-3 w-3" />
                  ) : (
                    <Mic className="h-3 w-3" />
                  )}
                  {event.role}
                </span>
              )}
              {event.format && (
                <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-muted-foreground">
                  {event.format}
                </span>
              )}
            </div>

            <h3 className="text-xl leading-snug transition-colors group-hover:text-accent">
              {event.title}
            </h3>

            {event.summary && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {event.summary}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted-foreground">
              <span className="tabular-nums">
                {formatEventDateRange(event.startDate, event.endDate)}
              </span>
              {event.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
