import { Link } from "react-router-dom";
import { MapPin, Mic, Users } from "lucide-react";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import {
  CardMeta,
  CardPills,
  CardSummary,
  CardTitle,
  MetaDot,
} from "@/components/journal/CardParts";
import { EventItem, formatEventDateRange, isUpcoming } from "@/lib/journalFeed";

const ROLE_STYLES: Record<string, string> = {
  Hosted: "bg-magenta/15 text-magenta",
  Spoke: "bg-violet/20 text-violet",
  Panel: "bg-orange/20 text-orange",
  Attended: "bg-muted text-muted-foreground",
};

export const EventCard = ({
  event,
  featured = false,
}: {
  event: EventItem;
  /** Featured events get a taller image; width is handled by the grid. */
  featured?: boolean;
}) => {
  const upcoming = isUpcoming(event);

  return (
    <Link to={`/journal/events/${event.slug}`} className="group block h-full">
      <JournalCardShell
        mediaClassName={featured ? "h-48 sm:h-56" : ""}
        media={
          event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-primary opacity-90" />
          )
        }
      >
        <CardPills>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
            Event
          </span>
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
        </CardPills>

        <CardTitle>{event.title}</CardTitle>

        {event.summary && <CardSummary>{event.summary}</CardSummary>}

        <CardMeta>
          <span className="tabular-nums">
            {formatEventDateRange(event.startDate, event.endDate)}
          </span>
          {event.location && (
            <>
              <MetaDot />
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            </>
          )}
          {event.format && (
            <>
              <MetaDot />
              <span>{event.format}</span>
            </>
          )}
        </CardMeta>
      </JournalCardShell>
    </Link>
  );
};
