// Tool logos sourced from Simple Icons CDN (monochrome SVGs).
// Tinted via CSS filters to match the section's neutral palette in either theme.

interface LogosProps {
  theme?: "dark" | "light";
}

const tools: { name: string; slug: string }[] = [
  { name: "Notion", slug: "notion" },
  { name: "Slack", slug: "slack" },
  { name: "Figma", slug: "figma" },
  { name: "Zapier", slug: "zapier" },
  { name: "n8n", slug: "n8n" },
  { name: "Linear", slug: "linear" },
  { name: "Asana", slug: "asana" },
  { name: "Trello", slug: "trello" },
  { name: "Airtable", slug: "airtable" },
  { name: "ClickUp", slug: "clickup" },
  { name: "Monday.com", slug: "mondaydotcom" },
  { name: "Obsidian", slug: "obsidian" },
  { name: "Jira", slug: "jira" },
  { name: "HubSpot", slug: "hubspot" },
  { name: "Salesforce", slug: "salesforce" },
  { name: "Canva", slug: "canva" },
  { name: "Zoom", slug: "zoom" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Buffer", slug: "buffer" },
  { name: "Hootsuite", slug: "hootsuite" },
  { name: "Google", slug: "google" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "OpenAI", slug: "openai" },
  { name: "Claude", slug: "anthropic" },
  { name: "Gemini", slug: "googlegemini" },
];

export function Logos({ theme = "dark" }: LogosProps) {
  const isDark = theme === "dark";
  // Tint: black-at-low-opacity on light bg → soft gray; pure white on dark bg.
  const tint = isDark
    ? "brightness(0) invert(1) opacity(0.72)"
    : "brightness(0) opacity(0.42)";

  const items = [...tools, ...tools];

  return (
    <section className="border-b border-hairline bg-background">
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
        <div className="marquee-track flex w-max items-center gap-14 whitespace-nowrap">
          {items.map((tool, i) => (
            <img
              key={`${tool.slug}-${i}`}
              src={`https://cdn.simpleicons.org/${tool.slug}`}
              alt={tool.name}
              loading="lazy"
              className="h-7 w-auto shrink-0 select-none transition-[filter] duration-300"
              style={{ filter: tint }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
