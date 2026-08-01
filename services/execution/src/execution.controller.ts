import { Controller, Get, Post, Body, Param, Sse, Res } from "@nestjs/common";
import { Observable } from "rxjs";
import {
  AssessmentAutosaveRequest,
  AssessmentAutosaveResponse,
  AssessmentHeartbeatRequest,
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
} from "@seek/contracts";
import { ExecutionService } from "./execution.service";
import { RuntimeAttempt } from "./interfaces/runtime-attempt.interface";
import { SseService, SseMessageEvent } from "./infrastructure/sse.service";

@Controller("execution")
export class ExecutionController {
  constructor(
    private readonly executionService: ExecutionService,
    private readonly sseService: SseService
  ) {}

  @Get("session/:attemptId")
  async getSession(
    @Param("attemptId") attemptId: string
  ): Promise<RuntimeAttempt> {
    return this.executionService.getSession(attemptId);
  }

  @Post("preload/:attemptId")
  async preloadPayload(
    @Param("attemptId") attemptId: string
  ): Promise<{ preloaded: boolean }> {
    return this.executionService.preloadPayload(attemptId);
  }

  @Post("heartbeat")
  async heartbeat(
    @Body() request: AssessmentHeartbeatRequest
  ): Promise<AssessmentHeartbeatResponse> {
    return this.executionService.heartbeat(request);
  }

  @Post("autosave")
  async autosave(
    @Body() request: AssessmentAutosaveRequest
  ): Promise<AssessmentAutosaveResponse> {
    return this.executionService.autosave(request);
  }

  @Post("submit")
  async submit(
    @Body() request: AssessmentSubmitRequest
  ): Promise<AssessmentSubmitResponse> {
    return this.executionService.submit(request);
  }

  @Post("violation")
  async recordViolation(
    @Body() violation: AssessmentRuntimeViolation
  ): Promise<{ accepted: boolean }> {
    return this.executionService.recordViolation(violation);
  }

  @Get("recover/:attemptId")
  async recoverSession(
    @Param("attemptId") attemptId: string
  ): Promise<RuntimeAttempt> {
    return this.executionService.recoverSession(attemptId);
  }

  @Sse("sse/:attemptId")
  sse(
    @Param("attemptId") attemptId: string,
    @Res({ passthrough: true }) res: any
  ): Observable<SseMessageEvent> {
    res.setHeader("X-Accel-Buffering", "no");
    return this.sseService.subscribe(attemptId);
  }

  @Post("mock-trigger-unlock/:attemptId")
  async triggerUnlock(
    @Param("attemptId") attemptId: string,
    @Body() body: { unlockKey?: string }
  ): Promise<{ emitted: boolean }> {
    const key = body.unlockKey || "mock-unlock-key-123";
    this.sseService.emitUnlock(attemptId, key);
    return { emitted: true };
  }
}
