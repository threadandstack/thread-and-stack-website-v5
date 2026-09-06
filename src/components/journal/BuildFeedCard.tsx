import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BuildIcon } from "@/components/builds/BuildIcon";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
import { BuildGroupItem, BuildItem, formatJournalDate } from "@/lib/journalFeed";

/** Single release card (used on the combined view elsewhere) */
export const BuildFeedCard = ({ item }: { item: BuildItem }) => {
  const target = item.buildSlug || item.slug;

  return (
    <Link to={`/builds/${target}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        {item.headerImage && (
          <img
            src={item.headerImage}
            alt=""
            loading="lazy"
            className="h-32 w-full object-cover"
          />
        )}
        <div className="p-6">
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

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
          <time className="tabular-nums">{formatJournalDate(item.date)}</time>
          {(item.version || item.releaseType) && <span className="text-muted-foreground/50">·</span>}
          <VersionChip version={item.version} releaseType={item.releaseType} />
        </div>

        <h3 className="mt-3 text-xl leading-snug transition-colors group-hover:text-accent">
          {item.title}
        </h3>

        {item.changeTypes.length > 0 && (
          <div className="mt-3">
            <ChangeChips types={item.changeTypes} />
          </div>
        )}

        {(item.changelog || item.description) && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.changelog || item.description}
          </p>
        )}
        </div>
      </Card>

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

  return (
    <Card
      className={`flex h-full flex-col transition-shadow duration-300 ${
        expanded ? "overflow-y-auto shadow-xl" : "overflow-hidden hover:shadow-lg"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="group flex min-h-0 w-full flex-1 flex-col text-left"
      >
        {group.headerImage && (
          <img
            src={group.headerImage}
            alt=""
            loading="lazy"
            className={expanded ? "h-28 w-full shrink-0 object-cover" : "h-28 w-full min-h-0 flex-1 shrink-0 object-cover"}
          />
        )}
        <div className="shrink-0 p-6">


        <div className="flex items-start gap-3">
          <BuildIcon slug={group.slug} name={group.buildName} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-2xl leading-snug transition-colors group-hover:text-accent">
              {group.buildName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {count} {count === 1 ? "update" : "updates"}
              {latest?.date ? ` · latest ${formatJournalDate(latest.date)}` : ""}
            </p>
          </div>
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        <AnimatePresence initial={false}>
        {!expanded && latest && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mt-4">
              <VersionChip version={latest.version} releaseType={latest.releaseType} />
            </div>
            <p className="mt-3 font-medium leading-snug">{latest.title}</p>
            {(latest.changelog || latest.description) && (
              <p className="mt-2 line-clamp-2 leading-relaxed text-muted-foreground">
                {latest.changelog || latest.description}
              </p>
            )}
            {latest.changeTypes.length > 0 && (
              <div className="mt-3">
                <ChangeChips types={latest.changeTypes} />
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
        </div>
      </button>


      <AnimatePresence initial={false}>
      {expanded && (
        <motion.div
          key="expanded"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={spring}
          className="overflow-hidden"
        >
        <div className="px-6 pb-6">
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
      )}
      </AnimatePresence>
    </Card>
  );
};

/** Local state wrapper if a parent doesn't manage expansion */
export const BuildGroupCardStandalone = ({ group }: { group: BuildGroupItem }) => {
  const [open, setOpen] = useState(false);
  return <BuildGroupCard group={group} expanded={open} onToggle={() => setOpen(!open)} />;
};
