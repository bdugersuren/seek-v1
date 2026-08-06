export class CreateScheduleDto {
  name: string;
  quizRevisionId: string;
  code: string;
  availableFrom: string; // ISO String
  availableUntil: string; // ISO String
  waitingRoomOpensAt?: string; // ISO String
  requiredEarlyJoinMinutes?: number;
  accessMode?: "ASSIGNED_ONLY" | "PUBLIC_REGISTRATION" | "INVITATION_ONLY" | "ORGANIZATION_ONLY" | "OPEN_WITH_CODE";
  accessCode?: string; // Cleartext access code
  capacity?: number;
  priceOverride?: number;
  autosaveIntervalSeconds?: number;
  heartbeatIntervalSeconds?: number;
  shuffleQuestionsOverride?: boolean;
  shuffleOptionsOverride?: boolean;
}

export class UpdateScheduleDto {
  name?: string;
  availableFrom?: string;
  availableUntil?: string;
  waitingRoomOpensAt?: string;
  requiredEarlyJoinMinutes?: number;
  accessMode?: "ASSIGNED_ONLY" | "PUBLIC_REGISTRATION" | "INVITATION_ONLY" | "ORGANIZATION_ONLY" | "OPEN_WITH_CODE";
  accessCode?: string;
  capacity?: number;
  priceOverride?: number;
  autosaveIntervalSeconds?: number;
  heartbeatIntervalSeconds?: number;
  shuffleQuestionsOverride?: boolean;
  shuffleOptionsOverride?: boolean;
}
