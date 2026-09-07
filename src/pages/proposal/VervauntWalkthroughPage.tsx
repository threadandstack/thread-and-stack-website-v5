import { useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import BlackStacked from "@/assets/logos/Black_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";
import vervauntLogo from "@/assets/proposal/vervaunt-black.png.asset.json";
import harvestLogo from "@/assets/proposal/harvest-logo.png.asset.json";

/* ---------------------------- Helpers ---------------------------- */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
};

const SectionHead = ({
  num,
  eyebrow,
  title,
  rotate = -0.3,
}: {
  num?: string;
  eyebrow?: string;
  title: React.ReactNode;
  rotate?: number;
}) => (
  <motion.div {...fadeUp} className="mb-10 md:mb-14">
    {eyebrow && (
      <div className="mb-4 font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
        {eyebrow}
      </div>
    )}
    <div className="flex items-baseline gap-4 md:gap-5">
      {num && (
        <span className="font-serif-pro text-3xl md:text-5xl font-light italic text-gradient-warm leading-none flex-shrink-0">
          {num}
        </span>
      )}
      <h2
        className="font-serif-pro text-[30px] sm:text-4xl md:text-[42px] italic font-medium leading-[1.1] tracking-tight text-foreground text-balance"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {title}
      </h2>
    </div>
  </motion.div>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <motion.p {...fadeUp} className="font-sans text-[16.5px] md:text-[17px] leading-[1.8] text-foreground/85 mb-6">
    {children}
  </motion.p>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <motion.h3
    {...fadeUp}
    className="font-serif-pro text-[22px] md:text-[26px] italic font-medium text-foreground mt-12 mb-5 leading-snug"
  >
    {children}
  </motion.h3>
);

const Prompt = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    {...fadeUp}
    className="font-sans text-[14px] italic text-muted-foreground leading-[1.7] mb-8 border-l-[2px] border-border pl-5"
  >
    {children}
  </motion.p>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <motion.ul {...fadeUp} className="space-y-3 mb-8 list-none pl-0">
    {items.map((it, i) => (
      <li key={i} className="relative pl-6 text-[16.5px] leading-[1.75] text-foreground/85">
        <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-accent" />
        {it}
      </li>
    ))}
  </motion.ul>
);

const Rule = () => (
  <div className="my-20 md:my-28 flex justify-center">
    <span className="h-px w-16 bg-border" />
  </div>
);

const Caveat = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    {...fadeUp}
    className="my-8 rounded-2xl border border-border bg-muted/40 px-6 py-5"
  >
    <p className="font-sans text-[15px] leading-[1.75] text-foreground/85 m-0">{children}</p>
  </motion.div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    {...fadeUp}
    className="rounded-2xl border border-border bg-card/40 px-6 py-5 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.08)]"
  >
    <h4 className="font-serif-pro text-[19px] italic font-medium text-foreground leading-snug mb-2">{title}</h4>
    <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0">{children}</p>
  </motion.div>
);

const Pull = ({ children }: { children: React.ReactNode }) => (
  <motion.blockquote {...fadeUp} className="my-12 border-l-[3px] border-accent pl-6">
    <p className="font-serif-pro text-[22px] md:text-[26px] italic font-medium leading-[1.5] text-foreground text-balance m-0">
      {children}
    </p>
  </motion.blockquote>
);

/* ---------------------------- Content ---------------------------- */

const MEASURABLE = [
  <><strong>Late submission, cleanly.</strong> Submission timestamp against the date being logged gives median lag per person and per team.</>,
  <><strong>Poor categorisation, cleanly.</strong> Distribution across projects, clients and task types, and the share sitting in generic catch-all categories.</>,
  <><strong>Edit history.</strong> The closest thing to ground truth Harvest holds. A retrospectively corrected entry is someone stating the original was wrong.</>,
];

