import { useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  eyebrow?: string;
  title: ReactNode;
  preview?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Notion-style toggle.
 * - Triangle disclosure sits on the LEFT of the H2 title and rotates 0° → 90° on open.
 * - Header column is a fixed max-width, centered on the page, text-left inside,
 *   so every section's title shares the same left edge (visual spine).
 * - Click toggles. Hover provides a quiet "telegraph" so users know it's interactive,
 *   without actually expanding anything (works identically on touch).
 * - Body uses a split layer: a feathered tint background + a non-feathered content
 *   layer with generous padding, so the fade never overlaps real content.
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
    <div data-collapsible-section className="collapsible-section relative">
      <style>{`
        .collapsible-section [data-collapsible-body] [data-section-header] { display: none; }
        .collapsible-section [data-collapsible-body] section > div { padding-top: 0 !important; }
      `}</style>

      {/* Header — centered column, left-aligned content */}
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group/toggle mx-auto block w-full max-w-2xl text-left"
        >
          {eyebrow && (
            <span className="mb-4 block text-[11px] uppercase tracking-[0.22em] text-ink-soft">
              {eyebrow}
            </span>
          )}

          <h2 className="relative font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
            {/* Triangle: inline, sized in em so it scales with the heading */}
            <span
              aria-hidden
              className="mr-3 inline-block align-[0.18em] transition-colors duration-300 text-ink-soft group-hover/toggle:text-clay"
              style={{ color: open ? "hsl(var(--clay))" : undefined }}
            >
              <svg
                viewBox="0 0 10 10"
                className={`inline-block h-[0.5em] w-[0.5em] transition-transform duration-300 ease-out ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              >
                <path d="M2.5 1 L8 5 L2.5 9 Z" fill="currentColor" />
              </svg>
            </span>
            {title}
          </h2>

          {/* Divider — breathes wider on hover/open as the hover telegraph */}
          <span
            aria-hidden
            className={`mt-7 block h-px transition-all duration-500 ease-out ${
              open ? "w-40" : "w-16 group-hover/toggle:w-28"
            }`}
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--clay) / 0.55), transparent)",
            }}
          />

          <div className="mt-5 flex items-baseline justify-between gap-6">
            {preview && !open ? (
              <p className="max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                {preview}
              </p>
            ) : (
              <span />
            )}
            <span
              className={`shrink-0 text-[11px] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                open
                  ? "text-orange opacity-100"
                  : "text-orange opacity-0 group-hover/toggle:opacity-100"
              }`}
            >
              {open ? "Collapse" : "Reveal"}
            </span>
          </div>
        </button>
      </div>

      {/* Body — animated open/close */}
      <div
        data-collapsible-body
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {/* Two-layer panel: feathered tint behind, full-opacity content in front */}
          <div className="relative">
            {/* Tint layer — feathered top/bottom only */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--foreground) / 0.022), hsl(var(--foreground) / 0.032) 20%, hsl(var(--foreground) / 0.032) 80%, hsl(var(--foreground) / 0.022))",
                WebkitMaskImage:
                  "linear-gradient(180deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)",
                maskImage:
                  "linear-gradient(180deg, transparent 0, #000 40px, #000 calc(100% - 40px), transparent 100%)",
              }}
            />
            {/* Clay hairline at panel top — the bit content "spills" out of */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 block h-px w-40 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--clay) / 0.35), transparent)",
              }}
            />

            {/* Content layer — full opacity, generous padding so the feather never overlaps */}
            <div className="relative pt-16 pb-16 md:pt-24 md:pb-24">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
