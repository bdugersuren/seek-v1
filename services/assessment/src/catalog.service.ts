import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(userId?: string) {
    // 1. Fetch published/upcoming schedules
    const schedules = await this.prisma.quizSchedule.findMany({
      where: {
        status: {
          in: ["OPEN", "ACTIVE", "SCHEDULED"],
        },
      },
      include: {
        quizRevision: {
          include: {
            quiz: true,
            sections: {
              include: {
                questions: true,
              },
            },
          },
        },
        paymentPolicy: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2. Fetch assignments if user is logged in
    const assignments = userId
      ? await this.prisma.quizUserAssignment.findMany({
          where: { userId },
        })
      : [];

    const assignmentMap = new Map(
      assignments.map((a) => [a.scheduleId, a])
    );

    // 3. Map schedules to CatalogAssessments with gate validation
    const now = new Date();

    return schedules.map((schedule) => {
      const revision = schedule.quizRevision;
      const quiz = revision.quiz;
      const assignment = assignmentMap.get(schedule.id);

      // Question count calculation across sections
      let questionCount = 0;
      if (revision.sections) {
        questionCount = revision.sections.reduce(
          (sum, sec) => sum + (sec.questions?.length || 0),
          0
        );
      }

      // Access Type and Price logic
      const isPaymentRequired = schedule.paymentPolicy?.paymentRequired ?? false;
      const price = schedule.priceOverride ? Number(schedule.priceOverride) : 0;
      
      let accessType: "free" | "paid" | "targeted" = "free";
      if (schedule.accessMode === "ASSIGNED_ONLY") {
        accessType = "targeted";
      } else if (isPaymentRequired && price > 0) {
        accessType = "paid";
      }

      // Gate check decisions
      let allowed = false;
      let requiredAction: "START" | "PAY" | "WAIT" | "EXPIRED" | "VIEW_RESULT" = "START";

      const attemptsUsed = assignment?.attemptsUsed ?? 0;
      const maxAttempts = assignment?.maxAttemptsOverride ?? schedule.maxAttemptsOverride ?? 1;

      // Evaluation rules
      if (now > schedule.availableUntil) {
        allowed = false;
        requiredAction = "EXPIRED";
      } else if (now < schedule.availableFrom) {
        allowed = false;
        requiredAction = "WAIT";
      } else if (isPaymentRequired && price > 0 && (!assignment || assignment.paymentStatus !== "PAID")) {
        allowed = false;
        requiredAction = "PAY";
      } else if (assignment && attemptsUsed >= maxAttempts) {
        allowed = false;
        requiredAction = "VIEW_RESULT";
      } else {
        allowed = true;
        requiredAction = "START";
      }

      return {
        id: schedule.id,
        title: schedule.name,
        description: revision.description || "",
        category: (quiz.assessmentType || "other") as any,
        categoryLabel: this.getCategoryLabel(quiz.assessmentType || "other"),
        accessType,
        accessLabel: accessType === "paid" ? "Төлбөртэй" : accessType === "targeted" ? "Зорилтот" : "Төлбөргүй",
        durationMinutes: schedule.durationMinutesOverride ?? revision.durationMinutes,
        questionCount,
        price,
        language: (schedule.languageCode || "mn") as any,
        imageTone: this.getImageTone(quiz.assessmentType || "other"),
        competencyTags: ["Мэдлэг", "Ур чадвар"], // Basic tags
        certificateAvailable: schedule.certificateEnabled,
        scheduledStartsAt: schedule.availableFrom.toISOString(),
        scheduledEndsAt: schedule.availableUntil.toISOString(),
        waitingRoomOpensAt: schedule.waitingRoomOpensAt?.toISOString(),
        requiredEarlyJoinMinutes: schedule.requiredEarlyJoinMinutes,
        totalPoints: Number(revision.passingScore) * 10, // Mock calculation for total score
        passingPercent: 60, // Standard passing gate
        allowed,
        requiredAction,
        attemptsUsed,
        lastAttemptId: assignment?.lastAttemptId || undefined,
        enrolled: !!assignment,
      };
    });
  }

  private getCategoryLabel(type: string): string {
    const labels: Record<string, string> = {
      career: "Ажил мэргэжил",
      knowledge: "Мэдлэг",
      skill: "Ур чадвар",
      attitude: "Хандлага",
      digital: "Дижитал ур чадвар",
      other: "Бусад",
    };
    return labels[type] || "Бусад";
  }

  private getImageTone(type: string): string {
    const tones: Record<string, string> = {
      career: "from-amber-50 to-amber-100",
      knowledge: "from-emerald-50 to-emerald-100",
      skill: "from-blue-50 to-blue-100",
      digital: "from-slate-50 to-slate-100",
      other: "from-slate-50 to-slate-100",
    };
    return tones[type] || "from-slate-50 to-slate-100";
  }
}
