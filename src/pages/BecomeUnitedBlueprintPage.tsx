import { Fragment, useState } from "react";
import { ArrowRight, Sun, Moon, AlertTriangle, Sparkles } from "lucide-react";
import { LogoTilt } from "@/components/home-draft2/LogoTilt";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import brendanPhoto from "@/assets/brendan-cafe.webp";


const journey = [
  {
    stage: "Stage 1 — Now",
    title: "Consolidate",
    body: "One intentional tool stack. Your work lives in Notion. AI can read it.",
    highlight: true,
  },
  {
    stage: "Stage 2",
    title: "Automate",
    body: "Notion custom agents handle recurring tasks on a schedule, without you.",
  },
  {
    stage: "Stage 3",
    title: "Scale",
    body: "Custom workers connect agents to every tool you use. Become United runs like a larger team.",
  },
];

const tools = [
  {
    tool: "ChatGPT Plus",
    where: "Good for fast drafts and ideation",
    flag: "Trains on your data on Plus and below. Not suitable for beneficiary data.",
  },
  {
    tool: "Claude nonprofit",
    where: "Underused. Better for structured documents and grant writing",
    flag: "Confirm you are on the Team plan, not Pro or Max.",
  },
  {
    tool: "Wispr Flow",
    where: "Strong habit — extend it further",
    flag: "Turn Privacy Mode on. Do not dictate beneficiary names or safeguarding notes.",
  },
  {
    tool: "Asana Free",
    where: "Replace",
    flag: "No data protection agreement on the free plan. Remove personal data before migrating.",
  },
  {
    tool: "Otter",
    where: "Drop once meeting notes have a better home",
    flag: "Export and delete transcripts containing beneficiary or trustee names.",
  },
  {
    tool: "Google Drive",
    where: "Useful but isolated — AI cannot search across it",
    flag: "If this is a personal account rather than a paid Workspace tenant, charity files should not be stored here.",
  },
  {
    tool: "Hootsuite",
    where: "Expensive for solo use. Worth reviewing when the time is right",
    flag: "",
  },
  {
    tool: "Canva Pro, Xero, Zoom",
    where: "Keep. No urgent changes needed",
    flag: "",
  },
];

const recommended = [
  {
    name: "Notion",
    body: "Your central hub. Replaces Asana, becomes your CRM, connects to Claude and ChatGPT. ~£8/mo nonprofit.",
  },
  {
    name: "Claude",
    body: "Already in your stack. With Notion as its context source, it becomes an operational partner.",
  },
  {
    name: "Notion Mail",
    body: "Email management inside the same workspace. Replaces the dual-inbox juggle.",
  },
  {
    name: "Notion Calendar",
    body: "Meetings, deadlines, and tasks in one view. No context-switching.",
  },
  {
    name: "Notion Meeting Notes",
    body: "Structured meeting notes live inside the same workspace as your projects, tasks, and goals. No more scattered docs.",
  },
  {
    name: "Buffer",
    body: "Simpler and more affordable than Hootsuite for social scheduling.",
  },
];

const possible = [
  {
    name: "Claude",
    body: "Connected to a well-structured Notion workspace, your primary thinking and writing partner becomes something closer to a chief of staff.",
  },
  {
    name: "Notion custom agents",
    body: "Programmable AIs that act on a schedule or a trigger, inside Notion, with no device needing to stay on. You can build these yourself. They run on credits.",
  },
  {
    name: "Notion Workers",
    body: "Custom integrations built with Notion's CLI and SDK. Let your agents connect to your other tools. More technical to build well — worth doing with support.",
  },
  {
    name: "Claude Coworker",
    body: "A desktop tool that lets Claude take actions on your computer. Requires a dedicated device that stays on. One to return to when the time is right.",
  },
];

const services = [
  {
    name: "Notion Workspace Setup",
    price: "£3,600",
    body: "A fully built workspace tailored to Become United. Databases, templates, and connected tools, set up and ready to use.",
    highlight: true,
  },
  {
    name: "Workspace + Automated Workflows",
    price: "On request",
    body: "Everything in the setup package, plus automated workflows that handle recurring tasks without you initiating them.",
  },
  {
    name: "Async Monthly Support",
    price: "£800/month",
    body: "You do most of the building. Ten dedicated hours across the month — for questions, reviews, and unblocking anything that needs a second pair of eyes.",
  },
];

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
    {children}
  </div>
);

const BecomeUnitedBlueprintPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="notion-canvas min-h-screen overflow-x-hidden" data-theme={theme}>
      <Navigation variant={theme === "dark" ? "image-hero" : "default"} hideLogo />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-hairline">
          <div aria-hidden className="aurora"><span /></div>
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              maskImage: "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 25%, black 35%, transparent 85%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
            <div className="flex flex-col items-center text-center">
              <div className="fade-up mb-8">
                <LogoTilt className="h-28 sm:h-36 md:h-44" theme={theme} />
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="fade-up fade-up-1 relative inline-flex h-8 w-[72px] items-center rounded-full border border-hairline bg-paper/70 px-1 backdrop-blur transition-colors hover:border-indigo/50"
              >
                <span
                  className={`absolute top-1 grid h-6 w-6 place-items-center rounded-full text-accent-foreground shadow-[0_2px_8px_-2px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out ${
                    theme === "dark" ? "left-1" : "left-[calc(100%-1.75rem)]"
                  }`}
                  style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--orange)), hsl(var(--violet)))" }}
                >
                  {theme === "dark" ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                </span>
                <span className="flex w-full items-center justify-between px-1.5 text-ink-soft/60">
                  <Sun className={`h-3 w-3 transition-opacity ${theme === "light" ? "opacity-0" : "opacity-100"}`} />
                  <Moon className={`h-3 w-3 transition-opacity ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
                </span>
              </button>

              <h1 className="font-sans not-italic fade-up fade-up-2 mt-7 max-w-5xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.035em] md:text-[84px]">
                Your AI Blueprint
                <br />
                <span
                  className="font-serif-pro italic font-normal bg-clip-text text-transparent text-5xl md:text-7xl"
                  style={{ backgroundImage: "linear-gradient(100deg, var(--gradient-4color))" }}
                >
                  Become United's Path Forwards
                </span>
              </h1>

              <p className="fade-up fade-up-3 mt-7 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                Become United — AI Blueprint
                <br />
                <span className="text-muted-foreground text-[13px]">
                  Session: 2 June 2026 · Delivered by Brendan Rodgers, Thread &amp; Stack
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* PERSONAL INTRO */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="shrink-0">
                <img
                  src={brendanPhoto}
                  alt="Brendan Rodgers"
                  className="h-40 w-40 md:h-52 md:w-52 rounded-2xl object-cover shadow-[0_8px_30px_-10px_rgba(0,0,0,0.3)] border border-hairline"
                />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  Hi Mohammed,
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  It was great to meet you, thanks for joining me for an AI Power Hour.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  You are already doing the hard part: you are using AI regularly, thinking critically about it, and asking the right questions about what comes next.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  This is a practical guide to where to go from here, that pays attention to Data Protection, and the obvious goal of giving you more time to do your best work.
                </p>
                <p className="mt-6 font-serif-pro italic text-lg text-foreground">
                  — Brendan
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* THE JOURNEY */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <SectionLabel>Where we're going</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-12">The Journey</h2>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
              {journey.map((j, i) => (
                <Fragment key={j.title}>
                  <div
                    className={`rounded-2xl border ${
                      j.highlight ? "border-indigo/60 ring-1 ring-indigo/30" : "border-hairline"
                    } bg-paper/40 p-6 md:p-7 backdrop-blur-sm`}
                  >
                    <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {j.stage}
                    </div>
                    <h3 className="font-serif-pro italic text-2xl md:text-3xl mt-2 mb-3">{j.title}</h3>
                    <p className="text-[14.5px] leading-relaxed text-ink-soft">{j.body}</p>
                  </div>
                  {i < journey.length - 1 && (
                    <div className="hidden md:flex items-center justify-center text-muted-foreground/60">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* THE BOTTLENECK */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <SectionLabel>Why this matters</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-8">The Bottleneck</h2>
            <div className="space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                Right now, your tools don't talk to each other. Files live in Drive, tasks in Asana,
                conversations in ChatGPT and Claude, notes in Otter, scheduling in Hootsuite. None of
                it shares context. So the human — you — does all the bridging. Every time you move
                between tools you carry the context in your head, paste it across, and rebuild the
                picture from scratch.
              </p>
              <p>
                Consolidating into one AI-readable system lifts that cognitive load. When your work
                lives in a single place that AI can actually read, you stop being the integration
                layer. The system holds the context. You make the decisions.
              </p>
            </div>
          </div>
        </section>

        {/* YOUR CURRENT TOOLS */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <SectionLabel>Stack audit</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-10">
              Your Current Tools
            </h2>

            <div className="overflow-hidden rounded-2xl border border-hairline bg-paper/40 backdrop-blur-sm">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[1fr_1.4fr_1.6fr] gap-6 px-6 py-4 border-b border-hairline text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <div>Tool</div>
                <div>Where it stands</div>
                <div>Important flag</div>
              </div>
              <ul className="divide-y divide-hairline">
                {tools.map((t) => (
                  <li
                    key={t.tool}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1.6fr] gap-2 md:gap-6 px-6 py-5"
                  >
                    <div className="font-medium text-foreground text-[15px]">{t.tool}</div>
                    <div className="text-[14.5px] leading-relaxed text-ink-soft">{t.where}</div>
                    <div className="text-[14px] leading-relaxed text-amber-500 dark:text-amber-400 flex gap-2">
                      {t.flag && <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />}
                      <span>{t.flag || <span className="text-muted-foreground/50">—</span>}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* RECOMMENDED TOOLS */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <SectionLabel>The shortlist</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-10">
              Recommended Tools to Adopt
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl border border-hairline bg-paper/40 p-6 backdrop-blur-sm hover:border-indigo/40 transition-colors"
                >
                  <h3 className="font-serif-pro italic text-2xl mb-2">{r.name}</h3>
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONSOLIDATION BLUEPRINT */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
            <SectionLabel>The plan</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-8">
              Consolidation Blueprint
            </h2>
            <div className="space-y-5 text-[16px] leading-relaxed text-ink-soft">
              <p>
                Notion connects to Claude and ChatGPT natively. That matters — it means your
                workspace becomes the shared memory those tools draw on, rather than yet another
                place you have to manage on the side. For a team of your size, Notion also works
                comfortably as a CRM, so your contacts, partners, and funders all live next to the
                work itself.
              </p>
              <p>
                We built a working session manager live in the session today. That same approach
                scales — every recurring process you run can become a small, structured area inside
                Notion that your AI tools can read, reason about, and update.
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-hairline bg-muted/40 px-5 py-4 text-[13.5px] text-ink-soft">
              Use my affiliate link for a free month on a small team plan. Add me to your workspace
              if you want a hand getting started.{" "}
              <a className="text-indigo underline underline-offset-4 hover:opacity-80" href="mailto:br@threadandstack.com">
                br@threadandstack.com
              </a>
            </div>
          </div>
        </section>

        {/* WHAT BECOMES POSSIBLE */}
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <SectionLabel>The horizon</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-6">
              What Becomes Possible
            </h2>
            <p className="max-w-2xl mb-10 text-[16px] leading-relaxed text-ink-soft">
              Once your work lives in one AI-readable place, a new layer opens up. These are the
              pieces, in roughly the order you'd reach for them.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {possible.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border border-hairline bg-paper/40 p-6 backdrop-blur-sm"
                >
                  <Sparkles className="h-4 w-4 text-violet mb-3" />
                  <h3 className="font-serif-pro italic text-xl mb-2">{p.name}</h3>
                  <p className="text-[14px] leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              ))}
            </div>

            <h3 className="font-serif-pro italic text-3xl md:text-4xl tracking-tight mt-16 mb-6">
              Two examples for Become United
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Funding search agent",
                  body: "Runs weekly, searches for new grant opportunities relevant to your mission, stores results in Notion, and sends you a summary every Friday with recommended next actions. You stop hunting for funding. The work comes to you.",
                },
                {
                  title: "Session data agent",
                  body: "Picks up submitted session forms from your freelancers, compiles a weekly roundup of sessions, attendance, and flagged concerns, and surfaces that summary without you asking. Grant season stops being a scramble.",
                },
              ].map((e) => (
                <div
                  key={e.title}
                  className="rounded-2xl border border-hairline border-l-[3px] border-l-indigo bg-paper/40 p-6 md:p-7 backdrop-blur-sm"
                >
                  <h4 className="font-serif-pro italic text-2xl mb-3">{e.title}</h4>
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">{e.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW I CAN HELP */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <SectionLabel>Working together</SectionLabel>
            <h2 className="font-serif-pro italic text-4xl md:text-5xl tracking-tight mb-10">
              How I Can Help
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.name}
                  className={`rounded-2xl border ${
                    s.highlight ? "border-indigo/60 ring-1 ring-indigo/30" : "border-hairline"
                  } bg-paper/40 p-6 md:p-7 backdrop-blur-sm flex flex-col`}
                >
                  <h3 className="font-serif-pro italic text-2xl mb-2">{s.name}</h3>
                  <div
                    className="text-2xl font-medium mb-4 bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                  >
                    {s.price}
                  </div>
                  <p className="text-[14.5px] leading-relaxed text-ink-soft">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href="mailto:br@threadandstack.com"
                className="group inline-flex h-12 items-center rounded-md px-6 text-[14.5px] font-medium text-accent-foreground shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-px"
                style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
              >
                Start a conversation
                <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeUnitedBlueprintPage;
