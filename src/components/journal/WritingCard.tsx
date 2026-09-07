import { Link } from "react-router-dom";
import { JournalCardShell } from "@/components/journal/JournalCardShell";
import {
  CardCta,
  DetailGrid,
  DetailRow,
  ExpandToggle,
  ExpandedShell,
} from "@/components/journal/ExpandedCard";
import {
  CardMeta,
  CardPills,
  CardSummary,
  CardTitle,
  MetaDot,
} from "@/components/journal/CardParts";
import { WritingItem, formatJournalDate } from "@/lib/journalFeed";

export const getThemeColors = (theme: string): string => {
  const themeMap: Record<string, string> = {
    Growth: "pill-growth",
    Strategy: "pill-strategy",
    Creative: "pill-creative",
    Systems: "pill-systems",
    "Case Studies": "pill-casestudy",
    "Case Study": "pill-casestudy",
  };
  return themeMap[theme] || "pill-casestudy";
};

const TypePill = () => (
  <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium text-muted-foreground">
    Writing
  </span>
);

export const WritingCard = ({
  post,
  expanded = false,
  onToggle,
}: {
  post: WritingItem;
  expanded?: boolean;
  onToggle?: () => void;
}) => {
  const themePill = post.theme ? (
    <span className={`rounded-full px-2.5 py-0.5 font-medium ${getThemeColors(post.theme)}`}>
      {post.theme}
    </span>
  ) : null;

  if (expanded && onToggle) {
    return (
      <ExpandedShell
        onToggle={onToggle}
        image={post.headerImage}
        pills={
          <>
            <TypePill />
            {themePill}
          </>
        }
        title={post.title}
        subtitle={formatJournalDate(post.date)}
        footer={
          <Link to={`/blog/${post.slug}`} className="inline-block">
            <CardCta>Open the full blog →</CardCta>
          </Link>
        }
      >
        {(post.intro || post.description) && (
          <p className="mb-4 text-[15px] leading-relaxed text-muted-foreground">
            {post.intro || post.description}
          </p>
        )}

        <DetailGrid>
          <DetailRow label="Published" value={formatJournalDate(post.date)} />
          <DetailRow
            label="Reading time"
            value={post.readingTime ? `${post.readingTime} min` : null}
          />
          <DetailRow label="Theme" value={post.theme} />
          <DetailRow
            label="What it covers"
            value={post.intro && post.description ? post.description : null}
          />
        </DetailGrid>
      </ExpandedShell>
    );
  }

  const body = (
    <JournalCardShell
      media={
        post.headerImage ? (
          <img
            src={post.headerImage}
            alt={post.title}
            className="h-full w-full object-cover object-top transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : undefined
      }
    >
      <CardPills>
        <TypePill />
        {themePill}
        {onToggle && <ExpandToggle expanded={false} onToggle={onToggle} label="Show article details" />}
      </CardPills>

      <CardTitle>{post.title}</CardTitle>

      {(post.intro || post.description) && (
        <CardSummary>{post.intro || post.description}</CardSummary>
      )}

      <CardMeta>
        {post.date && <span className="tabular-nums">{formatJournalDate(post.date)}</span>}
        {post.readingTime && (
          <>
            <MetaDot />
            <span>{post.readingTime} min read</span>
          </>
        )}
      </CardMeta>
    </JournalCardShell>
  );

  if (onToggle) {
    return (
      <button type="button" onClick={onToggle} aria-expanded={false} className="group block h-full w-full text-left">
        {body}
      </button>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      {body}
    </Link>
  );
};
