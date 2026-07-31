export interface ResultMetric {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: "danger" | "success" | "info" | "warning";
}

export interface ResultQuestionReview {
  id: string;
  code: string;
  prompt: string;
  timeSpentSeconds: number;
  marksDeducted: number;
  status: "correct" | "wrong" | "unanswered";
  options: Array<{
    id: string;
    label: string;
    correct?: boolean;
    selected?: boolean;
  }>;
  solution: string;
}

export interface ResultSkillScore {
  label: string;
  value: number;
}

export interface ResultLeaderboardRow {
  rank: number;
  testTaker: string;
  highScore: number;
  attempts: number;
}

export interface CandidateResultReport {
  id: string;
  title: string;
  candidateName: string;
  assessmentTitle: string;
  status: "passed" | "failed";
  tabs: Array<"analysis" | "solutions" | "top-scorers">;
  metrics: ResultMetric[];
  totals: {
    questionCount: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
    totalMinutes: number;
    score: number;
    totalMarks: number;
    marksEarned: number;
    negativeMarks: number;
    speed: number;
  };
  skillScores: ResultSkillScore[];
  aiAnalysis: {
    title: string;
    summary: string;
    note: string;
  };
  questions: ResultQuestionReview[];
  performance: {
    best: number;
    average: number;
    worst: number;
    attemptCount: number;
  };
  leaderboard: ResultLeaderboardRow[];
}
