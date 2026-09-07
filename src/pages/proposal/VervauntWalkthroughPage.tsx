import { useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhiteStacked from "@/assets/logos/White_TS_Stacked.svg";
import GreyStacked from "@/assets/logos/Grey_TS_Stacked.svg";

const CheckIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8">
    <polyline points="1.5,4 3,5.5 6.5,2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SectionLabel = ({ num, title }: { num: string; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-sans text-[13px] font-bold tracking-wider text-accent">{num}</span>
    <span className="font-serif-pro text-[30px] italic font-semibold text-primary leading-tight">{title}</span>
  </div>
);

const Prompt = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-[13px] italic text-muted-foreground leading-[1.6] mb-5 -mt-2">{children}</p>
);

const Caveat = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FFFBEA] border-l-[3px] border-[#E5A800] rounded-r-[10px] p-3.5 px-[18px] mt-4">
    <p className="text-[13.5px] text-[#5a4500] m-0 leading-[1.65]">{children}</p>
  </div>
);

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-card rounded-2xl px-5 py-[18px] shadow-[var(--shadow-soft)] border border-border">
    <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary leading-tight mb-1.5">{title}</h4>
    <p className="text-[13.5px] text-muted-foreground leading-[1.65] m-0">{children}</p>
  </div>
);

