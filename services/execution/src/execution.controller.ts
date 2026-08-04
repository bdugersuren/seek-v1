import { Controller, Get, Post, Body, Param, Sse, Res, UseGuards } from "@nestjs/common";
import { Observable } from "rxjs";
import {
  AssessmentAutosaveRequest,
  AssessmentAutosaveResponse,
  CreateAssessmentAttemptRequest,
  CreateAssessmentAttemptResponse,
  AssessmentHeartbeatRequest,
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
  StartAssessmentAttemptResponse,
} from "@seek/contracts";
import { ExecutionService } from "./execution.service";
import { RuntimeAttempt } from "./interfaces/runtime-attempt.interface";
import { SseService, SseMessageEvent } from "./infrastructure/sse.service";
import { SignatureGuard } from "./infrastructure/guards/signature.guard";

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

  @Get("runtime/attempts/:attemptId/session")
  async getRuntimeSession(
    @Param("attemptId") attemptId: string
  ): Promise<RuntimeAttempt> {
    return this.executionService.getSession(attemptId);
  }

  @Post("attempts")
  async createAttempt(
    @Body() request: CreateAssessmentAttemptRequest
  ): Promise<CreateAssessmentAttemptResponse> {
    return this.executionService.createAttempt(request);
  }

  @Post("preload/:attemptId")
  async preloadPayload(
    @Param("attemptId") attemptId: string,
    @Body() body: { idempotencyKey?: string; clientInstanceId?: string }
  ): Promise<{ preloaded: boolean; payloadHash: string; receiptId: string }> {
    return this.executionService.preloadPayload(attemptId, body);
  }

  @Post("runtime/attempts/:attemptId/preload")
  async runtimePreloadPayload(
    @Param("attemptId") attemptId: string,
    @Body() body: { idempotencyKey?: string; clientInstanceId?: string }
  ): Promise<{ preloaded: boolean; payloadHash: string; receiptId: string }> {
    return this.executionService.preloadPayload(attemptId, body);
  }

  @Post("runtime/attempts/:attemptId/acknowledgements")
  async acknowledgeInstructions(
    @Param("attemptId") attemptId: string,
    @Body()
    body: {
      instructionHash: string;
      policyVersion?: string;
      acceptedBy?: string;
      idempotencyKey?: string;
    }
  ): Promise<{ accepted: boolean }> {
    return this.executionService.acknowledgeInstructions(attemptId, body);
  }

  @Post("start/:attemptId")
  async startAttempt(
    @Param("attemptId") attemptId: string,
    @Body() body: { idempotencyKey?: string; clientNow?: string; deviceFingerprint?: string }
  ): Promise<StartAssessmentAttemptResponse> {
    return this.executionService.startAttempt(attemptId, body);
  }

  @Post("runtime/attempts/:attemptId/start")
  async runtimeStartAttempt(
    @Param("attemptId") attemptId: string,
    @Body() body: { idempotencyKey?: string; clientNow?: string; deviceFingerprint?: string }
  ): Promise<StartAssessmentAttemptResponse> {
    return this.executionService.startAttempt(attemptId, body);
  }

  @Post("heartbeat")
  async heartbeat(
    @Body() request: AssessmentHeartbeatRequest
  ): Promise<AssessmentHeartbeatResponse> {
    return this.executionService.heartbeat(request);
  }

  @Post("runtime/attempts/:attemptId/heartbeat")
  async runtimeHeartbeat(
    @Param("attemptId") attemptId: string,
    @Body() request: Omit<AssessmentHeartbeatRequest, "attemptId">
  ): Promise<AssessmentHeartbeatResponse> {
    return this.executionService.heartbeat({ ...request, attemptId });
  }

  @Post("autosave")
  @UseGuards(SignatureGuard)
  async autosave(
    @Body() request: AssessmentAutosaveRequest
  ): Promise<AssessmentAutosaveResponse> {
    return this.executionService.autosave(request);
  }

  @Post("runtime/attempts/:attemptId/answers:autosave")
  @UseGuards(SignatureGuard)
  async runtimeAutosave(
    @Param("attemptId") attemptId: string,
    @Body() request: Omit<AssessmentAutosaveRequest, "attemptId">
  ): Promise<AssessmentAutosaveResponse> {
    return this.executionService.autosave({ ...request, attemptId });
  }

  @Post("runtime/attempts/:attemptId/navigation")
  async navigate(
    @Param("attemptId") attemptId: string,
    @Body()
    body: {
      fromQuestionId?: string;
      toQuestionId: string;
      clientSequence: number;
      idempotencyKey: string;
      saveRequired?: boolean;
      saveSucceeded?: boolean;
      clientOccurredAt?: string;
    }
  ): Promise<{ accepted: boolean }> {
    return this.executionService.navigate(attemptId, body);
  }

  @Post("submit")
  @UseGuards(SignatureGuard)
  async submit(
    @Body() request: AssessmentSubmitRequest
  ): Promise<AssessmentSubmitResponse> {
    return this.executionService.submit(request);
  }

  @Post("runtime/attempts/:attemptId/submit")
  @UseGuards(SignatureGuard)
  async runtimeSubmit(
    @Param("attemptId") attemptId: string,
    @Body() request: Omit<AssessmentSubmitRequest, "attemptId">
  ): Promise<AssessmentSubmitResponse> {
    return this.executionService.submit({ ...request, attemptId });
  }

  @Post("violation")
  @UseGuards(SignatureGuard)
  async recordViolation(
    @Body() violation: AssessmentRuntimeViolation
  ): Promise<{ accepted: boolean }> {
    return this.executionService.recordViolation(violation);
  }

  @Post("runtime/attempts/:attemptId/violations")
  @UseGuards(SignatureGuard)
  async runtimeRecordViolation(
    @Param("attemptId") attemptId: string,
    @Body() violation: Omit<AssessmentRuntimeViolation, "attemptId">
  ): Promise<{ accepted: boolean }> {
    return this.executionService.recordViolation({ ...violation, attemptId });
  }

  @Get("recover/:attemptId")
  async recoverSession(
    @Param("attemptId") attemptId: string
  ): Promise<RuntimeAttempt> {
    return this.executionService.recoverSession(attemptId);
  }

  @Get("runtime/attempts/:attemptId/receipt")
  async getReceipt(@Param("attemptId") attemptId: string) {
    return this.executionService.getReceipt(attemptId);
  }

  @Get("runtime/attempts/:attemptId/audit")
  async getAudit(@Param("attemptId") attemptId: string) {
    return this.executionService.getAuditEvents(attemptId);
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
