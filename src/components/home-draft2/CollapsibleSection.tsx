import { useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  eyebrow?: string;
  title: ReactNode;
  preview?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Notion-style toggle: title acts as a click target with a rotating triangle
 * disclosure. When open, the body sits on a barely-there tinted panel that
 * feathers in/out via gradient masks so it feels like the content is emerging
 * from the dividing line rather than living inside a hard window.
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

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-14">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group mx-auto flex w-full max-w-3xl flex-col items-center text-center"
        >
          {eyebrow && (
            <span className="mb-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink-soft transition-colors group-hover:text-foreground">
              {/* Notion-style triangle disclosure */}
              <svg
                aria-hidden
                viewBox="0 0 10 10"
                className={`h-2.5 w-2.5 shrink-0 transition-transform duration-300 ease-out ${
                  open ? "rotate-90" : "rotate-0"
                }`}
                style={{ color: "hsl(var(--clay))" }}
              >
                <path d="M3 1.5 L7.5 5 L3 8.5 Z" fill="currentColor" />
              </svg>
              {eyebrow}
            </span>
          )}
          <h2 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
            {title}
          </h2>
          {/* The dividing line — widens slightly when open, acting as the lip the panel emerges from */}
          <span
            aria-hidden
            className={`mt-7 block h-px transition-all duration-500 ease-out ${
              open ? "w-40" : "w-16"
            }`}
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
        </button>
      </div>

      {/* Body container — soft tinted panel that feathers top/bottom so the
          continuous background never feels broken. */}
      <div
        data-collapsible-body
        className={`relative grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="relative"
            style={{
              // Slightly different background, feathered at the edges via mask
              background:
                "linear-gradient(180deg, hsl(var(--foreground) / 0.018), hsl(var(--foreground) / 0.028) 18%, hsl(var(--foreground) / 0.028) 82%, hsl(var(--foreground) / 0.018))",
              WebkitMaskImage:
                "linear-gradient(180deg, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
              maskImage:
                "linear-gradient(180deg, transparent 0, #000 56px, #000 calc(100% - 56px), transparent 100%)",
            }}
          >
            {/* Faint hairline mirror of the divider, hugging the top of the panel */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 block h-px w-40 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--clay) / 0.35), transparent)",
              }}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
