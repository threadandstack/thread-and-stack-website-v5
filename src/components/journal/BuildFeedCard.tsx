import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { BuildIcon } from "@/components/builds/BuildIcon";
import { ChangeChips, VersionChip } from "@/components/builds/ChangeChips";
import { BuildItem, formatJournalDate } from "@/lib/journalFeed";

export const BuildFeedCard = ({ item }: { item: BuildItem }) => {
  const target = item.buildSlug || item.slug;

  return (
    <Link to={`/builds/${target}`} className="group block h-full">
      <Card className="h-full overflow-hidden p-6 transition-all hover:shadow-lg">
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
      </Card>
    </Link>
  );
};
