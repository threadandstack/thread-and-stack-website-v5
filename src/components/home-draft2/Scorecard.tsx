import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, CheckCircle2, ChevronLeft, Gauge } from "lucide-react";

type Option = { label: string; score: number };
type Question = { q: string; options: Option[] };

const questions: Question[] = [
  {
    q: "How many tools does your team rely on to get core work done?",
    options: [
      { label: "1–3 — deliberately chosen", score: 3 },
      { label: "4–6 — accumulated, mostly working", score: 2 },
      { label: "7–10 — sprawl is real", score: 1 },
      { label: "10+ — nobody could list them all", score: 0 },
    ],
  },
  {
    q: "Where does your team go when they need an answer?",
    options: [
      { label: "One place — Notion or a wiki we actually trust", score: 3 },
      { label: "Two or three places, depending on the topic", score: 2 },
      { label: "They ask in Slack / WhatsApp first", score: 1 },
      { label: "They ask the founder or a senior person", score: 0 },
    ],
  },
  {
    q: "How often does the same question get answered more than once?",
    options: [
      { label: "Almost never", score: 3 },
      { label: "A few times a month", score: 2 },
      { label: "Weekly", score: 1 },
      { label: "Daily — it's a feature of the role", score: 0 },
    ],
  },
  {
    q: "When someone leaves the team, what happens to what they knew?",
    options: [
      { label: "It's already in the system", score: 3 },
      { label: "Most of it — a handover fills the gaps", score: 2 },
      { label: "Some of it survives, the rest is lost", score: 1 },
      { label: "It walks out the door with them", score: 0 },
    ],
  },
  {
    q: "How much of your AI use is grounded in your own knowledge?",
    options: [
      { label: "Most of it — AI reads our actual workspace", score: 3 },
      { label: "Some custom prompts, some pasting context in", score: 2 },
      { label: "Mostly generic ChatGPT / Claude tabs", score: 1 },
      { label: "We don't really use AI yet", score: 0 },
    ],
  },
  {
    q: "How are repetitive tasks handled today?",
    options: [
      { label: "Agents / automations do the routine work", score: 3 },
      { label: "A handful of Zaps or Makes", score: 2 },
      { label: "Templates and copy-paste discipline", score: 1 },
      { label: "Humans do everything manually", score: 0 },
    ],
  },
  {
    q: "Does the leader still feel like the bottleneck?",
    options: [
      { label: "Rarely — the system holds without me", score: 3 },
      { label: "Sometimes, on the edges", score: 2 },
      { label: "Often — I'm routing most things", score: 1 },
      { label: "Always — nothing moves without me", score: 0 },
    ],
  },
  {
    q: "When you add a new person, how long until they're useful?",
    options: [
      { label: "Days — the system onboards them", score: 3 },
      { label: "A week or two", score: 2 },
      { label: "A month of shadowing", score: 1 },
      { label: "Months, and we lose people in the gap", score: 0 },
    ],
  },
];

const levels = [
  {
    min: 0, max: 8, name: "Fragmented", color: "step-1",
    summary: "Knowledge lives in heads and threads. The leader is the routing layer. Cost compounds quietly.",
    recommend: "Stack Diagnostic",
    why: "Start with the 90-min audit — you need a map before you build.",
  },
  {
    min: 9, max: 14, name: "Patchworked", color: "step-2",
    summary: "You've stitched tools together. They mostly hold. AI is occasional. Retrieval is unreliable.",
    recommend: "Knowledge Lake Starter",
    why: "One core system + one well-built agent makes the difference visible fast.",
  },
  {
    min: 15, max: 19, name: "Consolidating", color: "step-3",
    summary: "You're on the path. A clear source of truth is forming. Now the layered architecture earns its place.",
    recommend: "Knowledge Infrastructure Build",
    why: "Wire the full five-layer lake, support included, so the team feels the shift end-to-end.",
  },
  {
    min: 20, max: 24, name: "Compounding", color: "step-4",
    summary: "Your knowledge is an asset. The system holds without you. The next move is depth, not foundation.",
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

  const reset = () => { setAnswers({}); setCurrent(0); setDone(false); };
  const start = () => { reset(); setStarted(true); };

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
    <section id="scorecard" className="border-b border-hairline bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="rounded-2xl border border-hairline bg-paper p-7 md:p-10">
          {!started ? (
            <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11.5px] uppercase tracking-wider text-muted-foreground">
                  <Gauge className="h-3 w-3 text-indigo" strokeWidth={2} />
                  Scorecard · 2 minutes
                </div>
                <h2 className="mt-5 max-w-xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] md:text-[42px]">
                  How mature is your{" "}
                  <span className="font-serif-pro italic text-clay">knowledge stack?</span>
                </h2>
                <p className="mt-4 max-w-md text-[14.5px] text-ink-soft">
                  Eight honest questions. You'll see where you sit on the ladder —
                  and the engagement that fits.
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[14px] font-medium text-accent-foreground transition-transform hover:-translate-y-px"
                  style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                >
                  Take the scorecard <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-hairline bg-background p-5">
                <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  The ladder
                </div>
                <ol className="mt-4 space-y-2.5">
                  {ladder.map((l, i) => (
                    <li key={l.name} className="flex items-center gap-3 text-[13.5px]">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full border text-[10.5px] font-medium"
                        style={{ borderColor: `var(--${l.color})`, color: `var(--${l.color})` }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium text-foreground">{l.name}</span>
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
                <span>Question {current + 1} of {questions.length}</span>
                <span>{Object.keys(answers).length} answered</span>
              </div>
              <div className="mt-3 flex gap-1.5">
                {questions.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < current ? "bg-indigo" : i === current ? "bg-indigo/60" : "bg-hairline"
                    }`}
                  />
                ))}
              </div>

              <div className="py-8 md:py-10">
                <p className="max-w-2xl text-[20px] font-medium leading-snug tracking-tight text-foreground md:text-[26px]">
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
                          {isSel && <span className="h-1.5 w-1.5 rounded-full bg-indigo" />}
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
                  onClick={() => { setStarted(false); reset(); }}
                  className="text-[11.5px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-background px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Your result
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-serif-pro text-[72px] leading-none tracking-tight text-foreground">
                    {total}
                  </span>
                  <span className="text-[14px] text-muted-foreground">/ 24</span>
                </div>
                <h3 className="mt-4 text-[32px] font-medium leading-tight tracking-tight md:text-[40px]">
                  Your stack is{" "}
                  <span className="font-serif-pro italic" style={{ color: `var(--${level.color})` }}>
                    {level.name}.
                  </span>
                </h3>
                <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                  {level.summary}
                </p>
                <div className="mt-5 flex items-center gap-2 text-[12px] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo" />
                  Your answers stay on this device.
                </div>
              </div>

              <div className="rounded-xl border border-hairline bg-background p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Recommended next step
                </div>
                <div
                  className="mt-2 text-[17px] font-medium tracking-tight"
                  style={{ color: `var(--${level.color})` }}
                >
                  {level.recommend}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{level.why}</p>
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href="#contact"
                    className="inline-flex h-10 items-center gap-1.5 rounded-md px-4 text-[13px] font-medium text-accent-foreground"
                    style={{ backgroundImage: "linear-gradient(95deg, var(--gradient-3color))" }}
                  >
                    Book the Diagnostic <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-soft hover:text-foreground"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Retake
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
