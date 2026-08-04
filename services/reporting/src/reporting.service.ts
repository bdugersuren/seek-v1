import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

export type ReportingAttemptFact = {
  attemptId: string;
  resultId?: string | null;
  tenantId?: string | null;
  scheduleId: string;
  quizId: string;
  quizRevisionId: string;
  candidateId: string;
  organizationId?: string | null;
  regionId?: string | null;
  districtId?: string | null;
  schoolId?: string | null;
  classId?: string | null;
  teacherId?: string | null;
  assessmentContextId?: string | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  durationSeconds?: number | null;
  finalScore?: number | null;
  maxPossibleScore?: number | null;
  percentage?: number | null;
  passStatus?: string | null;
  status: string;
  createdAt?: string;
};

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  async projectAssessmentResultFinalized(
    event: Omit<ReportingAttemptFact, "createdAt" | "status"> & { status?: string }
  ): Promise<ReportingAttemptFact> {
    if (!event.attemptId || !event.scheduleId || !event.quizId) {
      throw new BadRequestException("attemptId, scheduleId and quizId are required");
    }

    const fact = await this.prisma.reportingAttemptFact.upsert({
      where: { attemptId: event.attemptId },
      update: {
        resultId: event.resultId,
        tenantId: event.tenantId,
        scheduleId: event.scheduleId,
        quizId: event.quizId,
        quizRevisionId: event.quizRevisionId,
        candidateId: event.candidateId,
        organizationId: event.organizationId,
        regionId: event.regionId,
        districtId: event.districtId,
        schoolId: event.schoolId,
        classId: event.classId,
        teacherId: event.teacherId,
        assessmentContextId: event.assessmentContextId,
        startedAt: event.startedAt ? new Date(event.startedAt) : undefined,
        submittedAt: event.submittedAt ? new Date(event.submittedAt) : undefined,
        durationSeconds: event.durationSeconds,
        finalScore: event.finalScore,
        maxPossibleScore: event.maxPossibleScore,
        percentage: event.percentage,
        passStatus: event.passStatus,
        status: event.status || "FINAL",
      },
      create: {
        attemptId: event.attemptId,
        resultId: event.resultId,
        tenantId: event.tenantId,
        scheduleId: event.scheduleId,
        quizId: event.quizId,
        quizRevisionId: event.quizRevisionId,
        candidateId: event.candidateId,
        organizationId: event.organizationId,
        regionId: event.regionId,
        districtId: event.districtId,
        schoolId: event.schoolId,
        classId: event.classId,
        teacherId: event.teacherId,
        assessmentContextId: event.assessmentContextId,
        startedAt: event.startedAt ? new Date(event.startedAt) : undefined,
        submittedAt: event.submittedAt ? new Date(event.submittedAt) : undefined,
        durationSeconds: event.durationSeconds,
        finalScore: event.finalScore,
        maxPossibleScore: event.maxPossibleScore,
        percentage: event.percentage,
        passStatus: event.passStatus,
        status: event.status || "FINAL",
      },
    });

    return {
      attemptId: fact.attemptId,
      resultId: fact.resultId,
      tenantId: fact.tenantId,
      scheduleId: fact.scheduleId,
      quizId: fact.quizId,
      quizRevisionId: fact.quizRevisionId,
      candidateId: fact.candidateId,
      organizationId: fact.organizationId,
      regionId: fact.regionId,
      districtId: fact.districtId,
      schoolId: fact.schoolId,
      classId: fact.classId,
      teacherId: fact.teacherId,
      assessmentContextId: fact.assessmentContextId,
      startedAt: fact.startedAt?.toISOString(),
      submittedAt: fact.submittedAt?.toISOString(),
      durationSeconds: fact.durationSeconds,
      finalScore: fact.finalScore ? Number(fact.finalScore) : null,
      maxPossibleScore: fact.maxPossibleScore ? Number(fact.maxPossibleScore) : null,
      percentage: fact.percentage ? Number(fact.percentage) : null,
      passStatus: fact.passStatus,
      status: fact.status,
      createdAt: fact.createdAt.toISOString(),
    };
  }

  async getAttemptFact(attemptId: string): Promise<ReportingAttemptFact> {
    const fact = await this.prisma.reportingAttemptFact.findUnique({
      where: { attemptId },
    });

    if (!fact) {
      throw new NotFoundException(`Reporting fact for ${attemptId} not found`);
    }

    return {
      attemptId: fact.attemptId,
      resultId: fact.resultId,
      tenantId: fact.tenantId,
      scheduleId: fact.scheduleId,
      quizId: fact.quizId,
      quizRevisionId: fact.quizRevisionId,
      candidateId: fact.candidateId,
      organizationId: fact.organizationId,
      regionId: fact.regionId,
      districtId: fact.districtId,
      schoolId: fact.schoolId,
      classId: fact.classId,
      teacherId: fact.teacherId,
      assessmentContextId: fact.assessmentContextId,
      startedAt: fact.startedAt?.toISOString(),
      submittedAt: fact.submittedAt?.toISOString(),
      durationSeconds: fact.durationSeconds,
      finalScore: fact.finalScore ? Number(fact.finalScore) : null,
      maxPossibleScore: fact.maxPossibleScore ? Number(fact.maxPossibleScore) : null,
      percentage: fact.percentage ? Number(fact.percentage) : null,
      passStatus: fact.passStatus,
      status: fact.status,
      createdAt: fact.createdAt.toISOString(),
    };
  }

  async listAttemptFacts(filters: {
    scheduleId?: string;
    regionId?: string;
    districtId?: string;
    schoolId?: string;
  }): Promise<ReportingAttemptFact[]> {
    const facts = await this.prisma.reportingAttemptFact.findMany({
      where: {
        scheduleId: filters.scheduleId,
        regionId: filters.regionId,
        districtId: filters.districtId,
        schoolId: filters.schoolId,
      },
    });

    return facts.map((fact) => ({
      attemptId: fact.attemptId,
      resultId: fact.resultId,
      tenantId: fact.tenantId,
      scheduleId: fact.scheduleId,
      quizId: fact.quizId,
      quizRevisionId: fact.quizRevisionId,
      candidateId: fact.candidateId,
      organizationId: fact.organizationId,
      regionId: fact.regionId,
      districtId: fact.districtId,
      schoolId: fact.schoolId,
      classId: fact.classId,
      teacherId: fact.teacherId,
      assessmentContextId: fact.assessmentContextId,
      startedAt: fact.startedAt?.toISOString(),
      submittedAt: fact.submittedAt?.toISOString(),
      durationSeconds: fact.durationSeconds,
      finalScore: fact.finalScore ? Number(fact.finalScore) : null,
      maxPossibleScore: fact.maxPossibleScore ? Number(fact.maxPossibleScore) : null,
      percentage: fact.percentage ? Number(fact.percentage) : null,
      passStatus: fact.passStatus,
      status: fact.status,
      createdAt: fact.createdAt.toISOString(),
    }));
  }
}

