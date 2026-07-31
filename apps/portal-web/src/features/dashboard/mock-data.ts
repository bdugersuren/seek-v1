import type { PortalRole } from "@/features/auth/mock-users";
import type { RoleDashboard } from "./types";

export const roleDashboards: Record<PortalRole, RoleDashboard> = {
  super_admin: {
    role: "super_admin",
    title: "Платформын хяналт",
    subtitle: "Бүх байгууллага, service readiness, global activity тойм.",
    completion: 72,
    metrics: [
      {
        label: "Байгууллага",
        value: "18",
        description: "идэвхтэй tenant",
        tone: "primary",
      },
      {
        label: "Service health",
        value: "96%",
        description: "dev stack readiness",
        tone: "success",
      },
      {
        label: "Pending billing",
        value: "4",
        description: "review шаардлагатай",
        tone: "warning",
      },
    ],
    activities: [
      {
        title: "Auth stack healthy",
        description: "Gateway, Auth, Portal dev services healthy төлөвтэй.",
        timestamp: "Өнөөдөр",
        status: "success",
      },
      {
        title: "New organisation request",
        description: "Demo Organisation нэмэлт workspace хүссэн.",
        timestamp: "2 цагийн өмнө",
        status: "info",
      },
    ],
    quickActions: [
      {
        label: "Platform admin",
        description: "Global settings болон tenant overview харах.",
        href: "/admin",
      },
      {
        label: "Organisations",
        description: "Байгууллагын жагсаалт, status шалгах.",
        href: "/organisations",
      },
    ],
    workItems: [
      { label: "Security reviews", value: 3 },
      { label: "Tenant approvals", value: 5 },
      { label: "Infra checks", value: 7 },
    ],
  },
  organisation_admin: {
    role: "organisation_admin",
    title: "Байгууллагын ажлын самбар",
    subtitle: "Хэрэглэгч, assessment, invite болон report-ийн тойм.",
    completion: 64,
    metrics: [
      {
        label: "Хэрэглэгч",
        value: "126",
        description: "байгууллагын нийт хэрэглэгч",
        tone: "primary",
      },
      {
        label: "Идэвхтэй үнэлгээ",
        value: "9",
        description: "энэ сард ажиллаж буй",
        tone: "success",
      },
      {
        label: "Pending invite",
        value: "17",
        description: "илгээгдсэн боловч нээгдээгүй",
        tone: "warning",
      },
    ],
    activities: [
      {
        title: "Candidate batch invited",
        description: "Frontend Developer Skill Check рүү 24 хүн уригдсан.",
        timestamp: "Өчигдөр",
        status: "success",
      },
      {
        title: "Report approval pending",
        description: "5 verified report HR review хүлээж байна.",
        timestamp: "3 цагийн өмнө",
        status: "warning",
      },
    ],
    quickActions: [
      {
        label: "Organisation overview",
        description: "Workspace болон team тохиргоо харах.",
        href: "/organisations",
      },
      {
        label: "Create assessment",
        description: "Шинэ assessment workflow эхлүүлэх.",
        href: "/assessments",
      },
    ],
    workItems: [
      { label: "Invites to review", value: 17 },
      { label: "Reports to approve", value: 5 },
      { label: "Active cohorts", value: 4 },
    ],
  },
  assessor: {
    role: "assessor",
    title: "Assessor dashboard",
    subtitle: "Үнэлгээ үүсгэх, candidate progress хянах, review хийх тойм.",
    completion: 58,
    metrics: [
      {
        label: "Active assessments",
        value: "6",
        description: "таны хариуцсан үнэлгээ",
        tone: "primary",
      },
      {
        label: "Pending review",
        value: "14",
        description: "гараар шалгах шаардлагатай",
        tone: "warning",
      },
      {
        label: "Completed",
        value: "43",
        description: "энэ сард дууссан",
        tone: "success",
      },
    ],
    activities: [
      {
        title: "Assessment draft updated",
        description: "Customer Service Competency draft шинэчлэгдсэн.",
        timestamp: "30 минутын өмнө",
        status: "info",
      },
      {
        title: "Manual review queue",
        description: "14 candidate response review хүлээж байна.",
        timestamp: "Өнөөдөр",
        status: "warning",
      },
    ],
    quickActions: [
      {
        label: "Assessments",
        description: "Үнэлгээний жагсаалт, draft, candidate progress харах.",
        href: "/assessments",
      },
      {
        label: "Results",
        description: "Candidate score болон report preview харах.",
        href: "/results",
      },
    ],
    workItems: [
      { label: "Drafts", value: 2 },
      { label: "Manual reviews", value: 14 },
      { label: "Candidate questions", value: 6 },
    ],
  },
  candidate: {
    role: "candidate",
    title: "Үнэлүүлэгчийн хянах самбар",
    subtitle: "Идэвхтэй үнэлгээ, сертификат, төлбөр, хэтэвчийн товч тойм.",
    completion: 62,
    metrics: [
      {
        label: "Идэвхтэй тест",
        value: "2",
        description: "эхлүүлэх болон үргэлжлүүлэх",
        tone: "primary",
      },
      {
        label: "Progress",
        value: "62%",
        description: "нийт profile/readiness",
        tone: "warning",
      },
      {
        label: "Result",
        value: "8",
        description: "сертификат идэвхтэй",
        tone: "success",
      },
    ],
    activities: [
      {
        title: "Frontend Developer Skill Check",
        description: "Attempt хадгалагдсан, үргэлжлүүлэх боломжтой.",
        timestamp: "Өнөөдөр",
        status: "warning",
      },
      {
        title: "Previous result ready",
        description: "Customer Service Competency result нийтлэгдсэн.",
        timestamp: "2 өдөр",
        status: "success",
      },
    ],
    quickActions: [
      {
        label: "Continue test",
        description: "Миний идэвхтэй болон ирэх үнэлгээнүүдийг харах.",
        href: "/my-assessments",
      },
      {
        label: "Find assessments",
        description: "Каталогоос шинэ үнэлгээ хайж эхлүүлэх.",
        href: "/catalog",
      },
      {
        label: "Wallet",
        description: "Үлдэгдэл, top-up болон худалдан авалтын тойм.",
        href: "/wallet",
      },
    ],
    workItems: [
      { label: "Cart items", value: 2 },
      { label: "Wallet balance (k₮)", value: 15 },
      { label: "Certificates", value: 8 },
    ],
  },
  reviewer_hr: {
    role: "reviewer_hr",
    title: "Reviewer / HR dashboard",
    subtitle: "Candidate result, competency score, report review-ийн тойм.",
    completion: 81,
    metrics: [
      {
        label: "Reports ready",
        value: "22",
        description: "харах боломжтой",
        tone: "success",
      },
      {
        label: "Shortlist",
        value: "8",
        description: "өндөр оноотой candidate",
        tone: "primary",
      },
      {
        label: "Needs review",
        value: "3",
        description: "тайлбар шаардлагатай",
        tone: "warning",
      },
    ],
    activities: [
      {
        title: "Competency report generated",
        description: "Frontend Developer Skill Check cohort тайлан бэлэн.",
        timestamp: "1 цагийн өмнө",
        status: "success",
      },
      {
        title: "Reviewer note added",
        description: "Candidate Бат-Эрдэнэ дээр HR note нэмэгдсэн.",
        timestamp: "Өчигдөр",
        status: "info",
      },
    ],
    quickActions: [
      {
        label: "Results",
        description: "Candidate result болон competency score харах.",
        href: "/results",
      },
      {
        label: "Profile",
        description: "Reviewer profile болон preference шалгах.",
        href: "/profile",
      },
    ],
    workItems: [
      { label: "Reports to read", value: 22 },
      { label: "Candidates shortlisted", value: 8 },
      { label: "Notes pending", value: 3 },
    ],
  },
};
