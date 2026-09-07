import { Link } from "react-router-dom";
import { MapPin, Mic, Users } from "lucide-react";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import { DetailGrid, DetailRow, ExpandToggle, ExpandedShell } from "@/components/journal/ExpandedCard";
import {
  CardMeta,
  CardPills,
  CardSummary,
  CardTitle,
  MetaDot,
} from "@/components/journal/CardParts";
import {
  EventItem,
  formatEventDateRange,
  formatEventDuration,
  isUpcoming,
} from "@/lib/journalFeed";

const ROLE_STYLES: Record<string, string> = {
  Hosted: "bg-magenta/15 text-magenta",
  Spoke: "bg-violet/20 text-violet",
  Panel: "bg-orange/20 text-orange",
  Attended: "bg-muted text-muted-foreground",
};

const RolePill = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium ${
      ROLE_STYLES[role] || "bg-muted text-muted-foreground"
    }`}
  >
    {role === "Attended" ? <Users className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
    {role}
  </span>
);

const TypePill = () => (
  <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
    Event
  </span>
);

const UpcomingPill = () => (
  <span className="rounded-full bg-tertiary/15 px-2.5 py-0.5 font-medium text-tertiary">
    Upcoming
  </span>
);

export const EventCard = ({
  event,
  featured = false,
  expanded = false,
  onToggle,
}: {
  event: EventItem;
  /** Featured events get a taller image; width is handled by the grid. */
  featured?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const upcoming = isUpcoming(event);
  const dates = formatEventDateRange(event.startDate, event.endDate);

  if (expanded && onToggle) {
    return (
      <ExpandedShell
        onToggle={onToggle}
        image={event.coverImage}
        pills={
          <>
            <TypePill />
            {upcoming && <UpcomingPill />}
            {event.role && <RolePill role={event.role} />}
          </>
        }
        title={event.title}
        subtitle={dates}
        footer={
          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              to={`/journal/events/${event.slug}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Read the write-up →
            </Link>
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Event page →
              </a>
            )}
            {event.slidesUrl && (
              <a
                href={event.slidesUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Slides →
              </a>
            )}
            {event.recordingUrl && (
              <a
                href={event.recordingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Recording →
              </a>
            )}
          </div>
        }
      >
        {event.summary && (
          <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground">{event.summary}</p>
        )}

        <DetailGrid>
          <DetailRow label="Dates" value={dates} />
          <DetailRow label="Duration" value={formatEventDuration(event.startDate, event.endDate)} />
          <DetailRow label="Format" value={event.format} />
          <DetailRow label="Role" value={event.role} />
          <DetailRow
            label="Where"
            value={[event.venue, event.location].filter(Boolean).join(", ") || null}
          />
          <DetailRow label="Organiser" value={event.organiser} />
          <DetailRow
            label="Topics"
            value={
              event.topics.length ? (
                <span className="flex flex-wrap gap-1.5">
                  {event.topics.map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[12px]">
                      {t}
                    </span>
                  ))}
                </span>
              ) : null
            }
          />
        </DetailGrid>
      </ExpandedShell>
    );
  }

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
          <TypePill />
          {upcoming && <UpcomingPill />}
          {event.role && <RolePill role={event.role} />}
          {onToggle && (
            <ExpandToggle expanded={false} onToggle={onToggle} label="Show event details" />
          )}
        </CardPills>

        <CardTitle>{event.title}</CardTitle>

        {event.summary && <CardSummary>{event.summary}</CardSummary>}

        <CardMeta>
          <span className="tabular-nums">{dates}</span>
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
