const CHANGE_TYPE_STYLES: Record<string, string> = {
  Added: "bg-tertiary/15 text-tertiary",
  Changed: "bg-sky/20 text-sky",
  Improved: "bg-violet/20 text-violet",
  Fixed: "bg-orange/20 text-orange",
  Shipped: "bg-magenta/15 text-magenta",
  Removed: "bg-destructive/15 text-destructive",
};

export const ChangeChips = ({ types }: { types?: string[] | null }) => {
  if (!types || types.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {types.map((type) => (
        <span
          key={type}
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${
            CHANGE_TYPE_STYLES[type] || "bg-muted text-foreground/70"
          }`}
        >
          {type}
        </span>
      ))}
    </div>
  );
};

export const VersionChip = ({
  version,
  releaseType,
}: {
  version?: string | null;
  releaseType?: string | null;
}) => {
  if (!version && !releaseType) return null;
  return (
    <span className="inline-flex items-center gap-2">
      {version && (
        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[12px] font-medium text-foreground/85">
          {version}
        </span>
      )}
      {releaseType && (
        <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          {releaseType}
        </span>
      )}
    </span>
  );
};
