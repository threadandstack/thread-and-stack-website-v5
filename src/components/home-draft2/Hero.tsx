import { ArrowRight, ArrowDown, BadgeCheck, Repeat, MapPin } from "lucide-react";
import { LogoTilt } from "./LogoTilt";
import { NotionWorkspaceMock } from "./NotionWorkspaceMock";
import newsletterLight from "@/assets/notion-mock/newsletter-light.png.asset.json";
import newsletterDark from "@/assets/notion-mock/newsletter-dark.png.asset.json";
import vacationLight from "@/assets/notion-mock/vacation-light.png.asset.json";
import vacationDark from "@/assets/notion-mock/vacation-dark.png.asset.json";

interface HeroProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onBookDiagnostic: () => void;
}

export function Hero({ theme, onBookDiagnostic }: HeroProps) {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <div className="mb-10">
            <LogoTilt className="h-28 sm:h-36 md:h-44" theme={theme} />
          </div>

          <div className="mt-6 mb-10 w-full max-w-3xl">
            <NotionWorkspaceMock
              theme={theme}
              hotspots={[
                {
                  id: "newsletter",
                  // "Welcome to Milestone Mint!" newsletter block
                  x: 62,
                  y: 28,
                  label: "Internal newsletter",
                  overlaySrc: theme === "dark" ? newsletterLight.url : newsletterDark.url,
                  overlayX: 38,
                  overlayY: 8,
                  overlayWidth: 58,
                },
                {
                  id: "vacation",
                  // "Vacation Policy" near the bottom
                  x: 26,
                  y: 82,
                  label: "Policy page",
                  overlaySrc: theme === "dark" ? vacationLight.url : vacationDark.url,
                  overlayX: 6,
                  overlayY: 38,
                  overlayWidth: 58,
                },
              ]}
            />
            <p className="mt-4 text-center text-[12.5px] text-muted-foreground">
              A live Knowledge Base built in Notion — hover the pins to peek inside.
            </p>
          </div>

          <h1 className="font-serif-pro italic font-normal max-w-4xl text-balance text-5xl leading-[1.02] tracking-[-0.02em] md:text-[76px]">
            One central knowledge hub.
            <br />
            <span className="text-clay">Your centre of truth.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-[16.5px] leading-relaxed text-ink-soft">
            For 5–50 person teams who've outgrown their tool stack. We build your
            information architecture and create a Knowledge Base that grows in
            value as your team does. It reduces cognitive load and gives your
            team back time to do their best work.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBookDiagnostic}
              className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
              style={{
                backgroundImage:
                  "linear-gradient(95deg, var(--gradient-3color))",
              }}
            >
              Book the Stack Diagnostic · £395
              <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </button>
            <a
              href="/home-draft2/scorecard"
              className="group inline-flex h-12 items-center rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
            >
              Take the 2-min Scorecard
              <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                <ArrowDown className="h-4 w-4 shrink-0" />
              </span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-indigo" strokeWidth={2} />
              Notion Certified
            </span>
            <span className="hidden h-3 w-px bg-hairline sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <Repeat className="h-3.5 w-3.5 text-violet" strokeWidth={2} />
              Rolling support, no tie-in
            </span>
            <span className="hidden h-3 w-px bg-hairline sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-orange" strokeWidth={2} />
              UK-based · booking Q3
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

