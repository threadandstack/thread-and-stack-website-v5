import { useMemo, useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  Gauge,
  Printer,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  ScorecardResultsDrawer,
  type ScorecardReport,
} from "./ScorecardResultsDrawer";


type Option = { label: string; score: number };
type Question = {
  dimension: string;
  q: string;
  options: Option[];
  /** One-line insight per score (index = score 0..3) */
  insights: [string, string, string, string];
};

const questions: Question[] = [
  {
    dimension: "Tool sprawl",
    q: "How many tools does your team rely on to get core work done?",
    options: [
      { label: "1–3 — deliberately chosen", score: 3 },
      { label: "4–6 — accumulated, mostly working", score: 2 },
      { label: "7–10 — sprawl is real", score: 1 },
      { label: "10+ — nobody could list them all", score: 0 },
    ],
    insights: [
      "Every new hire has to learn a tool museum. Consolidation will pay back within a quarter.",
      "You're carrying meaningful licence and cognitive cost. Two or three retirements would free real capacity.",
      "A functional stack — the next lift is turning tools into a system, not just tolerating them side by side.",
      "Rare and valuable. Protect this discipline as you grow — sprawl creeps back the moment attention shifts.",
    ],
  },
  {
    dimension: "Single source of truth",
    q: "Where does your team go when they need an answer?",
    options: [
      { label: "One place — Notion or a wiki we actually trust", score: 3 },
      { label: "Two or three places, depending on the topic", score: 2 },
      { label: "They ask in Slack / WhatsApp first", score: 1 },
      { label: "They ask the founder or a senior person", score: 0 },
    ],
    insights: [
      "Institutional knowledge lives in one head. That's the highest-leverage thing to fix, above almost anything else.",
      "Chat is the default retrieval layer — which means answers scroll away and get re-asked. A trusted wiki flips this.",
      "You're close. Naming the canonical home for each domain (people, product, clients) collapses the 'where does this live?' tax.",
      "This is the foundation everything else compounds on. Keep the discipline of writing decisions down, not just discussing them.",
    ],
  },
  {
    dimension: "Duplicate answers",
    q: "How often does the same question get answered more than once?",
    options: [
      { label: "Almost never", score: 3 },
      { label: "A few times a month", score: 2 },
      { label: "Weekly", score: 1 },
      { label: "Daily. It's a feature of the role", score: 0 },
    ],
    insights: [
      "Repeat questions are the clearest signal of missing documentation. Track them for a week — you'll find your next 10 wiki pages.",
      "The pattern is there. A lightweight 'if you asked, add it to the wiki' rule stops the leak.",
      "You're mostly retrieving, not re-explaining. Turn the residual questions into an FAQ that AI can search.",
      "Excellent hygiene. The next move is making that written knowledge queryable by an agent.",
    ],
  },
  {
    dimension: "Knowledge continuity",
    q: "When someone leaves the team, what happens to what they knew?",
    options: [
      { label: "It's already in the system", score: 3 },
      { label: "Most of it — a handover fills the gaps", score: 2 },
      { label: "Some of it survives, the rest is lost", score: 1 },
      { label: "It walks out the door with them", score: 0 },
    ],
    insights: [
      "Every departure is a knowledge event. Build a lightweight 'brain dump' template into your offboarding this quarter.",
      "Handovers rescue some of it, but you're still absorbing the loss. A living role-doc per person changes the maths.",
      "Solid. Turn the handover template into an always-on artefact each person maintains, not a leaving ritual.",
      "You've built a compounding asset. Very few teams get here without deliberate design.",
    ],
  },
  {
    dimension: "AI grounding",
    q: "How much of your AI use is grounded in your own knowledge?",
    options: [
      { label: "Most of it — AI reads our actual workspace", score: 3 },
      { label: "Some custom prompts, some pasting context in", score: 2 },
      { label: "Mostly generic ChatGPT / Claude tabs", score: 1 },
      { label: "We don't really use AI yet", score: 0 },
    ],
    insights: [
      "You're leaving the biggest AI unlock on the table. Not adoption — grounding. That needs a knowledge base first.",
      "Generic AI is a search engine with better manners. The compounding value comes from AI that reads your actual context.",
      "You're doing the manual work of context every time. The next step is a retrieval layer that does it for you.",
      "This is where the real leverage lives. Now the question is which workflows get the first custom agents.",
    ],
  },
  {
    dimension: "Automation",
    q: "How are repetitive tasks handled today?",
    options: [
      { label: "Agents / automations do the routine work", score: 3 },
      { label: "A handful of Zaps or Makes", score: 2 },
      { label: "Templates and copy-paste discipline", score: 1 },
      { label: "Humans do everything manually", score: 0 },
    ],
    insights: [
      "Every hour of routine work is a candidate for automation. Start with the three tasks you'd notice most if they disappeared.",
      "Templates are the on-ramp. The next step is turning your best templates into automations, not just documents.",
      "You've got the plumbing. Audit which flows still leak — those are the next candidates for an agent, not another Zap.",
      "Mature. The remaining question is whether the automations are documented enough to survive the person who built them.",
    ],
  },
  {
    dimension: "Founder bottleneck",
    q: "Does the leader still feel like the bottleneck?",
    options: [
      { label: "Rarely — the system holds without me", score: 3 },
      { label: "Sometimes, on the edges", score: 2 },
      { label: "Often — I'm routing most things", score: 1 },
      { label: "Always — nothing moves without me", score: 0 },
    ],
    insights: [
      "The cost isn't your time — it's the decisions the team defers because you're the routing layer. That's the real ceiling.",
      "You're the shortcut, which feels efficient and quietly caps growth. Documented decision rights change the pattern fast.",
      "Close. Notice which edges still route through you — those are the last few playbooks worth writing.",
      "This is what a healthy operating system looks like. Protect the whitespace you've earned.",
    ],
  },
  {
    dimension: "Onboarding speed",
    q: "When you add a new person, how long until they're useful?",
    options: [
      { label: "Days — the system onboards them", score: 3 },
      { label: "A week or two", score: 2 },
      { label: "A month of shadowing", score: 1 },
      { label: "Months, and we lose people in the gap", score: 0 },
    ],
    insights: [
      "Long ramps hide a knowledge debt problem. Your best hires leave in the gap — the system is the retention lever.",
      "Shadowing means the knowledge exists but isn't written. Convert the shadowing into a wiki as it happens.",
      "Respectable. A short structured onboarding path plus a workspace tour would shave days off this.",
      "Fast ramp = compounding hiring advantage. This is one of the clearest signs the system is doing its job.",
    ],
  },
];

