import { ReactNode } from "react";

/**
 * Shared card anatomy for every journal card so writing, builds and events
 * read the same way: pills top, title, summary, metadata pinned to the base.
 */

export const CardPills = ({ children }: { children: ReactNode }) => (
  <div className="mb-3 flex min-h-[26px] flex-wrap items-center gap-2 text-[12px]">{children}</div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="line-clamp-2 break-words text-2xl leading-snug transition-colors group-hover:text-accent">
    {children}
  </h3>
);

export const CardSummary = ({ children }: { children: ReactNode }) => (
  <p className="mt-2 line-clamp-2 min-h-0 text-[15px] leading-relaxed text-muted-foreground">{children}</p>
);

export const CardMeta = ({ children }: { children: ReactNode }) => (
  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-[12.5px] text-muted-foreground">
    {children}
  </div>
);

export const MetaDot = () => <span className="text-muted-foreground/40">·</span>;
