import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import { BuildIcon } from "@/components/builds/BuildIcon";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
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
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : undefined
        }
      >
        <div className="flex items-center gap-3">
          <BuildIcon slug={item.buildSlug} name={item.buildName || item.title} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.buildName || "Build"}</p>
            <p className="text-[12px] text-muted-foreground">
              {item.releaseIndex && item.releaseCount
                ? `Release ${item.releaseIndex} of ${item.releaseCount}`
                : "Release"}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
          <time className="tabular-nums">{formatJournalDate(item.date)}</time>
          {(item.version || item.releaseType) && <span className="text-muted-foreground/50">·</span>}
          <VersionChip version={item.version} releaseType={item.releaseType} />
        </div>

        <h3 className="mt-2 line-clamp-2 text-2xl leading-snug transition-colors group-hover:text-accent">
          {item.title}
        </h3>

        {item.changeTypes.length > 0 && (
          <div className="mt-3">
            <ChangeChips types={item.changeTypes} />
          </div>
        )}

        {(item.changelog || item.description) && (
          <p className="mt-3 line-clamp-2 text-muted-foreground">
            {item.changelog || item.description}
          </p>
        )}
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

  const spring = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.9 };

  if (expanded) {
    return (
      <Card className="flex h-full flex-col overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded
          className="group w-full text-left"
        >
          {group.headerImage && (
            <div className="h-36 w-full overflow-hidden sm:h-44 lg:h-52">
              <img
                src={group.headerImage}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex items-start gap-3 p-5 sm:p-6">
            <BuildIcon slug={group.slug} name={group.buildName} />
            <div className="min-w-0 flex-1">
              <h3 className="text-2xl leading-snug transition-colors group-hover:text-accent">
                {group.buildName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {count} {count === 1 ? "update" : "updates"}
                {latest?.date ? ` · latest ${formatJournalDate(latest.date)}` : ""}
              </p>
            </div>
            <ChevronDown className="mt-1 h-4 w-4 shrink-0 rotate-180 text-muted-foreground transition-transform" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 sm:px-6">
              <ol className="space-y-4 border-l border-border/60 pl-5">
                {group.releases.map((release) => (
                  <li key={release.id} className="relative">
                    <span className="absolute -left-[23px] top-2 h-1.5 w-1.5 rounded-full bg-accent" />
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
                      <time className="tabular-nums">{formatJournalDate(release.date)}</time>
                      {(release.version || release.releaseType) && (
                        <span className="text-muted-foreground/50">·</span>
                      )}
                      <VersionChip version={release.version} releaseType={release.releaseType} />
                    </div>
                    <p className="mt-1 text-base leading-snug">{release.title}</p>
                    {release.changeTypes.length > 0 && (
                      <div className="mt-2">
                        <ChangeChips types={release.changeTypes} />
                      </div>
                    )}
                    {(release.changelog || release.description) && (
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {release.changelog || release.description}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              <Link
                to={`/builds/${group.slug}`}
                className="mt-5 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                See this build in full →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
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
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : undefined
        }
      >
        <div className="flex items-start gap-3">
          <BuildIcon slug={group.slug} name={group.buildName} />
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-2xl leading-snug transition-colors group-hover:text-accent">
              {group.buildName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {count} {count === 1 ? "update" : "updates"}
            </p>
          </div>
          <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform" />
        </div>

        {latest && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
            <time className="tabular-nums">{formatJournalDate(latest.date)}</time>
            {(latest.version || latest.releaseType) && (
              <span className="text-muted-foreground/50">·</span>
            )}
            <VersionChip version={latest.version} releaseType={latest.releaseType} />
          </div>
        )}

        {latest && (
          <p className="mt-2 line-clamp-2 font-medium leading-snug">{latest.title}</p>
        )}

        {latest && (latest.changelog || latest.description) && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {latest.changelog || latest.description}
          </p>
        )}

        <span className="mt-auto pt-4 text-[13px] text-muted-foreground group-hover:text-foreground">
          Open the log →
        </span>
      </JournalCardShell>
    </button>
  );
};

/** Local state wrapper if a parent doesn't manage expansion */
export const BuildGroupCardStandalone = ({ group }: { group: BuildGroupItem }) => {
  const [open, setOpen] = useState(false);
  return <BuildGroupCard group={group} expanded={open} onToggle={() => setOpen(!open)} />;
};
