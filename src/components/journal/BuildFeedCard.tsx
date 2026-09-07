import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import { ExpandedShell } from "@/components/journal/ExpandedCard";
import {
  CardMeta,
  CardPills,
  CardSummary,
  CardTitle,
  MetaDot,
} from "@/components/journal/CardParts";
import { BuildIcon } from "@/components/builds/BuildIcon";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
import { CardCta } from "@/components/journal/ExpandedCard";
import { BuildGroupItem, BuildItem, formatJournalDate } from "@/lib/journalFeed";

/** Single release card (used on the combined view elsewhere) */
export const BuildFeedCard = ({ item }: { item: BuildItem }) => {
  const target = item.buildSlug || item.slug;

  return (
    <Link to={`/builds/${target}`} className="group block h-full">
      <JournalCardShell
        media={
          item.headerImage ? (
            <img
              src={item.headerImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
            />
          ) : undefined
        }
      >
        <CardPills>
          <BuildIcon slug={item.buildSlug} name={item.buildName || item.title} />
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
            Build
          </span>
          <ChangeChips types={item.changeTypes.slice(0, 2)} />
        </CardPills>

        <CardTitle>{item.title}</CardTitle>

        {(item.changelog || item.description) && (
          <CardSummary>{item.changelog || item.description}</CardSummary>
        )}

        <CardMeta>
          <span className="truncate">{item.buildName || "Build"}</span>
          <MetaDot />
          <time className="tabular-nums">{formatJournalDate(item.date)}</time>
        </CardMeta>
      </JournalCardShell>
    </Link>
  );
};


/** One card per build. Clicking expands it inside the grid to reveal its updates. */
export const BuildGroupCard = ({
  group,
  expanded,
  onToggle,
}: {
  group: BuildGroupItem;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const latest = group.releases[0];
  const count = group.releases.length;

  if (expanded) {
    return (
      <ExpandedShell
        onToggle={onToggle}
        image={group.headerImage}
        pills={
          <>
            <BuildIcon slug={group.slug} name={group.buildName} />
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
              Build
            </span>
          </>
        }
        title={group.buildName}
        subtitle={`${count} ${count === 1 ? "update" : "updates"}${
          latest?.date ? ` · latest ${formatJournalDate(latest.date)}` : ""
        }`}
        summary={group.description}
        footer={
          <Link to={`/builds/${group.slug}`} className="inline-block">
            <CardCta>See this build in full →</CardCta>
          </Link>
        }
      >
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Recent updates
        </p>
        <ol className="ml-5 mt-3 space-y-3 border-l border-border/60 pl-4">
          {group.releases.slice(0, 4).map((release) => (
            <li key={release.id} className="relative">
              <span className="absolute -left-[19px] top-2 h-1.5 w-1.5 rounded-full bg-accent" />
              <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-muted-foreground">
                <time className="tabular-nums">{formatJournalDate(release.date)}</time>
                {(release.version || release.releaseType) && (
                  <span className="text-muted-foreground/50">·</span>
                )}
                <VersionChip version={release.version} releaseType={release.releaseType} />
              </div>
              <p className="line-clamp-1 text-sm leading-snug">{release.title}</p>
            </li>
          ))}
        </ol>
        {count > 4 && (
          <p className="mt-3 text-[12.5px] text-muted-foreground">
            +{count - 4} earlier {count - 4 === 1 ? "update" : "updates"}
          </p>
        )}
      </ExpandedShell>
    );
  }


  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={false}
      className="group block h-full w-full text-left"
    >
      <JournalCardShell
        media={
          group.headerImage ? (
            <img
              src={group.headerImage}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
            />
          ) : undefined
        }
      >
        <CardPills>
          <BuildIcon slug={group.slug} name={group.buildName} />
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
            Build
          </span>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
        </CardPills>

        <CardTitle>{group.buildName}</CardTitle>

        {group.description ? (
          <CardSummary>{group.description}</CardSummary>
        ) : (
          latest && (
            <CardSummary>
              <span className="text-foreground/80">Latest: </span>
              {latest.title}
            </CardSummary>
          )
        )}

        <CardMeta>
          <span>
            {count} {count === 1 ? "update" : "updates"}
          </span>
          {latest?.date && (
            <>
              <MetaDot />
              <time className="tabular-nums">{formatJournalDate(latest.date)}</time>
            </>
          )}
        </CardMeta>
      </JournalCardShell>

    </button>
  );
};

/** Local state wrapper if a parent doesn't manage expansion */
export const BuildGroupCardStandalone = ({ group }: { group: BuildGroupItem }) => {
  const [open, setOpen] = useState(false);
  return <BuildGroupCard group={group} expanded={open} onToggle={() => setOpen(!open)} />;
};