type Level = {
  min: number;
  max: number;
  name: string;
  color: string;
  summary: string;
  narrative: string;
  moves: string[];
  recommend: string;
  why: string;
};

const levels: Level[] = [
  {
    min: 0,
    max: 8,
    name: "Fragmented",
    color: "step-1",
    summary:
      "Knowledge lives in heads and threads. The leader is the routing layer. Cost compounds quietly.",
    narrative:
      "You're paying a creative tax every day — re-explaining, re-finding, re-deciding. It's not a discipline problem, it's a system problem. The good news: teams at this stage see the fastest visible lift, because almost any structural move beats zero structure.",
    moves: [
      "Pick one canonical home for written knowledge this month. Just one. Notion, a wiki, a shared drive — the choice matters less than the commitment.",
      "For one week, log every repeat question in a single doc. That log becomes the outline of your first knowledge base.",
      "Name one small automation to remove — the task you'd most enjoy never doing again — and give it to a Zap, a template, or a person.",
    ],
    recommend: "Stack Diagnostic",
    why: "Start with the 90-min audit. You need a map before you build.",
  },
  {
    min: 9,
    max: 14,
    name: "Patchworked",
    color: "step-2",
    summary:
      "You've stitched tools together. They mostly hold. AI is occasional. Retrieval is unreliable.",
    narrative:
      "You've built enough to keep moving, and the seams are starting to show. This is the stage where the returns on structure go from linear to compounding — but only if you resist the temptation to keep patching. Consolidation, not addition, is the move.",
    moves: [
      "Choose one domain (people ops, client delivery, or product) and make its wiki the trusted source this quarter.",
      "Retire or absorb at least two tools. Track what breaks — usually less than you'd expect.",
      "Ground one AI workflow in your actual workspace. Even one retrieval-based agent will reset the team's expectations of what AI can do here.",
    ],
    recommend: "Knowledge Base Starter",
    why: "One core system plus one well-built agent makes the difference visible fast.",
  },
  {
    min: 15,
    max: 19,
    name: "Consolidating",
    color: "step-3",
    summary:
      "You're on the path. A clear source of truth is forming. Now the layered architecture earns its place.",
    narrative:
      "You've done the hard part — the team believes in the system. Now the work is depth: turning documentation into infrastructure, and infrastructure into leverage. The wins from here are less visible per week and much larger per year.",
    moves: [
      "Map the five layers of your knowledge stack (capture, structure, retrieval, automation, agents) and identify the weakest one.",
      "Pick two workflows a week where a custom agent would replace repeat context-pasting. Prototype in your workspace, not in a generic tab.",
      "Write down the decision rights that still route through the founder. Publishing that list is often the fastest bottleneck breaker.",
    ],
    recommend: "Knowledge Infrastructure Build",
    why: "Wire the full five-layer base, support included, so the team feels the shift end-to-end.",
  },
  {
    min: 20,
    max: 24,
    name: "Compounding",
    color: "step-4",
    summary:
      "Your knowledge is an asset. The system holds without you. The next move is depth, not foundation.",
    narrative:
      "You've built the rarest thing: an operating system that gets sharper as you use it. The risk at this stage isn't decay, it's plateau — the temptation to stop investing because things are working. Depth and specificity beat any further foundation work from here.",
    moves: [
      "Commission bespoke agents on top of the base — the ones that would feel impossible without your infrastructure.",
      "Institute a quarterly system review, so the workspace evolves faster than the team's habits calcify around it.",
      "Turn one internal system into an external asset — a productised offer, an open playbook, a template — and let it earn.",
    ],
    recommend: "Bespoke Systems · Rolling Support",
    why: "Custom agents on top of mature infrastructure, or rolling support to keep compounding.",
  },
];

