import type {
  AssessmentHeartbeatResponse,
  AssessmentRuntimeViolation,
  AssessmentUnlockEvent,
} from "@seek/contracts";

export const runtimeEventNames = {
  startUnlocked: "runtime.start_unlocked",
  forceSubmit: "runtime.force_submit",
  warning: "runtime.warning",
  locked: "runtime.locked",
  serverTime: "runtime.server_time",
} as const;

export type RuntimeEventName =
  (typeof runtimeEventNames)[keyof typeof runtimeEventNames];

export type RuntimeEventPayloadMap = {
  [runtimeEventNames.startUnlocked]: AssessmentUnlockEvent;
  [runtimeEventNames.forceSubmit]: AssessmentHeartbeatResponse;
  [runtimeEventNames.warning]: AssessmentRuntimeViolation;
  [runtimeEventNames.locked]: AssessmentRuntimeViolation;
  [runtimeEventNames.serverTime]: { serverNow: string; remainingSeconds: number };
};