const Ticks = ({ items }: { items: React.ReactNode[] }) => (
  <div className="flex flex-col gap-2.5">
    {items.map((item, i) => (
      <div key={i} className="flex items-start gap-2.5 text-[13.5px] text-foreground leading-[1.6]">
        <div className="w-4 h-4 rounded-full bg-accent/10 border-[1.5px] border-accent flex items-center justify-center flex-shrink-0 mt-px text-accent">
          <CheckIcon />
        </div>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

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
    body: "Covering the different failure patterns, twenty minutes each, widening only if the patterns do not hold. Framed behaviourally: what factors are you seeing. Not whose numbers are bad. Say early rather than late that this is not about penalising anyone.",
  },
  {
    title: "The people actually logging",
    body: "Leads under-report the workarounds, because workarounds are mildly embarrassing. This is also where rollout credibility comes from later: the design came from watching how people work, not from the utilisation report.",
  },
  {
    title: "An anonymous survey to the whole delivery team",
    body: "Not a selected cohort, because selecting by failure record means people work out why they were picked. Invite by preference instead: particularly keen to hear from anyone who does not love Harvest, especially anyone who has built their own workaround. Self-selection flips the social meaning of responding from confessing to being consulted. Two open questions and one scale, no team field, because team plus failure mode identifies people anyway.",
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

const VervauntWalkthroughPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Harvest time tracking walkthrough — Vervaunt · Thread & Stack";

    const metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    metaRobots.content = "noindex, nofollow";
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  return (
    <div className="min-h-screen bg-muted/50 flex justify-center items-start py-10 px-5 print:bg-white print:p-0">
      <div className="fixed top-5 right-5 z-50 print:hidden">
        <Button onClick={() => window.print()} size="sm" className="gap-2 rounded-lg shadow-lg">
          <Download className="w-3.5 h-3.5" />
          Download PDF
        </Button>
      </div>

      <div className="bg-background w-full max-w-[820px] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-14 pt-[52px] pb-11 max-sm:px-7 max-sm:pt-9 max-sm:pb-8">
          <div className="flex items-center gap-3 mb-6">
            <img src={WhiteStacked} alt="Thread & Stack" className="h-8" />
            <span className="text-primary-foreground/40">·</span>
            <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase text-[#FF6200]">Second round task</span>
          </div>
          <h1 className="font-serif-pro text-[52px] max-sm:text-[38px] italic font-bold leading-[1.15] text-primary-foreground mb-5">
            Make an accurate account of the week{" "}
            <span className="text-[#FF6200]">cheap to produce.</span>
          </h1>
          <p className="font-sans text-[15px] text-primary-foreground/70 leading-relaxed max-w-[600px]">
            Harvest time tracking: diagnosis, approach, rollout, measurement and risk. Working notes for a 30 to 40 minute walkthrough, not a working prototype.
          </p>
          <div className="mt-6 font-sans text-[12px] text-primary-foreground/40 leading-[1.8]">
            Brendan Rodgers · Head of AI &amp; Automation · Tuesday 8 September 2026, 12:30 to 13:30, 10 Devonshire Square
          </div>
        </div>

        {/* Body */}
        <div className="px-14 pt-[52px] pb-14 max-sm:px-7 max-sm:pt-9 max-sm:pb-9">
          {/* 00 */}
          <SectionLabel num="00" title="The problem, and two things worth saying first" />
          <div className="bg-muted rounded-2xl p-7 mb-5">
            <p className="text-[15px] leading-[1.7] text-foreground">
              Harvest is used for time tracking across the team. In practice: time logged does not reflect time actually spent, people log days or weeks after the fact from memory, and time gets logged against the wrong project, client or task type. The knock-on effects land in utilisation accuracy, resourcing decisions and reporting.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              Some of what looks like inaccuracy is people making reasonable individual decisions in the absence of a rule. Nobody has decided whether a logged day reconciles to seven hours or eight, whether internal meetings bill to a project or to overhead, or whether a rounded block is acceptable practice or a defect. Until that is settled, accuracy has no definition, and a tool built on top of it only enforces an ambiguity faster.
            </p>
            <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
              And the reporting layer may be asking for the wrong thing. If resourcing decisions need to know whether an account is over-serviced, hour-level per-task precision may exceed what the decision requires, and chasing it costs goodwill needed later at rollout.
            </p>
          </div>

          <div className="h-px bg-border my-10" />

          {/* 01 */}
          <SectionLabel num="01" title="Diagnosis" />
          <Prompt>How would you find out why this is happening before proposing a fix? What would you want to look at or ask, and who would you talk to?</Prompt>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-2">The opening hypothesis</h4>
          <p className="text-[15px] leading-[1.7] text-foreground mb-6">
            Friction. Time logging carries cognitive load and context switching that delivery staff resent, regardless of interface quality. Stated as a hypothesis rather than a conclusion, because it is falsifiable and the data can settle it.
          </p>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3">What I would look at</h4>
          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-4">
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-3">Measurable from Harvest alone</div>
            <Ticks items={MEASURABLE} />
          </div>

          <Caveat>
            <strong>Not measurable from Harvest:</strong> accuracy as a percentage. There is no independent record of what actually happened. Either name a proxy and label it as one, or take the accuracy read qualitatively and stop calling it a percentage. A figure with no source is the first thing that gets challenged.
          </Caveat>

          <p className="text-[15px] leading-[1.7] text-foreground mt-5">
            <strong>Calendar as a second source.</strong> Calendar is a signal about where attention went, not a record of where it went. It can prompt, but it cannot audit. Someone logging Monday nine to five on project A whose calendar shows meetings on B and C is not proof the log is wrong. But the divergence rate across the team is itself diagnostic: broad agreement points to a timing problem, systematic divergence points to logging against plan rather than reality, or to project codes that do not match how work actually flows.
          </p>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3 mt-8">Who I would talk to</h4>
          <div className="flex flex-col gap-3">
            {PEOPLE.map((p) => (
              <Card key={p.title} title={p.title}>{p.body}</Card>
            ))}
          </div>

          <p className="text-[15px] leading-[1.7] text-foreground mt-5">
            Workarounds are where the real design brief lives: the spreadsheet someone keeps, the notes app, the Friday afternoon reconstruction ritual. Do not open the survey with the failure percentages. It tells the team in the first line that they have been measured and found wanting, and it anchors every answer defensively.
          </p>
          <p className="text-[13px] text-muted-foreground mt-3">Timeframe: a couple of weeks, not a couple of months.</p>

          <div className="h-px bg-border my-10" />

          {/* 02 */}
          <SectionLabel num="02" title="Approach & tools" />
          <Prompt>What combination of tooling, automation, AI or process change would you use? Trade-offs of a few options, and what you'd actually recommend and why.</Prompt>

          <div className="bg-card rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-2 ring-accent relative">
            <div className="absolute -top-3 left-6">
              <span className="bg-accent text-accent-foreground text-[11px] font-sans font-semibold px-3 py-1 rounded-full whitespace-nowrap">The recommendation</span>
            </div>
            <h4 className="font-serif-pro text-[24px] italic font-semibold text-primary leading-tight mb-3 mt-2">
              Voice-based reconstruction through the Harvest MCP
            </h4>
            <p className="text-[14px] leading-[1.7] text-foreground">
              Reconstructing a week by talking is lower cognitive load than filling a grid, which answers the friction hypothesis directly. It also solves categorisation sideways: the person describes what they worked on in their own words, and the assistant maps it to project codes. Nobody has to hold the taxonomy in their head, which is the real friction, not the interface.
            </p>
            <div className="mt-5 pt-4 border-t border-border">
              <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-3">What the MCP supports</div>
              <Ticks items={MCP_CAPABILITIES} />
            </div>
            <p className="text-[12px] text-muted-foreground mt-4">Verified against Harvest support documentation, 7 September 2026.</p>
          </div>

          <p className="text-[15px] leading-[1.7] text-foreground mt-5">
            Once the policy question is settled, the tool has something to enforce. Harvest also ships a native Notion integration for tracking time from Notion tasks, separate from the MCP. Worth using that as the integration story rather than building bespoke.
          </p>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3 mt-8">The options considered, and why not</h4>
          <div className="flex flex-col gap-3">
            {OPTIONS.map((o) => (
              <Card key={o.title} title={o.title}>{o.body}</Card>
            ))}
          </div>

          <div className="border-l-[3px] border-accent pl-5 my-8">
            <p className="font-serif-pro text-xl italic leading-[1.55] text-primary">
              "The open trade-off is cadence. Weekly reconstruction still bakes in the recall problem. Daily is where the accuracy is, but daily is where adoption dies. The position I would take: a short end-of-day pass with a Friday reconciliation, cadence tested rather than mandated."
            </p>
          </div>

          <Caveat>
            <strong>What this cannot do.</strong> The MCP is a read and write surface for Harvest. It is not evidence about what someone actually did. Nothing here makes an inaccurate account of a day accurate. It makes an accurate account cheaper to produce.
          </Caveat>

          <div className="h-px bg-border my-10" />

          {/* 03 */}
          <SectionLabel num="03" title="Rollout & adoption" />
          <Prompt>How would you roll this out? How would you get buy-in, handle resistance, and make it stick?</Prompt>

          <p className="text-[15px] leading-[1.7] text-foreground mb-5">
            The structural advantage: this fix removes work rather than adding it. Most time-tracking initiatives arrive as more discipline. This one arrives as stop filling in the grid, just say what you did. That is the pitch, and it lands better from a lead who volunteered than from the person who owns the project.
          </p>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3">Two tracks, run concurrently</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Track A</span>
              <h4 className="font-serif-pro text-[20px] italic font-semibold text-primary leading-tight mt-1 mb-2">Open registration across the org</h4>
              <p className="text-[13.5px] text-muted-foreground leading-[1.65]">
                Not mandatory, so who opts in is itself information. Volunteers say what is broken because they have no reason to protect the initiative. They also become the people who answer the sceptics later, and adoption spreads horizontally far better than it spreads down from whoever owns utilisation.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent">Track B</span>
              <h4 className="font-serif-pro text-[20px] italic font-semibold text-primary leading-tight mt-1 mb-2">One nominated team</h4>
              <p className="text-[13.5px] text-muted-foreground leading-[1.65]">
                Agreed through the lead rather than around them, and selected on team-level baseline, which is a team-level fact a lead can hear without anyone feeling named. If the lead wants to narrow it, let them choose on workload variety instead, someone on retainer work, someone jumping between projects.
              </p>
            </div>
          </div>

          <p className="text-[15px] leading-[1.7] text-foreground mt-5">
            Why both: volunteers answer whether the workflow works at all, quickly and honestly. The nominated team answers whether it changes behaviour in people who did not choose it, which is the question the utilisation owner actually cares about. Running them at once avoids waiting a month to discover the easy cohort was easy.
          </p>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3 mt-8">Handling resistance</h4>
          <div className="flex flex-col gap-3">
            <Card title="What the nominated lead gets in return">
              An explicit escape hatch, anyone who wants to go back to the grid can, no questions. And presence in their team channel for the first fortnight, fixing things fast. That converts it from volunteering your team for my project into you have support and an exit.
            </Card>
            <Card title="Why the escape hatch strengthens measurement">
              If almost nobody takes it, that is far more credible adoption evidence than a mandate, where compliance cannot be told apart from preference. The ask stays light: the old way remains available, try it once this week, and if it goes well, choose it again.
            </Card>
          </div>

          <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-3 mt-8">Making it stick</h4>
          <p className="text-[15px] leading-[1.7] text-foreground">
            A Slack channel for AI feature requests and one for beta testing, open to anyone interested. Deliberately not one representative per team, because that quietly creates an unpaid AI liaison role nobody asked for, and a favour like that fades when real work gets busy however good the tool is. Self-interest in a useful tool is durable. Relaying updates to eight colleagues who did not ask is not.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
            Framed as testing and influence rather than early access, with a clear date when it is open to everyone regardless of enthusiasm, so the workflow does not become a status marker that entrenches the sceptics. This is also the answer to the brief's note that Harvest is one example. What is left behind is a standing intake for AI work across the agency, not a single fix.
          </p>

          <div className="h-px bg-border my-10" />

          {/* 04 */}
          <SectionLabel num="04" title="Measuring success" />
          <Prompt>What would "improved" look like in practice, and how would you know it's working? What would you measure, over what timeframe?</Prompt>

          <p className="text-[15px] leading-[1.7] text-foreground mb-5">
            Measurement comes from the MCP directly rather than from volunteers self-reporting improvement. Pull entries for the cohort and compare against their own pre-pilot baseline. The baseline must be built before anything changes, and built the same way each month so it stays comparable.
          </p>

          <div className="bg-card rounded-2xl px-5 py-[22px] shadow-[var(--shadow-soft)] mb-5">
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.09em] text-accent mb-3">The three measures</div>
            <Ticks items={METRICS} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-2xl p-6">
              <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-2">Widen when</h4>
              <p className="text-[13.5px] text-muted-foreground leading-[1.65]">
                Median submission lag drops under a day, retrospective edits fall meaningfully against the cohort's own baseline, and most of the cohort is still choosing it in week four without being reminded. The last is the honest signal, because the first two can be produced by novelty.
              </p>
            </div>
            <div className="bg-muted rounded-2xl p-6">
              <h4 className="font-serif-pro text-[19px] italic font-semibold text-primary mb-2">Stop and rethink when</h4>
              <p className="text-[13.5px] text-muted-foreground leading-[1.65]">
                Usage decays after the first fortnight, or category suggestions are corrected often enough that people stop trusting them. A suggestion that has to be checked every time is worse than no suggestion.
              </p>
            </div>
          </div>

          <p className="text-[15px] leading-[1.7] text-foreground mt-5">
            <strong>Timeframe: four weeks.</strong> Long enough for novelty to wear off, short enough that it does not look like empire building.
          </p>
          <p className="text-[15px] leading-[1.7] text-foreground mt-2.5">
            <strong>Comparison team.</strong> Track a similar team running nothing over the same weeks. Selecting the pilot on the worst baseline means some improvement arrives on its own through regression to the mean. If the pilot improves and the comparison does not, there is something real. If both improve, the intervention was attention rather than tooling, which is useful to know and considerably cheaper than any tool.
          </p>

          <Caveat>
            <strong>What I would not promise.</strong> A voluntary once-a-week trial will not move utilisation numbers in four weeks. This phase answers whether people want it. Accuracy gains arrive when it becomes the default way of working. And the caveat running through all of it: people behaving better because they are being watched is not a solve.
          </Caveat>

          <div className="h-px bg-border my-10" />

          {/* 05 */}
          <SectionLabel num="05" title="Risks & limitations" />
          <Prompt>What could go wrong, and how would you mitigate it?</Prompt>

          <div className="flex flex-col gap-3">
            {RISKS.map((r, i) => (
              <div key={r.title} className="bg-card rounded-2xl px-5 py-[18px] shadow-[var(--shadow-soft)] border border-border">
                <div className="flex items-baseline gap-3 mb-1.5">
                  <span className="font-sans text-[11px] font-bold text-[#FF6200] bg-[#FF6200]/10 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-serif-pro text-[17px] italic font-semibold text-primary leading-tight">{r.title}</h4>
                </div>
                <p className="text-[13.5px] text-muted-foreground leading-[1.65] m-0 pl-9">{r.body}</p>
              </div>
            ))}
          </div>

          <div className="h-px bg-border my-10" />

          {/* Format & time */}
          <SectionLabel num="06" title="Format and time" />
          <p className="text-[15px] leading-[1.7] text-foreground">
            Working notes, talked through, happy to share the doc afterwards. Roughly three hours of prep, plus verifying the Harvest MCP documentation rather than assuming its capabilities.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-14 py-7 flex items-center justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:px-7">
          <p className="text-[13.5px] text-muted-foreground leading-[1.55] max-w-[420px]">
            Brendan Rodgers · <a href="https://threadandstack.com/" className="text-accent hover:underline">threadandstack.com</a>
          </p>
          <img src={GreyStacked} alt="Thread & Stack" className="h-8 opacity-50 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default VervauntWalkthroughPage;
