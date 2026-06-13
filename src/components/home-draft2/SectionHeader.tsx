interface SectionHeaderProps {
  children: React.ReactNode;
  eyebrow?: string;
  className?: string;
}

/**
 * Centered editorial section header with a subtle clay dividing line beneath.
 * Used across Home Draft 2 to give every section a consistent rhythm.
 */
export function SectionHeader({ children, eyebrow, className = "" }: SectionHeaderProps) {
  return (
    <header
      data-section-header
      className={`mx-auto mb-16 flex max-w-3xl flex-col items-center text-center ${className}`}
    >
      {eyebrow && (
        <span className="mb-5 text-[11px] uppercase tracking-[0.22em] text-ink-soft">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif-pro italic font-normal text-balance text-4xl leading-[1.05] tracking-[-0.02em] md:text-[56px]">
        {children}
      </h2>
      <span
        aria-hidden
        className="mt-7 block h-px w-16"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--clay) / 0.55), transparent)",
        }}
      />
    </header>
  );
}
