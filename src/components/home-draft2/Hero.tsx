import { ArrowRight, ArrowDown } from "lucide-react";
import { LogoTilt } from "./LogoTilt";
import { NotionWorkspaceMock } from "./NotionWorkspaceMock";
import newsletterLight from "@/assets/notion-mock/newsletter-light.png.asset.json";
import newsletterDark from "@/assets/notion-mock/newsletter-dark.png.asset.json";
import vacationLight from "@/assets/notion-mock/vacation-light.png.asset.json";
import vacationDark from "@/assets/notion-mock/vacation-dark.png.asset.json";
import onboardingMobileLight from "@/assets/notion-mock/onboarding-mobile.png.asset.json";
import onboardingMobileDark from "@/assets/notion-mock/onboarding-mobile-dark.png.asset.json";

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
          <div
            className="w-full"
            style={{
              perspective: "1400px",
              ["--g-tx" as never]: "0deg",
              ["--g-ty" as never]: "0deg",
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              const r = el.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width;
              const py = (e.clientY - r.top) / r.height;
              const tx = (px - 0.5) * 8;   // rotateY
              const ty = (0.5 - py) * 6;   // rotateX
              el.style.setProperty("--g-tx", `${tx}deg`);
              el.style.setProperty("--g-ty", `${ty}deg`);
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.setProperty("--g-tx", `0deg`);
              el.style.setProperty("--g-ty", `0deg`);
            }}
          >
            {/* Shared physical body: both logo and mock rotate around the
                mock's center, so the logo swings above it like a sign
                attached to the same gravity point. */}
            <div
              className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
              style={{
                transformOrigin: "50% 75%",
                transform:
                  "rotateX(var(--g-ty, 0deg)) rotateY(var(--g-tx, 0deg))",
              }}
            >
              <div className="mb-10 flex justify-center">
                <LogoTilt className="h-28 sm:h-36 md:h-44" theme={theme} groupTilt />
              </div>

              <div className="mt-6 mb-10 w-full max-w-3xl mx-auto">
                <NotionWorkspaceMock
                  theme={theme}
                  groupTilt
                  hotspots={[
                  {
                      id: "newsletter",
                      x: 28,
                      y: 62,
                      label: "Internal newsletter",
                      overlaySrc: theme === "dark" ? newsletterLight.url : newsletterDark.url,
                      overlayX: 38,
                      overlayY: 8,
                      overlayWidth: 58,
                    },
                    {
                      id: "vacation",
                      x: 56,
                      y: 92,
                      label: "Policy page",
                      overlaySrc: theme === "dark" ? vacationLight.url : vacationDark.url,
                      overlayX: 6,
                      overlayY: 56,
                      overlayWidth: 58,
                    },
                    {
                      id: "onboarding",
                      x: 84,
                      y: 86,
                      label: "AI onboarding",
                      overlaySrc: theme === "dark" ? onboardingMobileLight.url : onboardingMobileDark.url,
                      overlayX: 56,
                      overlayY: 8,
                      overlayWidth: 36,
                    },
                  ]}
                />
                <p className="mt-4 text-center text-[12.5px] text-muted-foreground">
                  A live Knowledge Base built in Notion — hover the pins to peek inside.
                </p>
              </div>
            </div>
          </div>


          <h1 className="font-serif-pro italic font-normal max-w-4xl text-balance text-5xl leading-[1.02] tracking-[-0.02em] md:text-[76px]">
            One central knowledge hub.
            <br />
            <span className="text-gradient-warm">Your centre of truth.</span>
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
              Book a free intro call
              <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                <ArrowRight className="h-4 w-4 shrink-0" />
              </span>
            </button>
            <a
              href="/scorecard"
              className="group inline-flex h-12 items-center rounded-md border border-hairline bg-background px-6 text-[14.5px] font-medium text-foreground transition-colors hover:bg-paper"
            >
              Take the 2-min Scorecard
              <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                <ArrowDown className="h-4 w-4 shrink-0" />
              </span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

