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

let token: string | null = null;
let refreshing: Promise<string> | null = null;
async function refreshToken(): Promise<string> {
  if (!refreshing) refreshing = fetch(`${executionUrl.replace(/\/execution$/, "")}/auth/refresh`, {method:"POST",credentials:"include"})
    .then(async response => { if (!response.ok) throw new Error("Нэвтрэх хугацаа дууссан. seek.mn дээр дахин нэвтэрнэ үү."); const data=await response.json(); token=data.accessToken; return token!; })
    .finally(()=>{refreshing=null;});
  return refreshing;
}
export async function runtimeFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const send=async()=>fetch(url,{...init,credentials:"include",headers:{...Object.fromEntries(new Headers(init.headers)),Authorization:`Bearer ${token || await refreshToken()}`}});
  let response=await send();if(response.status===401){await refreshToken();response=await send();}
  return response;
}
export async function runtimeJson<T>(path:string,init:RequestInit={}):Promise<T>{
  const response=await runtimeFetch(`${executionUrl}${path}`,init);
  const data=await response.json();if(!response.ok)throw new Error(data.message || "Шалгалтын мэдээлэл татаж чадсангүй.");return data;
}
export function subscribeUnlock(attemptId:string, onUnlock:(key:string)=>void):()=>void {
  const controller=new AbortController();
  void (async()=>{const response=await runtimeFetch(`${executionUrl}/sse/${encodeURIComponent(attemptId)}`,{signal:controller.signal});
    if(!response.ok || !response.body)return;const reader=response.body.getReader();const decoder=new TextDecoder();let buffer="";
    while(!controller.signal.aborted){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});let end:number;
      while((end=buffer.indexOf("\n\n"))>=0){const frame=buffer.slice(0,end);buffer=buffer.slice(end+2);if(frame.includes("event: unlock")){const line=frame.split("\n").find(x=>x.startsWith("data:"));if(line){const data=JSON.parse(line.slice(5));if(data.unlockKey)onUnlock(data.unlockKey);}}}
    }
  })().catch(()=>{});return ()=>controller.abort();
}

export const httpRuntimeAdapter: RuntimeAdapter = {
  async getSession(attemptId) {
    const res = await runtimeFetch(`${executionUrl}/session/${attemptId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load attempt session");
    return res.json();
  },
  async preloadPayload(attemptId) {
    const res = await runtimeFetch(`${executionUrl}/preload/${attemptId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to preload payload");
    return res.json();
  },
  async startAttempt(attemptId) {
    await runtimeJson(`/runtime/attempts/${attemptId}/acknowledgements`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({instructionHash:"candidate-instructions-v1",policyVersion:"v1"})});
    const res = await runtimeFetch(`${executionUrl}/start/${attemptId}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to start attempt");
    return res.json();
  },
  async heartbeat(request) {
    const res = await runtimeFetch(`${executionUrl}/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Heartbeat failed");
    return res.json();
  },
  async autosave(request) {
    const res = await runtimeFetch(`${executionUrl}/autosave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Autosave failed");
    return res.json();
  },
  async submit(request) {
    const res = await runtimeFetch(`${executionUrl}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Submit failed");
    return res.json();
  },
  async recordViolation(violation) {
    const res = await runtimeFetch(`${executionUrl}/violation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(violation),
    });
    if (!res.ok) throw new Error("Record violation failed");
    return res.json();
  },
  async recoverSession(attemptId) {
    const res = await runtimeFetch(`${executionUrl}/recover/${attemptId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to recover session");
    return res.json();
  },
};

const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";
export const runtimeAdapter: RuntimeAdapter = isMockMode ? mockRuntimeAdapter : httpRuntimeAdapter;
