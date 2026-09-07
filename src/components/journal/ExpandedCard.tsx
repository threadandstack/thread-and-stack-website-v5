import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

const SPRING = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.9 };

/**
 * One expanded shape for every journal card, sized to a single grid row:
 * pills across the top, then picture, title and summary on the left with the
 * detail list and call to action on the right. Nothing scrolls.
 */
export const ExpandedShell = ({
  pills,
  title,
  subtitle,
  image,
  onToggle,
  summary,
  children,
  footer,
}: {
  pills?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  image?: string | null;
  onToggle: () => void;
  summary?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <Card className="flex h-full flex-col overflow-hidden shadow-xl">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded
      className="group w-full shrink-0 px-5 pt-5 text-left sm:px-6 sm:pt-6"
    >
      <div className="flex items-start gap-3">
        {pills && (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-[12px]">
            {pills}
          </div>
        )}
        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 rotate-180 text-muted-foreground transition-transform" />
      </div>
    </button>

    <AnimatePresence initial={false}>
      <motion.div
        key="expanded"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={SPRING}
        className="grid min-h-0 flex-1 gap-x-8 gap-y-4 overflow-hidden p-5 pt-4 sm:grid-cols-2 sm:p-6 sm:pt-4"
      >
        <div className="flex min-h-0 flex-col overflow-hidden">
          {image && (
            <div className="mb-3 h-32 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-36">
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
          <h3 className="line-clamp-2 break-words text-2xl leading-snug">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          {footer && <div className="mt-auto pt-4 shrink-0">{footer}</div>}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden">
          {summary && (
            <p className="mb-3 line-clamp-3 shrink-0 text-[15px] leading-relaxed text-muted-foreground">
              {summary}
            </p>
          )}
          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  </Card>
);

/** Label / value rows used inside every expanded card */
export const DetailGrid = ({ children }: { children: ReactNode }) => (
  <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{children}</dl>
);

export const DetailRow = ({ label, value }: { label: string; value: ReactNode }) =>
  value ? (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm leading-relaxed">{value}</dd>
    </div>
  ) : null;

/** Primary call to action inside an expanded card */
export const CardCta = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full bg-gradient-warm px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 ${className}`}
  >
    {children}
  </span>
);

/** Small chevron that expands a card without following its link */
export const ExpandToggle = ({
  expanded,
  onToggle,
  label,
}: {
  expanded: boolean;
  onToggle: () => void;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    aria-expanded={expanded}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    }}
    className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
  </button>
);
