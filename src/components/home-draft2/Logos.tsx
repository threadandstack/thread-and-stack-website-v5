// Tool logos. Most are pulled from Simple Icons CDN (already monochrome).
// A handful (brands SI removed, plus Notion sub-products) are bundled locally
// and tinted via CSS filters so every logo renders in the same neutral hue.

import salesforceSvg from "@/assets/tool-logos/salesforce.svg";
import canvaSvg from "@/assets/tool-logos/canva.svg";
import microsoftSvg from "@/assets/tool-logos/microsoft.svg";
import openaiSvg from "@/assets/tool-logos/openai.svg";
import mondaySvg from "@/assets/tool-logos/monday.svg";
import slackSvg from "@/assets/tool-logos/slack.svg";
import notionMailPng from "@/assets/tool-logos/notion-mail.png";
import notionCalendarSvg from "@/assets/tool-logos/notion-calendar.svg";
import notionDevelopersPng from "@/assets/tool-logos/notion-developers.png";

interface LogosProps {
  theme?: "dark" | "light";
}

// `keepColor` disables the monochrome tint for icons whose detail would be
// lost when flattened to a silhouette (e.g. Notion's product icons, which use
// inner cut-outs against a colored tile).
type Tool = { name: string; src: string; keepColor?: boolean };

const cdn = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

const tools: Tool[] = [
  { name: "Notion", src: cdn("notion") },
  { name: "Notion Mail", src: notionMailPng, keepColor: true },
  { name: "Notion Calendar", src: notionCalendarSvg, keepColor: true },
  { name: "Notion Developer Platform", src: notionDevelopersPng, keepColor: true },
  { name: "Slack", src: slackSvg },
  { name: "Figma", src: cdn("figma") },
  { name: "Zapier", src: cdn("zapier") },
  { name: "n8n", src: cdn("n8n") },
  { name: "Linear", src: cdn("linear") },
  { name: "Asana", src: cdn("asana") },
  { name: "Trello", src: cdn("trello") },
  { name: "Airtable", src: cdn("airtable") },
  { name: "ClickUp", src: cdn("clickup") },
  { name: "Monday.com", src: mondaySvg },
  { name: "Obsidian", src: cdn("obsidian") },
  { name: "Jira", src: cdn("jira") },
  { name: "HubSpot", src: cdn("hubspot") },
  { name: "Salesforce", src: salesforceSvg },
  { name: "Canva", src: canvaSvg },
  { name: "Zoom", src: cdn("zoom") },
  { name: "WhatsApp", src: cdn("whatsapp") },
  { name: "Buffer", src: cdn("buffer") },
  { name: "Hootsuite", src: cdn("hootsuite") },
  { name: "Google", src: cdn("google") },
  { name: "Microsoft", src: microsoftSvg },
  { name: "OpenAI", src: openaiSvg },
  { name: "Claude", src: cdn("anthropic") },
  { name: "Gemini", src: cdn("googlegemini") },
];

export function Logos({ theme = "dark" }: LogosProps) {
  const isDark = theme === "dark";
  const tint = isDark
    ? "brightness(0) invert(1) opacity(0.72)"
    : "brightness(0) opacity(0.42)";
  // Colorful icons keep their own palette but get nudged toward the section's
  // muted tone with a gentle opacity reduction so they sit beside the tinted
  // silhouettes without shouting.
  const keepColorFilter = isDark ? "opacity(0.9)" : "opacity(0.85)";

  const items = [...tools, ...tools];

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-center text-[11.5px] uppercase tracking-[0.22em] text-muted-foreground">
          Tools we work with
        </p>
      </div>
      <div className="relative overflow-hidden pb-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
        />
        <div
          className="marquee-track flex w-max items-center gap-14 whitespace-nowrap"
          style={{ animationDelay: "-40s" }}
        >
          {items.map((tool, i) => (
            <img
              key={`${tool.name}-${i}`}
              src={tool.src}
              alt={tool.name}
              loading="lazy"
              className="h-7 w-auto shrink-0 select-none transition-[filter] duration-300"
              style={{ filter: tool.keepColor ? keepColorFilter : tint }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
