import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

export type ReportingAttemptFact = {
  attemptId: string;
  resultId?: string;
  tenantId?: string;
  scheduleId: string;
  quizId: string;
  quizRevisionId: string;
  candidateId: string;
  organizationId?: string;
  regionId?: string;
  districtId?: string;
  schoolId?: string;
  classId?: string;
  teacherId?: string;
  assessmentContextId?: string;
  startedAt?: string;
  submittedAt?: string;
  durationSeconds?: number;
  finalScore?: number;
  maxPossibleScore?: number;
  percentage?: number;
  passStatus?: string;
  status: string;
  createdAt: string;
};

@Injectable()
export class ReportingService {
  private readonly attemptFacts = new Map<string, ReportingAttemptFact>();

  projectAssessmentResultFinalized(
    event: Omit<ReportingAttemptFact, "createdAt" | "status"> & { status?: string }
  ): ReportingAttemptFact {
    if (!event.attemptId || !event.scheduleId || !event.quizId) {
      throw new BadRequestException("attemptId, scheduleId and quizId are required");
    }

    const fact: ReportingAttemptFact = {
      ...event,
      status: event.status || "FINAL",
      createdAt: new Date().toISOString(),
    };
    this.attemptFacts.set(fact.attemptId, fact);
    return fact;
  }

  getAttemptFact(attemptId: string): ReportingAttemptFact {
    const fact = this.attemptFacts.get(attemptId);
    if (!fact) {
      throw new NotFoundException(`Reporting fact for ${attemptId} not found`);
    }
    return fact;
  }

  listAttemptFacts(filters: {
    scheduleId?: string;
    regionId?: string;
    districtId?: string;
    schoolId?: string;
  }): ReportingAttemptFact[] {
    return Array.from(this.attemptFacts.values()).filter((fact) => {
      if (filters.scheduleId && fact.scheduleId !== filters.scheduleId) return false;
      if (filters.regionId && fact.regionId !== filters.regionId) return false;
      if (filters.districtId && fact.districtId !== filters.districtId) return false;
      if (filters.schoolId && fact.schoolId !== filters.schoolId) return false;
      return true;
    });
  }
}
