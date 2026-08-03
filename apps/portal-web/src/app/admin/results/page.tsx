"use client";

import { useMemo, useState } from "react";
import { Button, Icons, PageContainer, Text } from "@seek/ui";
import { mockCandidateResultReport } from "@/features/results/mock-data";
import type {
  CandidateResultReport,
  ResultMetric,
  ResultQuestionReview,
} from "@/features/results/types";

const tabLabels: Record<CandidateResultReport["tabs"][number], string> = {
  analysis: "Analysis",
  solutions: "Solutions",
  "top-scorers": "Top Scorers",
};

const toneClasses: Record<ResultMetric["tone"], string> = {
  danger: "bg-danger text-danger-foreground",
  success: "bg-success text-success-foreground",
  info: "bg-cyan-600 text-white",
  warning: "bg-warning text-warning-foreground",
};

export default function ResultsPage() {
  const report = mockCandidateResultReport;
  const [activeTab, setActiveTab] =
    useState<CandidateResultReport["tabs"][number]>("analysis");
  const [activeQuestionId, setActiveQuestionId] = useState(
    report.questions[0]?.id ?? "",
  );

  const activeQuestion = useMemo(
    () =>
      report.questions.find((question) => question.id === activeQuestionId) ??
      report.questions[0],
    [activeQuestionId, report.questions],
  );

  return (
    <PageContainer className="max-w-none bg-muted-background px-0 py-0">
      <div className="min-h-screen">
        <header className="border-b border-border bg-surface px-seek-4 py-seek-3 sm:px-seek-6">
          <div className="flex flex-col gap-seek-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-seek-2">
              <Button type="button" variant="outline" size="sm">
                <Icons.ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <h1 className="font-sans text-lg font-bold text-foreground">
                {report.title}
              </h1>
            </div>
            <Button type="button" className="bg-success hover:bg-success/90">
              Download Score Report
            </Button>
          </div>
          <nav className="mt-seek-4 flex gap-seek-6 overflow-x-auto">
            {report.tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`border-b-2 px-seek-1 pb-seek-3 font-sans text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? "border-warning text-warning"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-seek-4 py-seek-6 sm:px-seek-6">
          {activeTab === "analysis" && <AnalysisTab report={report} />}
          {activeTab === "solutions" && activeQuestion && (
            <SolutionsTab
              report={report}
              activeQuestion={activeQuestion}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={setActiveQuestionId}
            />
          )}
          {activeTab === "top-scorers" && <TopScorersTab report={report} />}
        </main>
      </div>
    </PageContainer>
  );
}

function AnalysisTab({ report }: { report: CandidateResultReport }) {
  return (
    <div className="space-y-seek-6">
      <div className="grid grid-cols-1 gap-seek-4 md:grid-cols-2 xl:grid-cols-4">
        {report.metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-3">
        <DonutPanel
          title={`Total ${report.totals.questionCount} Questions`}
          center={`${report.totals.answered}/${report.totals.questionCount}`}
          centerLabel="Answered"
          footer={`${report.totals.unanswered} Unanswered`}
          legend={[
            { label: `${report.totals.correct} Correct`, color: "bg-success" },
            { label: `${report.totals.wrong} Wrong`, color: "bg-danger" },
            {
              label: `${report.totals.unanswered} Unanswered`,
              color: "bg-slate-300",
            },
          ]}
        />
        <DonutPanel
          title={`Total ${report.totals.totalMinutes} Minutes`}
          center={`${report.totals.totalMinutes} Min 0 Sec`}
          centerLabel="Spent"
          footer="None"
          legend={[
            { label: "0 Sec Correct", color: "bg-success" },
            { label: "0 Sec Wrong", color: "bg-danger" },
            { label: "0 Sec Other", color: "bg-slate-300" },
          ]}
        />
        <MarksPanel report={report} />
      </div>

      <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-2">
        <SkillGraph scores={report.skillScores} />
        <AiAnalysisCard report={report} />
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: ResultMetric }) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
      <div className="flex items-start gap-seek-3">
        <span
          className={`mt-1 h-3 w-1.5 rounded-full ${toneClasses[metric.tone]}`}
        />
        <div>
          <Text variant="muted" className="text-sm">
            {metric.label}
          </Text>
          <p
            className={`mt-seek-2 font-sans text-3xl font-bold ${
              metric.tone === "danger"
                ? "text-danger"
                : metric.tone === "success"
                  ? "text-teal-600"
                  : "text-cyan-700"
            }`}
          >
            {metric.value}
          </p>
          <Text variant="muted" className="mt-seek-1 text-sm">
            {metric.helper}
          </Text>
        </div>
      </div>
    </section>
  );
}

interface DonutPanelProps {
  title: string;
  center: string;
  centerLabel: string;
  footer: string;
  legend: Array<{ label: string; color: string }>;
}

function DonutPanel({
  title,
  center,
  centerLabel,
  footer,
  legend,
}: DonutPanelProps) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-sm">
      <h2 className="text-center font-sans text-base font-bold text-foreground">
        {title}
      </h2>
      <div className="mt-seek-5 flex justify-center">
        <div
          className="grid h-44 w-44 place-items-center rounded-full"
          style={{
            background:
              "conic-gradient(#d1d5db 0 74%, transparent 74% 79%, #d1d5db 79% 100%)",
          }}
        >
          <div className="grid h-28 w-28 place-items-center rounded-full bg-surface text-center">
            <div>
              <p className="font-sans text-2xl font-bold text-foreground">
                {center}
              </p>
              <Text variant="muted" className="text-sm">
                {centerLabel}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <Text variant="muted" className="mt-seek-2 text-center">
        {footer}
      </Text>
      <div className="mt-seek-5 space-y-seek-2">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-seek-2">
            <span className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="font-sans text-sm text-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarksPanel({ report }: { report: CandidateResultReport }) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-sm">
      <h2 className="text-center font-sans text-base font-bold text-foreground">
        Total Scored Marks
      </h2>
      <div className="mt-seek-7 space-y-seek-4">
        <ScoreRow
          label="Marks Earned"
          value={report.totals.marksEarned.toFixed(2)}
        />
        <ScoreRow
          label="Negative Marks"
          value={`-${report.totals.negativeMarks}`}
        />
        <ScoreRow
          label="Total Marks"
          value={report.totals.score.toFixed(2)}
          strong
        />
      </div>
      <div className="mt-seek-8 rounded-seek-md bg-muted-background p-seek-4">
        <Text variant="muted" className="text-sm">
          Max possible
        </Text>
        <p className="font-sans text-2xl font-bold text-foreground">
          {report.totals.totalMarks}
        </p>
        <div className="mt-seek-3 h-2 rounded-full bg-slate-200">
          <div className="h-2 w-0 rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
}

function ScoreRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-seek-3 last:border-b-0">
      <span
        className={`font-sans text-sm ${strong ? "font-bold text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span className="font-sans text-sm font-bold text-foreground">
        {value}
      </span>
    </div>
  );
}

function SkillGraph({
  scores,
}: {
  scores: CandidateResultReport["skillScores"];
}) {
  const polygonPoints = scores
    .map((score, index) => {
      const angle = -90 + index * (360 / scores.length);
      const radius = 80 * (score.value / 100);
      const x = 100 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 100 + radius * Math.sin((angle * Math.PI) / 180);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-sm">
      <h2 className="text-center font-sans text-base font-bold text-foreground">
        Мэдлэгийн Сэдэвт Үнэлгээ (Skill Graph)
      </h2>
      <div className="mt-seek-4 flex justify-center">
        <svg viewBox="0 0 200 200" className="h-64 w-64" role="img">
          <title>Skill radar graph</title>
          <polygon
            points="100,20 169,140 31,140"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <polygon
            points="100,50 143,125 57,125"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <polygon
            points={polygonPoints}
            fill="rgba(139, 92, 246, 0.28)"
            stroke="#8b5cf6"
            strokeWidth="2"
          />
          {scores.map((score, index) => {
            const angle = -90 + index * (360 / scores.length);
            const x = 100 + 96 * Math.cos((angle * Math.PI) / 180);
            const y = 100 + 96 * Math.sin((angle * Math.PI) / 180);
            return (
              <text
                key={score.label}
                x={x}
                y={y}
                textAnchor="middle"
                className="fill-foreground text-[8px]"
              >
                {score.label}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

function AiAnalysisCard({ report }: { report: CandidateResultReport }) {
  return (
    <section className="rounded-seek-lg border border-violet-100 bg-surface p-seek-6 shadow-seek-sm">
      <h2 className="font-sans text-lg font-bold text-violet-700">
        AI Алдааны Дүн Шинжилгээ
      </h2>
      <p className="mt-seek-4 font-sans text-sm leading-6 text-foreground">
        {report.aiAnalysis.summary}
      </p>
      <div className="mt-40 border-t border-border pt-seek-4">
        <Text variant="muted" className="text-xs italic">
          {report.aiAnalysis.note}
        </Text>
      </div>
    </section>
  );
}

interface SolutionsTabProps {
  report: CandidateResultReport;
  activeQuestion: ResultQuestionReview;
  activeQuestionId: string;
  onSelectQuestion: (questionId: string) => void;
}

function SolutionsTab({
  report,
  activeQuestion,
  activeQuestionId,
  onSelectQuestion,
}: SolutionsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-sm">
        <div className="grid grid-cols-4 gap-seek-2">
          {Array.from({ length: report.totals.questionCount }).map(
            (_, index) => {
              const question = report.questions[index];
              const active =
                question?.id === activeQuestionId || (!question && index === 0);
              return (
                <button
                  key={index}
                  type="button"
                  className={`h-10 rounded-seek-md border text-sm font-semibold ${
                    active
                      ? "border-primary bg-surface ring-2 ring-primary"
                      : "border-border bg-surface hover:bg-surface-hover"
                  }`}
                  onClick={() => question && onSelectQuestion(question.id)}
                >
                  {index + 1}
                </button>
              );
            },
          )}
        </div>
        <div className="mt-seek-5 space-y-seek-2 text-sm text-muted-foreground">
          <LegendSquare
            color="border-success bg-success-background"
            label="Correct"
          />
          <LegendSquare
            color="border-danger bg-danger-background"
            label="Wrong"
          />
          <LegendSquare color="border-border bg-surface" label="Unanswered" />
        </div>
      </aside>

      <section className="rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-sm">
        <div className="flex flex-wrap items-center justify-between gap-seek-3">
          <span className="rounded-full bg-cyan-100 px-seek-4 py-seek-2 text-sm font-semibold text-cyan-800">
            Time Spent: {activeQuestion.timeSpentSeconds}s
          </span>
          <span className="rounded-full bg-danger-background px-seek-4 py-seek-2 text-sm font-semibold text-danger">
            -{activeQuestion.marksDeducted} Marks Deducted
          </span>
        </div>
        <Text variant="muted" className="mt-seek-5 text-sm">
          {activeQuestion.code} of {report.totals.questionCount}
        </Text>
        <div className="mt-seek-2 rounded-seek-md border border-border px-seek-4 py-seek-4">
          <p className="font-sans text-base text-foreground">
            {activeQuestion.prompt}
          </p>
        </div>
        <div className="mt-seek-5 space-y-seek-3">
          {activeQuestion.options.map((option, index) => (
            <div
              key={option.id}
              className={`flex min-h-14 items-center gap-seek-4 rounded-seek-md border px-seek-4 py-seek-3 ${
                option.correct
                  ? "border-success bg-success-background"
                  : option.selected
                    ? "border-warning bg-warning-background"
                    : "border-border bg-surface"
              }`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted-background font-sans text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-sans text-base text-foreground">
                {option.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-seek-5 rounded-seek-md border border-warning bg-warning-background px-seek-4 py-seek-4">
          <p className="font-sans text-sm font-bold uppercase text-warning">
            Solution
          </p>
          <p className="mt-seek-2 font-sans text-sm leading-6 text-foreground">
            {activeQuestion.solution}
          </p>
        </div>
      </section>
    </div>
  );
}

function LegendSquare({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-seek-2">
      <span className={`h-4 w-4 rounded border ${color}`} />
      <span>{label}</span>
    </div>
  );
}

function TopScorersTab({ report }: { report: CandidateResultReport }) {
  return (
    <div className="space-y-seek-6">
      <section className="rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-sm">
        <h2 className="font-sans text-lg font-bold text-foreground">
          My Performance Comparison
        </h2>
        <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 md:grid-cols-3">
          <PerformanceCard
            label="My Best"
            value={report.performance.best}
            tone="success"
          />
          <PerformanceCard
            label="My Average"
            value={report.performance.average}
            tone="info"
          />
          <PerformanceCard
            label="My Worst"
            value={report.performance.worst}
            tone="danger"
          />
        </div>
        <div className="mt-seek-5 rounded-seek-md bg-blue-50 px-seek-4 py-seek-4 text-sm font-semibold text-blue-700">
          Based on {report.performance.attemptCount} attempts
        </div>
      </section>

      <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
        <h2 className="px-seek-6 py-seek-5 font-sans text-lg font-bold text-foreground">
          Leaderboard
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse">
            <thead>
              <tr className="border-t border-border text-left text-sm text-muted-foreground">
                <th className="px-seek-6 py-seek-4">#</th>
                <th className="px-seek-6 py-seek-4">Test Taker</th>
                <th className="px-seek-6 py-seek-4 text-right">Attempts</th>
                <th className="px-seek-6 py-seek-4 text-right">High Score</th>
              </tr>
            </thead>
            <tbody>
              {report.leaderboard.map((row) => (
                <tr key={row.rank} className="border-t border-border">
                  <td className="px-seek-6 py-seek-4 font-semibold">
                    {row.rank}
                  </td>
                  <td className="px-seek-6 py-seek-4">{row.testTaker}</td>
                  <td className="px-seek-6 py-seek-4 text-right">
                    {row.attempts}
                  </td>
                  <td className="px-seek-6 py-seek-4 text-right font-bold">
                    {row.highScore}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function PerformanceCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "info" | "danger";
}) {
  return (
    <div className="rounded-seek-md bg-muted-background p-seek-5 text-center">
      <Text variant="muted" className="text-sm">
        {label}
      </Text>
      <p
        className={`mt-seek-2 font-sans text-3xl font-bold ${
          tone === "success"
            ? "text-success"
            : tone === "danger"
              ? "text-danger"
              : "text-primary"
        }`}
      >
        {value}%
      </p>
    </div>
  );
}
