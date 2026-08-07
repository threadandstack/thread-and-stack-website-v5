import bufferIcon from "@/assets/build-icons/buffer.png";
import notionIcon from "@/assets/build-icons/notion.png";
import notionDevIcon from "@/assets/build-icons/notion-dev.jpg";
import ntnWorkerIcon from "@/assets/build-icons/ntn-worker.png.asset.json";
import brandIcon from "@/assets/logos/Indigo_TS_SocialSq.svg";

const MAP: Record<string, { src: string; alt: string; pad?: boolean }> = {
  "thread-stack-website": { src: "/favicon.png", alt: "Thread & Stack" },
  "content-ops-worker": { src: bufferIcon, alt: "Content Ops Worker" },
  "xero-worker": { src: ntnWorkerIcon.url, alt: "Notion Worker" },
  "notion-workspace-installation": { src: notionIcon, alt: "Notion", pad: true },
  "t-s-notion-install-base-development": { src: notionIcon, alt: "Notion", pad: true },
  "thread-stack-skills": { src: notionDevIcon, alt: "Thread & Stack Skills" },
};

export const BuildIcon = ({
  slug,
  name,
  className = "",
}: {
  slug?: string | null;
  name?: string | null;
  className?: string;
}) => {
  const icon = slug ? MAP[slug] : undefined;
  const base = `h-8 w-8 shrink-0 overflow-hidden rounded-[9px] ${className}`;

  if (!icon) {
    // Weave (and any future build) — lettermark square
    const letter = (name || "?").trim().charAt(0).toUpperCase();
    return (
      <span
        aria-hidden="true"
        className={`${base} flex items-center justify-center bg-foreground font-serif-pro text-[15px] leading-none text-background`}
      >
        {letter}
      </span>
    );
  }

  return (
    <span className={`${base} flex items-center justify-center bg-muted`}>
      <img
        src={icon.src}
        alt=""
        aria-hidden="true"
        className={`h-full w-full object-contain ${icon.pad ? "p-1.5" : ""}`}
        loading="lazy"
      />
    </span>
  );
};