const ladder = [
  { name: "Fragmented", color: "step-1" },
  { name: "Patchworked", color: "step-2" },
  { name: "Consolidating", color: "step-3" },
  { name: "Compounding", color: "step-4" },
];

export function Scorecard() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const total = useMemo(
    () => Object.values(answers).reduce((a, b) => a + b, 0),
    [answers],
  );
  const level = useMemo(
    () => levels.find((l) => total >= l.min && total <= l.max) ?? levels[0],
    [total],
  );

  // Sort dimensions by score to surface strengths and drag points.
  const scored = useMemo(
    () =>
      questions.map((q, i) => ({
        dimension: q.dimension,
        score: answers[i] ?? 0,
        insight: q.insights[answers[i] ?? 0],
      })),
    [answers],
  );
  const strengths = useMemo(
    () => [...scored].sort((a, b) => b.score - a.score).slice(0, 2),
    [scored],
  );
  const drags = useMemo(
    () => [...scored].sort((a, b) => a.score - b.score).slice(0, 2),
    [scored],
  );

  const reset = () => {
    setAnswers({});
    setCurrent(0);
    setDone(false);
  };
  const start = () => {
    reset();
    setStarted(true);
  };

  const pick = (score: number) => {
    setAnswers((a) => ({ ...a, [current]: score }));
    window.setTimeout(() => {
      if (current + 1 >= questions.length) setDone(true);
      else setCurrent((c) => c + 1);
    }, 180);
  };

  const q = questions[current];
  const selected = answers[current];

  return (
    <section id="scorecard" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
        <div className="rounded-3xl border border-hairline bg-paper p-7 shadow-[0_30px_80px_-40px_hsl(var(--foreground)/0.18)] md:p-10 print:border-0 print:shadow-none">
          {!started ? (
            <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <Gauge className="h-3 w-3 text-indigo" strokeWidth={2} />
                  Scorecard · 2 minutes
                </div>
                <h2 className="mt-5 max-w-xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] md:text-[42px]">
                  How mature is your{" "}
                  <span className="font-serif-pro italic text-gradient-warm">
                    knowledge stack?
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-[14.5px] text-ink-soft">
                  Eight honest questions. You'll leave with a score, a read on
                  what's working, where the drag is, and three moves for the
                  next 30 days.
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="group mt-6 inline-flex h-12 items-center justify-center rounded-md px-6 text-[14px] font-medium text-accent-foreground transition-transform hover:-translate-y-px"
                  style={{
                    backgroundImage:
                      "linear-gradient(95deg, var(--gradient-3color))",
                  }}
                >
                  Take the scorecard
                  <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-5 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </span>
                </button>
              </div>

              <div className="rounded-xl border border-hairline bg-background p-5">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  The ladder
                </div>
                <ol className="mt-4 space-y-2.5">
                  {ladder.map((l, i) => (
                    <li
                      key={l.name}
                      className="flex items-center gap-3 text-[13.5px]"
                    >
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full border text-[10.5px] font-medium"
                        style={{
                          borderColor: `var(--${l.color})`,
                          color: `var(--${l.color})`,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">
                        {l.name}
                      </span>
                      <span
                        className="ml-auto h-1.5 flex-1 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, var(--${l.color}) ${((i + 1) / 4) * 100}%, hsl(var(--hairline)) ${((i + 1) / 4) * 100}%)`,
                        }}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : !done ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between text-[11.5px] uppercase tracking-wider text-muted-foreground">
                <span>
                  Question {current + 1} of {questions.length}
                </span>
                <span>{Object.keys(answers).length} answered</span>
              </div>
              <div className="mt-3 flex gap-1.5">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < current
                        ? "bg-indigo"
                        : i === current
                          ? "bg-indigo/60"
                          : "bg-hairline"
                    }`}
                  />
                ))}
              </div>

              <div className="py-8 md:py-10">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {q.dimension}
                </div>
                <p className="mt-2 max-w-2xl text-[20px] font-medium leading-snug tracking-tight text-foreground md:text-[26px]">
                  {q.q}
                </p>
                <div className="mt-6 grid gap-2 md:max-w-2xl">
                  {q.options.map((opt) => {
                    const isSel = selected === opt.score;
                    return (
                      <button
                        type="button"
                        key={opt.label}
                        onClick={() => pick(opt.score)}
                        className={`group flex items-start gap-3 rounded-md border px-4 py-3 text-left text-[14.5px] transition-colors ${
                          isSel
                            ? "border-indigo bg-indigo/5 text-foreground"
                            : "border-hairline bg-background text-ink-soft hover:border-foreground/50 hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            isSel ? "border-indigo" : "border-foreground/25"
                          }`}
                        >
                          {isSel && (
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo" />
                          )}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-hairline pt-4">
                <button
                  type="button"
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="inline-flex items-center gap-1 text-[12.5px] text-ink-soft hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStarted(false);
                    reset();
                  }}
                  className="text-[11.5px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 space-y-10">
              {/* Header: score + level + narrative */}
              <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Your result
                  </div>
                  <div className="mt-5 flex items-baseline gap-3">
                    <span className="font-serif-pro text-[72px] leading-none tracking-tight text-foreground">
                      {total}
                    </span>
                    <span className="text-[14px] text-muted-foreground">
                      / 24
                    </span>
                  </div>
                  <h3 className="mt-4 text-[32px] font-medium leading-tight tracking-tight md:text-[40px]">
                    Your stack is{" "}
                    <span
                      className="font-serif-pro italic"
                      style={{ color: `var(--${level.color})` }}
                    >
                      {level.name}.
                    </span>
                  </h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                    {level.summary}
                  </p>
                </div>

                {/* Ladder position */}
                <div className="rounded-xl border border-hairline bg-background p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Where you sit
                  </div>
                  <ol className="mt-3 space-y-2">
                    {ladder.map((l) => {
                      const active = l.name === level.name;
                      return (
                        <li
                          key={l.name}
                          className={`flex items-center gap-3 rounded-md px-2 py-1.5 text-[13px] ${
                            active
                              ? "bg-foreground/[0.04] font-medium text-foreground"
                              : "text-ink-soft"
                          }`}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              background: active
                                ? `var(--${l.color})`
                                : "hsl(var(--hairline))",
                            }}
                          />
                          {l.name}
                          {active && (
                            <span className="ml-auto text-[11px] uppercase tracking-wider text-muted-foreground">
                              You
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* Narrative read */}
              <div className="rounded-xl border border-hairline bg-background p-6">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  What this means
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground">
                  {level.narrative}
                </p>
              </div>

              {/* Strengths + drags */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-hairline bg-background p-6">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-indigo" />
                    What's working
                  </div>
                  <ul className="mt-4 space-y-4">
                    {strengths.map((s) => (
                      <li key={s.dimension}>
                        <div className="text-[13.5px] font-medium text-foreground">
                          {s.dimension}
                          <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                            {s.score}/3
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                          {s.insight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-hairline bg-background p-6">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <AlertTriangle
                      className="h-3.5 w-3.5"
                      style={{ color: `var(--${level.color})` }}
                    />
                    Where the drag is
                  </div>
                  <ul className="mt-4 space-y-4">
                    {drags.map((d) => (
                      <li key={d.dimension}>
                        <div className="text-[13.5px] font-medium text-foreground">
                          {d.dimension}
                          <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                            {d.score}/3
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                          {d.insight}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 30-day moves */}
              <div className="rounded-xl border border-hairline bg-background p-6">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-indigo" />
                  Three moves for the next 30 days
                </div>
                <ol className="mt-4 space-y-4">
                  {level.moves.map((m, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-medium"
                        style={{
                          borderColor: `var(--${level.color})`,
                          color: `var(--${level.color})`,
                        }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-[14px] leading-relaxed text-foreground">
                        {m}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 flex items-center gap-2 text-[11.5px] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo" />
                  Your answers stay on this device. Nothing logged, nothing
                  sent.
                </p>
              </div>

              {/* Soft recommendation + retake / print */}
              <div className="rounded-xl border border-hairline bg-paper p-6">
                <div className="grid gap-5 md:grid-cols-[1.4fr_1fr] md:items-center">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      If you want a hand with any of this
                    </div>
                    <div
                      className="mt-2 text-[17px] font-medium tracking-tight"
                      style={{ color: `var(--${level.color})` }}
                    >
                      {level.recommend}
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                      {level.why}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <a
                      href="#contact"
                      className="group inline-flex h-10 items-center rounded-md px-4 text-[13px] font-medium text-accent-foreground"
                      style={{
                        backgroundImage:
                          "linear-gradient(95deg, var(--gradient-3color))",
                      }}
                    >
                      Explore this together
                      <span className="inline-flex w-0 items-center justify-center overflow-hidden opacity-0 scale-75 transition-all duration-300 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 group-hover:ml-1.5">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground print:hidden"
                    >
                      <Printer className="h-3.5 w-3.5" /> Save / print
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground print:hidden"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Retake
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
