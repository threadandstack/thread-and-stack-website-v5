import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

interface CollapsibleSectionProps {
  eyebrow?: string;
  title: ReactNode;
  preview?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Editorial header that doubles as a click-to-expand trigger.
 * Hides any nested <SectionHeader /> (data-section-header) inside its body
 * via a scoped style so existing sections work without edits.
 */
export function CollapsibleSection({
  eyebrow,
  title,
  preview,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div data-collapsible-section className="collapsible-section">
      <style>{`
        .collapsible-section [data-collapsible-body] [data-section-header] { display: none; }
        .collapsible-section [data-collapsible-body] section > div { padding-top: 0 !important; }
      `}</style>

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          {eyebrow && (
            <span className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              {eyebrow}
            </span>
          )}
          <h2 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
            {title}
          </h2>
          <span
            aria-hidden
            className="mt-7 block h-px w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--clay) / 0.55), transparent)",
            }}
          />
          {preview && !open && (
            <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
              {preview}
            </p>
          )}
          <span
            className={`mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-foreground`}
          >
            <span
              className={`grid h-7 w-7 place-items-center rounded-full border border-hairline transition-transform ${
                open ? "rotate-45 border-indigo text-indigo" : ""
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
            </span>
            {open ? "Collapse" : "Reveal"}
          </span>
        </button>
      </div>

      <div
        data-collapsible-body
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
