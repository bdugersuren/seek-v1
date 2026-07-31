import type { CandidateResultReport } from "./types";

export const mockCandidateResultReport: CandidateResultReport = {
  id: "mock-result-001",
  title: "cvbcv Results",
  candidateName: "Candidate",
  assessmentTitle: "cvbcv",
  status: "failed",
  tabs: ["analysis", "solutions", "top-scorers"],
  metrics: [
    {
      id: "status",
      label: "Failed",
      value: "0%",
      helper: "Min. 73%",
      tone: "danger",
    },
    {
      id: "score",
      label: "Score",
      value: "0.00",
      helper: "Marks 28",
      tone: "success",
    },
    {
      id: "accuracy",
      label: "Accuracy",
      value: "0%",
      helper: "0 answered",
      tone: "success",
    },
    {
      id: "speed",
      label: "Speed",
      value: "105",
      helper: "Que/Hour",
      tone: "info",
    },
  ],
  totals: {
    questionCount: 7,
    answered: 0,
    correct: 0,
    wrong: 0,
    unanswered: 7,
    totalMinutes: 4,
    score: 0,
    totalMarks: 28,
    marksEarned: 0,
    negativeMarks: 0,
    speed: 105,
  },
  skillScores: [
    { label: "Coding", value: 82 },
    { label: "Reading", value: 68 },
    { label: "Math", value: 91 },
  ],
  aiAnalysis: {
    title: "AI Алдааны Дүн Шинжилгээ",
    summary:
      "Одоогоор сул талын оношлогоо хийх хангалттай өгөгдөл цуглараагүй байна.",
    note: "* Tutor Agent болон Mistake Analysis Агент-ийн автомат үнэлгээ.",
  },
  questions: [
    {
      id: "q1",
      code: "Q1",
      prompt: "5/6 - 1/3 үйлдлийг гүйцэтгэнэ үү.",
      timeSpentSeconds: 0,
      marksDeducted: 0,
      status: "unanswered",
      options: [
        { id: "a", label: "1/2", correct: true },
        { id: "b", label: "4/3" },
        { id: "c", label: "4/6", selected: true },
        { id: "d", label: "4/9" },
      ],
      solution:
        "1/3 бутархайн хуваарийг 6 болгохын тулд хүртвэр ба хуваарийг 2-оор үржүүлж 2/6 болгоно. 5/6 - 2/6 = 3/6 = 1/2.",
    },
    {
      id: "q2",
      code: "Q2",
      prompt: "Дараах илэрхийллүүдээс утга нь 12-той тэнцүү байхыг сонго.",
      timeSpentSeconds: 18,
      marksDeducted: 0,
      status: "correct",
      options: [
        { id: "a", label: "3 × 4", correct: true, selected: true },
        { id: "b", label: "15 - 4" },
        { id: "c", label: "6 + 5" },
      ],
      solution: "3 × 4 = 12 тул зөв хариулт.",
    },
    {
      id: "q3",
      code: "Q3",
      prompt:
        "Энгийн бутархайг зэрэг дэвшүүлсэн үйлдлийг үр дүнтэй нь тохируул.",
      timeSpentSeconds: 27,
      marksDeducted: 0,
      status: "wrong",
      options: [
        { id: "a", label: "(1/2)^2 = 1/4", correct: true },
        { id: "b", label: "(1/2)^2 = 1/2", selected: true },
      ],
      solution:
        "Бутархайг зэрэг дэвшүүлэхэд хүртвэр болон хуваарийг тус бүр зэрэг дэвшүүлнэ.",
    },
  ],
  performance: {
    best: 38,
    average: 19,
    worst: 0,
    attemptCount: 2,
  },
  leaderboard: [
    { rank: 1, testTaker: "Demo Learner", highScore: 92, attempts: 1 },
    { rank: 2, testTaker: "Candidate", highScore: 38, attempts: 2 },
    { rank: 3, testTaker: "Practice User", highScore: 24, attempts: 1 },
  ],
};