const PEOPLE = [
  {
    title: "Whoever owns utilisation and resourcing",
    body: "Two questions: what decision are you unable to make today, and what is the coarsest data that would let you make it. The second half is how you avoid building a system that demands maximum precision everywhere. Also worth establishing whether inaccuracy is judged against an existing policy line or against the admin burden of rework.",
  },
  {
    title: "Three or four team leads",
    body: "Covering the different failure patterns, twenty minutes each, widening only if the patterns do not hold. I would frame it behaviourally: what factors are you seeing, rather than whose numbers are bad. And I would say early rather than late that this is not about penalising anyone.",
  },
  {
    title: "The people actually logging",
    body: "Leads under-report the workarounds, because workarounds are mildly embarrassing. This is also where rollout credibility comes from later: the design came from watching how people work, not from the utilisation report.",
  },
  {
    title: "An anonymous survey to the whole delivery team",
    body: "Not a selected cohort, because selecting by failure record means people work out why they were picked. I would invite by preference instead: particularly keen to hear from anyone who does not love Harvest, especially anyone who has built their own workaround. Self-selection flips the social meaning of responding from confessing to being consulted. Two open questions and one scale, no team field, because team plus failure mode identifies people anyway.",
  },
];

const MCP_CAPABILITIES = [
  "Logging past time, and editing an entry's hours, notes, project, task or date",
  "Deleting entries, reviewing entries across any date range, and submitting timesheets for approval",
  "Time reports grouped by project, client or person, with billable and non-billable splits",
  "Entries record start and end clock times rather than totals, so when work happened is measurable as well as how much",
  "Reads account settings, including whether approvals are on and how time is rounded, so it validates against policy rather than guessing",
];

const OPTIONS = [
  {
    title: "Calendar-based auto-logging",
    body: "Attractive because it requires nothing of the user, but calendar records intent rather than activity, and inferring billable time from someone's diary is the version of this most likely to be read as surveillance. Better as an input to a prompt than as a source of truth.",
  },
  {
    title: "Stricter enforcement, locked timesheets, chase reminders",
    body: "Cheapest to implement and it does move submission lag. But it addresses the symptom the reporting layer sees rather than the reason people log late, and it buys compliance at the cost of trust, which is expensive in a team already mixed on AI.",
  },
  {
    title: "Replacing Harvest",
    body: "Out of proportion. The problems described are behavioural and definitional, not a limitation of the platform, and a migration would consume the goodwill needed for anything else.",
  },
];

const METRICS = [
  "Median lag between work date and submission",
  "Rate of retrospective edits",
  "Share of time sitting in generic catch-all categories",
];

const RISKS = [
  {
    title: "Enforcing an undefined standard",
    body: "The largest risk. Tighter tracking against an undefined standard produces a team that games the numbers rather than one that trusts them. Mitigated by settling the policy question before building anything.",
  },
  {
    title: "Privacy and activity tracking",
    body: "Largely answered by the permissions model. The MCP respects existing Harvest roles: the assistant acts as the user, sees only what their role allows, and cannot edit time belonging to someone else. Managers can log on behalf of a teammate only where their role already permits it, so leads keep the escalation path they have now. Nothing the assistant does is something the person could not do themselves. The sharper question is the calendar signal, which is why it stays an input to a prompt rather than an audit trail.",
  },
  {
    title: "AI categorisation accuracy",
    body: "Mitigated by keeping the human as the confirming step, and by tracking correction rate as a kill criterion rather than a nice-to-know.",
  },
  {
    title: "Tool fatigue",
    body: "Partly answered by a workflow that removes steps rather than adding them, and by the old method staying available throughout.",
  },
  {
    title: "Pilot self-selection",
    body: "Volunteers are the easiest cohort in the company and were probably logging reasonably well already, so wave one numbers will look better than they mean. Mitigated by the concurrent nominated team, and by being upfront about what each track proves.",
  },
];

/* ---------------------------- Page ---------------------------- */

const VervauntWalkthroughPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Harvest time tracking walkthrough · Vervaunt · Thread & Stack";

    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <style>{`
        @media print {
          main, main * {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            animation: none !important;
            transition: none !important;
          }
          main section, main .rounded-2xl, main img, main h1, main h2, main h3, main h4, main p, main li {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page { margin: 14mm; }
        }
      `}</style>

      {/* Download */}
      <div className="fixed top-4 right-4 z-40 print:hidden">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-background/80 backdrop-blur border border-border px-4 py-2 text-xs font-sans font-medium text-foreground shadow-sm hover:shadow-md transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>

      {/* Editorial header */}
      <header className="px-5 sm:px-8 pt-24 sm:pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-2xl mx-auto text-center flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-sans text-[10.5px] sm:text-[11px] tracking-[0.28em] uppercase text-muted-foreground mb-8 sm:mb-10 order-1 sm:order-2"
          >
            Second round task <span className="text-muted-foreground/40 mx-2">·</span> Vervaunt{" "}
            <span className="text-muted-foreground/40 mx-2">·</span> 8 September 2026
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-center justify-center gap-6 sm:gap-8 mb-12 sm:mb-14 order-2 sm:order-1"
          >
            <img src={BlackStacked} alt="Thread & Stack" className="h-20 md:h-24 w-auto" />
            <span className="h-14 md:h-16 w-px bg-border" aria-hidden="true" />
            <img
              src={vervauntLogo.url}
              alt="Vervaunt"
              className="h-6 md:h-8 w-auto dark:invert"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="font-serif-pro text-[36px] sm:text-5xl md:text-6xl italic font-medium leading-[1.05] tracking-tight text-foreground text-balance mb-8 order-3"
          >
            An accurate week,{" "}
            <span className="inline-block text-gradient-warm" style={{ transform: "translateY(1px)" }}>
              cheaper to produce.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-[16px] sm:text-[17px] text-foreground/75 leading-[1.7] max-w-xl mx-auto text-balance mb-6 order-4"
          >
            Harvest time tracking: diagnosis, approach, rollout, measurement and risk. Working notes
            for a 30 to 40 minute walkthrough, not a working prototype.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-[13px] text-muted-foreground leading-[1.8] order-5"
          >
            Brendan Rodgers · Head of AI &amp; Automation
            <br />
            Tuesday 8 September 2026, 12:30 to 13:30, 10 Devonshire Square
          </motion.div>
        </div>
      </header>

      {/* Body */}
      <div className="px-5 sm:px-8 pb-24">
        <div className="max-w-2xl mx-auto">
          <Rule />

          {/* 00 */}
          <section>
            <SectionHead num="00" eyebrow="Where this starts" title={<>The problem, and two things worth saying first</>} />
            <P>
              Harvest is used for time tracking across the team. In practice: time logged does not
              reflect time actually spent, people log days or weeks after the fact from memory, and
              time gets logged against the wrong project, client or task type. The knock-on effects
              land in utilisation accuracy, resourcing decisions and reporting.
            </P>
            <P>
              Some of what looks like inaccuracy is people making reasonable individual decisions in
              the absence of a rule. Nobody has decided whether a logged day reconciles to seven
              hours or eight, whether internal meetings bill to a project or to overhead, or whether
              a rounded block is acceptable practice or a defect. Until that is settled, accuracy has
              no definition, and a tool built on top of it only enforces an ambiguity faster.
            </P>
            <P>
              And the reporting layer may be asking for the wrong thing. If resourcing decisions need
              to know whether an account is over-serviced, hour-level per-task precision may exceed
              what the decision requires, and chasing it costs goodwill needed later at rollout.
            </P>
          </section>

          <Rule />

          {/* 01 */}
          <section>
            <SectionHead num="01" eyebrow="Diagnosis" title={<>Find out why before proposing a fix</>} />
            <Prompt>
              How would you find out why this is happening before proposing a fix? What would you
              want to look at or ask, and who would you talk to?
            </Prompt>

            <H3>The opening hypothesis</H3>
            <P>
              Friction. Time logging carries cognitive load and context switching that delivery staff
              resent, regardless of interface quality. Stated as a hypothesis rather than a
              conclusion, because it is falsifiable and the data can settle it.
            </P>

            <H3>What I would look at</H3>
            <motion.div {...fadeUp} className="mb-2 font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
              Measurable from Harvest alone
            </motion.div>
            <BulletList items={MEASURABLE} />

            <Caveat>
              <strong>Not measurable from Harvest:</strong> accuracy as a percentage. There is no
              independent record of what actually happened. Either name a proxy and label it as one,
              or take the accuracy read qualitatively and stop calling it a percentage. A figure with
              no source is the first thing that gets challenged.
            </Caveat>

            <P>
              <strong>Calendar as a second source.</strong> Calendar is a signal about where attention
              went, not a record of where it went. It can prompt, but it cannot audit. Someone logging
              Monday nine to five on project A whose calendar shows meetings on B and C is not proof
              the log is wrong. But the divergence rate across the team is itself diagnostic: broad
              agreement points to a timing problem, systematic divergence points to logging against
              plan rather than reality, or to project codes that do not match how work actually flows.
            </P>

            <H3>Who I would talk to</H3>
            <div className="flex flex-col gap-4 mb-8">
              {PEOPLE.map((p) => (
                <Card key={p.title} title={p.title}>{p.body}</Card>
              ))}
            </div>

            <P>
              Workarounds are where the real design brief lives: the spreadsheet someone keeps, the
              notes app, the Friday afternoon reconstruction ritual. I would not open the survey with
              the failure percentages. It tells the team in the first line that they have been
              measured and found wanting, and it anchors every answer defensively.
            </P>
            <motion.p {...fadeUp} className="font-sans text-[14px] text-muted-foreground">
              Timeframe: a couple of weeks, not a couple of months.
            </motion.p>
          </section>

          <Rule />

          {/* 02 */}
          <section>
            <SectionHead num="02" eyebrow="Approach & tools" title={<>What I would actually recommend</>} />
            <Prompt>
              What combination of tooling, automation, AI or process change would you use? Trade-offs
              of a few options, and what you'd actually recommend and why.
            </Prompt>

            <motion.div
              {...fadeUp}
              className="relative rounded-2xl border border-accent/40 bg-card/60 px-6 sm:px-8 py-8 shadow-[0_2px_30px_-14px_rgba(0,0,0,0.15)] mb-8"
            >
              <span className="absolute -top-3 left-6 sm:left-8 bg-accent text-accent-foreground text-[10.5px] font-sans font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full">
                The recommendation
              </span>
              <div className="flex items-center gap-4 mt-2 mb-4">
                <img
                  src={harvestLogo.url}
                  alt="Harvest"
                  className="h-10 w-10 rounded-lg flex-shrink-0"
                />
                <h3 className="font-serif-pro text-[26px] md:text-[30px] italic font-medium text-foreground leading-tight">
                  Voice-based reconstruction through the Harvest MCP
                </h3>
              </div>
              <p className="font-sans text-[16px] leading-[1.8] text-foreground/85">
                Reconstructing a week by talking is lower cognitive load than filling a grid, which
                answers the friction hypothesis directly. It also solves categorisation sideways: the
                person describes what they worked on in their own words, and the assistant maps it to
                project codes. Nobody has to hold the taxonomy in their head, which is the real
                friction, not the interface.
              </p>
              <div className="mt-7 pt-6 border-t border-border">
                <div className="mb-4 font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
                  What the MCP supports
                </div>
                <ul className="space-y-3 list-none pl-0">
                  {MCP_CAPABILITIES.map((c, i) => (
                    <li key={i} className="relative pl-6 text-[15.5px] leading-[1.7] text-foreground/85">
                      <span className="absolute left-0 top-[0.7em] w-[7px] h-[7px] rounded-full border-[1.5px] border-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-sans text-[12.5px] text-muted-foreground mt-5 m-0">
                Verified against Harvest support documentation, 7 September 2026.
              </p>
            </motion.div>

            <P>
              Once the policy question is settled, the tool has something to enforce. Harvest also
              ships a native Notion integration for tracking time from Notion tasks, separate from the
              MCP. Worth using that as the integration story rather than building bespoke.
            </P>

            <H3>The options considered, and why not</H3>
            <div className="flex flex-col gap-4 mb-4">
              {OPTIONS.map((o) => (
                <Card key={o.title} title={o.title}>{o.body}</Card>
              ))}
            </div>

            <Pull>
              The open trade-off is cadence. Weekly reconstruction still bakes in the recall problem.
              Daily is where the accuracy is, but daily is where adoption dies. The position I would
              take: a short end-of-day pass with a Friday reconciliation, cadence tested rather than
              mandated.
            </Pull>

            <Caveat>
              <strong>What this cannot do.</strong> The MCP is a read and write surface for Harvest.
              It is not evidence about what someone actually did. Nothing here makes an inaccurate
              account of a day accurate. It makes an accurate account cheaper to produce.
            </Caveat>
          </section>

          <Rule />

          {/* 03 */}
          <section>
            <SectionHead num="03" eyebrow="Rollout & adoption" title={<>Getting buy-in, and making it stick</>} />
            <Prompt>
              How would you roll this out? How would you get buy-in, handle resistance, and make it
              stick?
            </Prompt>

            <P>
              The structural advantage: this fix removes work rather than adding it. Most time-tracking
              initiatives arrive as more discipline. This one arrives as stop filling in the grid, just
              say what you did. That is the pitch, and it lands better from a lead who volunteered than
              from the person who owns the project.
            </P>

            <H3>Two tracks, run concurrently</H3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card/40 px-6 py-6">
                <span className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">Track A</span>
                <h4 className="font-serif-pro text-[21px] italic font-medium text-foreground leading-tight mt-2 mb-3">
                  Open registration across the org
                </h4>
                <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0">
                  Not mandatory, so who opts in is itself information. Volunteers say what is broken
                  because they have no reason to protect the initiative. They also become the people
                  who answer the sceptics later, and adoption spreads horizontally far better than it
                  spreads down from whoever owns utilisation.
                </p>
              </motion.div>
              <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card/40 px-6 py-6">
                <span className="font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">Track B</span>
                <h4 className="font-serif-pro text-[21px] italic font-medium text-foreground leading-tight mt-2 mb-3">
                  One nominated team
                </h4>
                <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0">
                  Agreed through the lead rather than around them, and selected on team-level baseline,
                  which is a team-level fact a lead can hear without anyone feeling named. If the lead
                  wants to narrow it, I would let them choose on workload variety instead, someone on retainer
                  work, someone jumping between projects.
                </p>
              </motion.div>
            </div>

            <P>
              Why both: volunteers answer whether the workflow works at all, quickly and honestly. The
              nominated team answers whether it changes behaviour in people who did not choose it,
              which is the question the utilisation owner actually cares about. Running them at once
              avoids waiting a month to discover the easy cohort was easy.
            </P>

            <H3>Handling resistance</H3>
            <div className="flex flex-col gap-4 mb-8">
              <Card title="What the nominated lead gets in return">
                An explicit escape hatch, anyone who wants to go back to the grid can, no questions.
                And presence in their team channel for the first fortnight, fixing things fast. That
                converts it from volunteering your team for my project into you have support and an
                exit.
              </Card>
              <Card title="Why the escape hatch strengthens measurement">
                If almost nobody takes it, that is far more credible adoption evidence than a mandate,
                where compliance cannot be told apart from preference. The ask stays light: the old way
                remains available, try it once this week, and if it goes well, choose it again.
              </Card>
            </div>

            <H3>Making it stick</H3>
            <P>
              A Slack channel for AI feature requests and one for beta testing, open to anyone
              interested. Deliberately not one representative per team, because that quietly creates an
              unpaid AI liaison role nobody asked for, and a favour like that fades when real work gets
              busy however good the tool is. Self-interest in a useful tool is durable. Relaying updates
              to eight colleagues who did not ask is not.
            </P>
            <P>
              Framed as testing and influence rather than early access, with a clear date when it is
              open to everyone regardless of enthusiasm, so the workflow does not become a status
              marker that entrenches the sceptics. This is also the answer to the brief's note that
              Harvest is one example. What is left behind is a standing intake for AI work across the
              agency, not a single fix.
            </P>
          </section>

          <Rule />

          {/* 04 */}
          <section>
            <SectionHead num="04" eyebrow="Measuring success" title={<>What improved looks like in practice</>} />
            <Prompt>
              What would "improved" look like in practice, and how would you know it's working? What
              would you measure, over what timeframe?
            </Prompt>

            <P>
              Measurement comes from the MCP directly rather than from volunteers self-reporting
              improvement. I would pull entries for the cohort and compare against their own pre-pilot
              baseline. The baseline must be built before anything changes, and built the same way each
              month so it stays comparable.
            </P>

            <motion.div {...fadeUp} className="mb-2 font-sans text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
              The three measures
            </motion.div>
            <BulletList items={METRICS} />

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <motion.div {...fadeUp} className="rounded-2xl bg-muted/50 px-6 py-6">
                <h4 className="font-serif-pro text-[21px] italic font-medium text-foreground mb-2">Widen when</h4>
                <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0">
                  Median submission lag drops under a day, retrospective edits fall meaningfully against
                  the cohort's own baseline, and most of the cohort is still choosing it in week four
                  without being reminded. The last is the honest signal, because the first two can be
                  produced by novelty.
                </p>
              </motion.div>
              <motion.div {...fadeUp} className="rounded-2xl bg-muted/50 px-6 py-6">
                <h4 className="font-serif-pro text-[21px] italic font-medium text-foreground mb-2">Stop and rethink when</h4>
                <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0">
                  Usage decays after the first fortnight, or category suggestions are corrected often
                  enough that people stop trusting them. A suggestion that has to be checked every time
                  is worse than no suggestion.
                </p>
              </motion.div>
            </div>

            <P>
              <strong>Timeframe: four weeks.</strong> Long enough for novelty to wear off, short enough
              that it does not look like empire building.
            </P>
            <P>
              <strong>Comparison team.</strong> I would track a similar team running nothing over the same
              weeks. Selecting the pilot on the worst baseline means some improvement arrives on its own
              through regression to the mean. If the pilot improves and the comparison does not, there
              is something real. If both improve, the intervention was attention rather than tooling,
              which is useful to know and considerably cheaper than any tool.
            </P>

            <Caveat>
              <strong>What I would not promise.</strong> A voluntary once-a-week trial will not move
              utilisation numbers in four weeks. This phase answers whether people want it. Accuracy
              gains arrive when it becomes the default way of working. And the caveat running through
              all of it: people behaving better because they are being watched is not a solve.
            </Caveat>
          </section>

          <Rule />

          {/* 05 */}
          <section>
            <SectionHead num="05" eyebrow="Risks & limitations" title={<>What could go wrong</>} />
            <Prompt>What could go wrong, and how would you mitigate it?</Prompt>

            <div className="flex flex-col gap-4">
              {RISKS.map((r, i) => (
                <motion.div
                  key={r.title}
                  {...fadeUp}
                  className="rounded-2xl border border-border bg-card/40 px-6 py-5 shadow-[0_2px_24px_-12px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-serif-pro text-[22px] font-light italic text-gradient-warm leading-none flex-shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="font-serif-pro text-[19px] italic font-medium text-foreground leading-snug">
                      {r.title}
                    </h4>
                  </div>
                  <p className="font-sans text-[15px] leading-[1.75] text-foreground/75 m-0 pl-9">{r.body}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <Rule />

          {/* 06 */}
          <section>
            <SectionHead num="06" eyebrow="Format" title={<>Format and time</>} />
            <P>
              Working notes, talked through. This page is the reference version. Roughly three hours of
              prep, plus verifying the Harvest MCP documentation rather than assuming its capabilities.
            </P>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-5 sm:px-8 py-10">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <p className="font-sans text-[14px] text-muted-foreground m-0">
            Brendan Rodgers ·{" "}
            <a href="https://threadandstack.com/" className="text-accent hover:underline">
              threadandstack.com
            </a>
          </p>
          <img src={GreyStacked} alt="Thread & Stack" className="h-10 opacity-50 flex-shrink-0" />
        </div>
      </footer>
    </main>
  );
};

export default VervauntWalkthroughPage;
