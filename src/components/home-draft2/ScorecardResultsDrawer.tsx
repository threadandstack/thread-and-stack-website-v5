import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Gauge,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { IntroCallForm } from "./IntroCallForm";

export type ScorecardReport = {
  total: number;
  levelName: string;
  levelColor: string;
  levelSummary: string;
  levelNarrative: string;
  recommend: string;
  recommendWhy: string;
  moves: string[];
  answers: {
    dimension: string;
    question: string;
    answerLabel: string;
    score: number;
    insight: string;
  }[];
  strengths: { dimension: string; score: number; insight: string }[];
  drags: { dimension: string; score: number; insight: string }[];
};

interface ScorecardResultsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: "dark" | "light";
  report: ScorecardReport | null;
}

function buildReportText(r: ScorecardReport): string {
  const lines: string[] = [];
  lines.push(`SCORECARD REPORT`);
  lines.push(`Score: ${r.total}/24 — ${r.levelName}`);
  lines.push(`Summary: ${r.levelSummary}`);
  lines.push("");
  lines.push(`Recommended next step: ${r.recommend}`);
  lines.push(`Why: ${r.recommendWhy}`);
  lines.push("");
  lines.push(`Narrative:`);
  lines.push(r.levelNarrative);
  lines.push("");
  lines.push(`Answers:`);
  r.answers.forEach((a, i) => {
    lines.push(`${i + 1}. ${a.dimension} — ${a.score}/3`);
    lines.push(`   Q: ${a.question}`);
    lines.push(`   A: ${a.answerLabel}`);
    lines.push(`   Insight: ${a.insight}`);
  });
  lines.push("");
  lines.push(`Three moves for the next 30 days:`);
  r.moves.forEach((m, i) => lines.push(`${i + 1}. ${m}`));
  return lines.join("\n");
}

export function ScorecardResultsDrawer({
  open,
  onOpenChange,
  theme,
  report,
}: ScorecardResultsDrawerProps) {
  if (!report) return null;
  const reportText = buildReportText(report);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        data-theme={theme}
        className="notion-canvas w-full sm:max-w-xl overflow-y-auto p-0 bg-background border-l border-hairline text-foreground"
      >
        {/* Themed scorecard header */}
        <div className="relative overflow-hidden border-b border-hairline bg-paper px-6 pb-6 pt-8 sm:px-8">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full opacity-30 blur-3xl"
            style={{
              background: `radial-gradient(closest-side, var(--${report.levelColor}), transparent)`,
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -right-20 top-10 h-48 w-48 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(closest-side, hsl(var(--orange)), transparent)" }}
          />
          <SheetHeader className="relative space-y-3 text-left">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-hairline bg-background/70 px-2.5 py-1 text-[10.5px] font-medium uppercase tracking-wider text-ink-soft backdrop-blur">
              <Gauge className="h-3 w-3 text-indigo" strokeWidth={2} />
              Scorecard result · {report.total}/24 · {report.levelName}
            </div>
            <SheetTitle className="font-sans not-italic text-3xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[34px]">
              Let's explore your{" "}
              <span
                className="font-serif-pro italic font-normal"
                style={{ color: `var(--${report.levelColor})` }}
              >
                {report.levelName.toLowerCase()} stack
              </span>{" "}
              together.
            </SheetTitle>
            <SheetDescription className="text-[14.5px] leading-relaxed text-ink-soft">
              Your full report — every answer, insight, and the three moves —
              comes with this request, so we can pick up exactly where you left
              off.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="space-y-6 px-6 py-7 sm:px-8">
          {/* Report snapshot */}
          <section className="rounded-xl border border-hairline bg-card p-5 text-card-foreground">
            <div className="flex items-baseline justify-between">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Your result
              </div>
              <div className="text-[11px] text-muted-foreground">
                Shared with Brendan
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-serif-pro text-[44px] leading-none tracking-tight">
                {report.total}
              </span>
              <span className="text-[13px] text-muted-foreground">/ 24</span>
              <span
                className="ml-2 rounded-full border px-2 py-0.5 text-[11px] font-medium"
                style={{
                  borderColor: `var(--${report.levelColor})`,
                  color: `var(--${report.levelColor})`,
                }}
              >
                {report.levelName}
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              {report.levelSummary}
            </p>
          </section>

          {/* Strengths + drags */}
          <div className="grid gap-3 sm:grid-cols-2">
            <section className="rounded-xl border border-hairline bg-background p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-indigo" />
                What's working
              </div>
              <ul className="mt-3 space-y-2.5">
                {report.strengths.map((s) => (
                  <li key={s.dimension} className="text-[12.5px]">
                    <span className="font-medium text-foreground">
                      {s.dimension}
                    </span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground">
                      {s.score}/3
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-hairline bg-background p-4">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <AlertTriangle
                  className="h-3.5 w-3.5"
                  style={{ color: `var(--${report.levelColor})` }}
                />
                Where the drag is
              </div>
              <ul className="mt-3 space-y-2.5">
                {report.drags.map((d) => (
                  <li key={d.dimension} className="text-[12.5px]">
                    <span className="font-medium text-foreground">
                      {d.dimension}
                    </span>
                    <span className="ml-1.5 text-[11px] text-muted-foreground">
                      {d.score}/3
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Recommendation */}
          <section className="rounded-xl border border-hairline bg-paper p-5">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-indigo" />
              Suggested next step
            </div>
            <div
              className="mt-1.5 text-[16px] font-medium tracking-tight"
              style={{ color: `var(--${report.levelColor})` }}
            >
              {report.recommend}
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
              {report.recommendWhy}
            </p>
          </section>

          {/* Full answers accordion */}
          <details className="group rounded-xl border border-hairline bg-background p-4 open:pb-5">
            <summary className="flex cursor-pointer items-center justify-between text-[12.5px] font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo" />
                See all 8 answers being shared
              </span>
              <span className="text-[11px] text-muted-foreground group-open:hidden">
                Show
              </span>
              <span className="hidden text-[11px] text-muted-foreground group-open:inline">
                Hide
              </span>
            </summary>
            <ol className="mt-4 space-y-3">
              {report.answers.map((a, i) => (
                <li key={i} className="text-[12.5px] leading-relaxed">
                  <div className="font-medium text-foreground">
                    {i + 1}. {a.dimension}
                    <span className="ml-1.5 text-[11px] text-muted-foreground">
                      {a.score}/3
                    </span>
                  </div>
                  <div className="text-ink-soft">{a.question}</div>
                  <div className="text-foreground">→ {a.answerLabel}</div>
                </li>
              ))}
            </ol>
          </details>

          {/* Lead form — attaches the full report */}
          <div className="rounded-xl border border-hairline bg-background p-5">
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Explore this together
              </div>
              <p className="mt-1 text-[13.5px] text-ink-soft">
                Add your details and I'll come back with a read on your report
                and the best next step — usually within one working day.
              </p>
            </div>
            <IntroCallForm
              source="scorecard-results"
              submitLabel="Send my report & request a call"
              extraMessage={reportText}
              extraContext={{
                type: "scorecard-explore",
                scorecardScore: report.total,
                scorecardLevel: report.levelName,
                scorecardRecommend: report.recommend,
                scorecardAnswers: report.answers.map((a) => ({
                  dimension: a.dimension,
                  score: a.score,
                  answer: a.answerLabel,
                })),
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
