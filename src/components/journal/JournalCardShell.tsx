import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

/**
 * Shared shape for every journal card: a short media band on top and a
 * generous body underneath. Keeps writing, events and builds identical in
 * footprint so the grid can never leave holes.
 */
export const JournalCardShell = ({
  media,
  children,
  className = "",
  interactive = true,
  mediaClassName = "",
}: {
  media?: ReactNode;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  mediaClassName?: string;
}) => (
  <Card
    className={`flex h-full min-h-0 flex-col overflow-hidden transition-all ${
      interactive ? "hover:shadow-lg" : ""
    } ${className}`}
  >
    {media && (
      <div className={`h-40 w-full shrink-0 overflow-hidden sm:h-44 ${mediaClassName}`}>
        {media}
      </div>
    )}
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5 sm:p-6">{children}</div>
  </Card>
);
