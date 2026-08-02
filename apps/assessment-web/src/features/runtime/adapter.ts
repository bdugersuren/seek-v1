"use client";

import type {
  AssessmentAutosaveRequest,
  AssessmentAutosaveResponse,
  AssessmentHeartbeatRequest,
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentSubmitRequest,
  AssessmentSubmitResponse,
  StartAssessmentAttemptResponse,
} from "@seek/contracts";
import { mockRuntimeAttempt } from "./mock-data";
import type { RuntimeAttempt } from "./types";

function getRemainingSeconds(endsAt: string) {
  return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
}

export interface RuntimeAdapter {
  getSession(attemptId: string): Promise<RuntimeAttempt | null>;
  preloadPayload(attemptId: string): Promise<{ preloaded: boolean }>;
  startAttempt(attemptId: string): Promise<StartAssessmentAttemptResponse>;
  heartbeat(request: AssessmentHeartbeatRequest): Promise<AssessmentHeartbeatResponse>;
  autosave(request: AssessmentAutosaveRequest): Promise<AssessmentAutosaveResponse>;
  submit(request: AssessmentSubmitRequest): Promise<AssessmentSubmitResponse>;
  recordViolation(violation: AssessmentRuntimeViolation): Promise<{ accepted: boolean }>;
  recoverSession(attemptId: string): Promise<RuntimeAttempt | null>;
}

export const mockRuntimeAdapter: RuntimeAdapter = {
  async getSession(attemptId) {
    return attemptId === mockRuntimeAttempt.session.attemptId ? mockRuntimeAttempt : null;
  },
  async preloadPayload(attemptId) {
    return { preloaded: attemptId === mockRuntimeAttempt.session.attemptId };
  },
  async startAttempt(attemptId) {
    return {
      attemptId,
      quizId: mockRuntimeAttempt.session.quizId,
      status: "active",
      unlockKey: "mock-unlock-key-123",
      serverNow: new Date().toISOString(),
    };
  },
  async heartbeat(request) {
    const remainingSeconds = getRemainingSeconds(mockRuntimeAttempt.session.endsAt);
    return {
      attemptId: request.attemptId,
      serverNow: new Date().toISOString(),
      remainingSeconds,
      status: remainingSeconds > 0 ? "active" : "expired",
      forceSubmit: remainingSeconds <= 0,
      serverVersion: request.localVersion,
    };
  },
  async autosave(request) {
    return {
      attemptId: request.attemptId,
      accepted: true,
      serverVersion: request.localVersion,
      serverSavedAt: new Date().toISOString(),
    };
  },
  async submit(request) {
    return {
      attemptId: request.attemptId,
      accepted: true,
      status: "submitted",
      receiptId: `receipt-${request.attemptId}`,
      serverSubmittedAt: new Date().toISOString(),
      answeredCount: Object.values(request.finalSnapshot.answers).filter(Boolean).length,
      totalQuestions: mockRuntimeAttempt.questions.length,
    };
  },
  async recordViolation() {
    return { accepted: true };
  },
  async recoverSession(attemptId) {
    return this.getSession(attemptId);
  },
};

const executionUrl = process.env.NEXT_PUBLIC_EXECUTION_URL || "http://127.0.0.1:3010/api/v1/execution";

export const httpRuntimeAdapter: RuntimeAdapter = {
  async getSession(attemptId) {
    const res = await fetch(`${executionUrl}/session/${attemptId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load attempt session");
    return res.json();
  },
  async preloadPayload(attemptId) {
    const res = await fetch(`${executionUrl}/preload/${attemptId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to preload payload");
    return res.json();
  },
  async startAttempt(attemptId) {
    const res = await fetch(`${executionUrl}/start/${attemptId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to start attempt");
    return res.json();
  },
  async heartbeat(request) {
    const res = await fetch(`${executionUrl}/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Heartbeat failed");
    return res.json();
  },
  async autosave(request) {
    const res = await fetch(`${executionUrl}/autosave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Autosave failed");
    return res.json();
  },
  async submit(request) {
    const res = await fetch(`${executionUrl}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Submit failed");
    return res.json();
  },
  async recordViolation(violation) {
    const res = await fetch(`${executionUrl}/violation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(violation),
    });
    if (!res.ok) throw new Error("Record violation failed");
    return res.json();
  },
  async recoverSession(attemptId) {
    const res = await fetch(`${executionUrl}/recover/${attemptId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to recover session");
    return res.json();
  },
};

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";
export const runtimeAdapter: RuntimeAdapter = isMockMode ? mockRuntimeAdapter : httpRuntimeAdapter;
