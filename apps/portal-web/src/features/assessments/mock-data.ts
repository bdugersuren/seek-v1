import type { Assessment } from "./types";

export const mockAssessments: Assessment[] = [
  {
    id: "frontend-developer-skill-check",
    title: "Frontend Developer Skill Check",
    description:
      "React, TypeScript, accessibility, UI reasoning болон problem-solving чадварыг үнэлэх assessment.",
    status: "Active",
    tag: "Paid",
    candidates: 18,
    completed: 11,
    durationMinutes: 90,
    questionCount: 32,
    priceLabel: "15,000₮",
    owner: "Assessment team",
    competencies: ["React", "TypeScript", "UI/UX", "Accessibility"],
    questions: [
      {
        id: "q1",
        title: "Component boundary",
        markdown:
          "Explain when to split a UI into reusable components. Include one example using `props`.",
        points: 10,
      },
      {
        id: "q2",
        title: "Math rendering preview",
        markdown:
          "A scoring function may be written as `$score = correct / total * 100$`. Describe how you would display this to a candidate.",
        points: 8,
      },
    ],
  },
  {
    id: "customer-service-competency",
    title: "Customer Service Competency",
    description:
      "Хэрэглэгчтэй харилцах ур чадвар, нөхцөл байдлын шийдвэр гаргалт, service mindset үнэлнэ.",
    status: "Draft",
    tag: "Free",
    candidates: 0,
    completed: 0,
    durationMinutes: 60,
    questionCount: 24,
    priceLabel: "Үнэгүй",
    owner: "Organisation Admin",
    competencies: ["Communication", "Problem solving", "Service quality"],
    questions: [
      {
        id: "q1",
        title: "Customer scenario",
        markdown:
          "A customer reports a delayed response. Choose the best next step and explain why.",
        points: 10,
      },
    ],
  },
  {
    id: "school-leadership-assessment",
    title: "School Leadership Assessment",
    description:
      "Сургуулийн удирдлагын манлайлал, төлөвлөлт, багийн удирдлагын чадварыг үнэлнэ.",
    status: "Review",
    tag: "Custom",
    candidates: 42,
    completed: 31,
    durationMinutes: 75,
    questionCount: 28,
    priceLabel: "12,000₮",
    owner: "Reviewer / HR",
    competencies: ["Leadership", "Planning", "Team management"],
    questions: [
      {
        id: "q1",
        title: "Leadership decision",
        markdown:
          "Describe how you would prioritise teacher development initiatives over one semester.",
        points: 12,
      },
    ],
  },
];
