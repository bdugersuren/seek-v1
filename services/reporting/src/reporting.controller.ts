import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ReportingAttemptFact, ReportingService } from "./reporting.service";

@Controller("reporting")
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Post("events/assessment-result-finalized")
  projectAssessmentResultFinalized(
    @Body()
    event: Omit<ReportingAttemptFact, "createdAt" | "status"> & { status?: string }
  ) {
    return this.reportingService.projectAssessmentResultFinalized(event);
  }

  @Get("attempt-facts/:attemptId")
  getAttemptFact(@Param("attemptId") attemptId: string) {
    return this.reportingService.getAttemptFact(attemptId);
  }

  @Get("attempt-facts")
  listAttemptFacts(
    @Query("scheduleId") scheduleId?: string,
    @Query("regionId") regionId?: string,
    @Query("districtId") districtId?: string,
    @Query("schoolId") schoolId?: string
  ) {
    return this.reportingService.listAttemptFacts({
      scheduleId,
      regionId,
      districtId,
      schoolId,
    });
  }
}
