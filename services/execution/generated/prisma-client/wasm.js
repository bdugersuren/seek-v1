
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AttemptEligibilitySnapshotScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  organizationId: 'organizationId',
  regionId: 'regionId',
  districtId: 'districtId',
  schoolId: 'schoolId',
  classId: 'classId',
  scheduleId: 'scheduleId',
  assignmentId: 'assignmentId',
  candidateId: 'candidateId',
  quizId: 'quizId',
  quizRevisionId: 'quizRevisionId',
  status: 'status',
  availableFrom: 'availableFrom',
  availableUntil: 'availableUntil',
  durationLimitSeconds: 'durationLimitSeconds',
  maxAttempts: 'maxAttempts',
  endTimePolicy: 'endTimePolicy',
  accessMode: 'accessMode',
  timezone: 'timezone',
  scheduleSnapshot: 'scheduleSnapshot',
  runtimePolicySnapshot: 'runtimePolicySnapshot',
  proctoringPolicySnapshot: 'proctoringPolicySnapshot',
  resultPolicySnapshot: 'resultPolicySnapshot',
  accessPolicySnapshot: 'accessPolicySnapshot',
  candidateDisplayNameSnapshot: 'candidateDisplayNameSnapshot',
  candidateExternalIdHash: 'candidateExternalIdHash',
  attemptsUsedSnapshot: 'attemptsUsedSnapshot',
  paymentEntitlementSnapshot: 'paymentEntitlementSnapshot',
  termsRequired: 'termsRequired',
  waitingRoomOpensAt: 'waitingRoomOpensAt',
  requiredEarlyJoinMinutes: 'requiredEarlyJoinMinutes',
  admissionStatus: 'admissionStatus',
  admissionTokenHash: 'admissionTokenHash',
  queuePosition: 'queuePosition',
  eligibilityChecksum: 'eligibilityChecksum',
  snapshotHash: 'snapshotHash',
  signedAt: 'signedAt',
  signingKeyId: 'signingKeyId',
  sourceVersion: 'sourceVersion',
  preparedAt: 'preparedAt',
  activatedAt: 'activatedAt',
  revokedAt: 'revokedAt',
  revokeReason: 'revokeReason',
  expiresAt: 'expiresAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizAttemptScalarFieldEnum = {
  id: 'id',
  eligibilitySnapshotId: 'eligibilitySnapshotId',
  tenantId: 'tenantId',
  partitionKey: 'partitionKey',
  regionId: 'regionId',
  scheduleId: 'scheduleId',
  quizId: 'quizId',
  quizRevisionId: 'quizRevisionId',
  assignmentId: 'assignmentId',
  candidateId: 'candidateId',
  attemptNumber: 'attemptNumber',
  createdFromRequestId: 'createdFromRequestId',
  idempotencyKey: 'idempotencyKey',
  status: 'status',
  statusReason: 'statusReason',
  durationLimitSeconds: 'durationLimitSeconds',
  warningsCount: 'warningsCount',
  rowVersion: 'rowVersion',
  serverStartedAt: 'serverStartedAt',
  startedByClientAt: 'startedByClientAt',
  startedAt: 'startedAt',
  expiresAt: 'expiresAt',
  submittedAt: 'submittedAt',
  lockedAt: 'lockedAt',
  lockReason: 'lockReason',
  lastHeartbeatAt: 'lastHeartbeatAt',
  resumeCount: 'resumeCount',
  lastResumeAt: 'lastResumeAt',
  pauseCount: 'pauseCount',
  pausedAt: 'pausedAt',
  pauseReason: 'pauseReason',
  heartbeatMissCount: 'heartbeatMissCount',
  networkLatencyMs: 'networkLatencyMs',
  lastRoundTripMs: 'lastRoundTripMs',
  clientClockSkewMs: 'clientClockSkewMs',
  clientInstanceId: 'clientInstanceId',
  clientIp: 'clientIp',
  userAgent: 'userAgent',
  runtimeVersion: 'runtimeVersion',
  clientPlatform: 'clientPlatform',
  browserName: 'browserName',
  browserVersion: 'browserVersion',
  osName: 'osName',
  deviceModel: 'deviceModel',
  deviceFingerprintHash: 'deviceFingerprintHash',
  lockPolicyDecisionId: 'lockPolicyDecisionId',
  invalidatedBy: 'invalidatedBy',
  invalidatedReason: 'invalidatedReason',
  submissionChecksum: 'submissionChecksum',
  submittedSource: 'submittedSource',
  scheduleSnapshot: 'scheduleSnapshot',
  runtimePolicySnapshot: 'runtimePolicySnapshot',
  proctoringPolicySnapshot: 'proctoringPolicySnapshot',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttemptQuestionScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  questionId: 'questionId',
  questionVersionId: 'questionVersionId',
  quizRevisionSectionId: 'quizRevisionSectionId',
  topicQuestionClassificationId: 'topicQuestionClassificationId',
  sectionTitleSnapshot: 'sectionTitleSnapshot',
  sectionOrderIndex: 'sectionOrderIndex',
  questionCodeSnapshot: 'questionCodeSnapshot',
  instructionSnapshot: 'instructionSnapshot',
  orderIndex: 'orderIndex',
  deliveredSequence: 'deliveredSequence',
  deliveryStatus: 'deliveryStatus',
  isRequired: 'isRequired',
  maxScoreSnapshot: 'maxScoreSnapshot',
  minScoreSnapshot: 'minScoreSnapshot',
  negativeScoreSnapshot: 'negativeScoreSnapshot',
  timeLimitSecondsSnapshot: 'timeLimitSecondsSnapshot',
  partialCreditPolicySnapshot: 'partialCreditPolicySnapshot',
  questionTypeCodeSnapshot: 'questionTypeCodeSnapshot',
  contentSnapshot: 'contentSnapshot',
  presentationConfigSnapshot: 'presentationConfigSnapshot',
  optionsSnapshot: 'optionsSnapshot',
  mediaSnapshot: 'mediaSnapshot',
  classificationSnapshot: 'classificationSnapshot',
  contentHash: 'contentHash',
  optionsHash: 'optionsHash',
  mediaHash: 'mediaHash',
  gradingConfigCipher: 'gradingConfigCipher',
  gradingConfigKeyId: 'gradingConfigKeyId',
  answerKeyVersionHash: 'answerKeyVersionHash',
  optionsOrder: 'optionsOrder',
  selectionReason: 'selectionReason',
  deliveredAt: 'deliveredAt',
  clientDecryptAt: 'clientDecryptAt',
  renderedAt: 'renderedAt',
  createdAt: 'createdAt'
};

exports.Prisma.QuestionResponseScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  attemptQuestionId: 'attemptQuestionId',
  answerValue: 'answerValue',
  encryptedAnswerValue: 'encryptedAnswerValue',
  answerChecksum: 'answerChecksum',
  answerStatus: 'answerStatus',
  serverVersion: 'serverVersion',
  rowVersion: 'rowVersion',
  lastClientSequence: 'lastClientSequence',
  clientTimeSpentMs: 'clientTimeSpentMs',
  timeSpentMsServer: 'timeSpentMsServer',
  focusTimeMs: 'focusTimeMs',
  blurTimeMs: 'blurTimeMs',
  lastClientSavedAt: 'lastClientSavedAt',
  clientClockSkewMs: 'clientClockSkewMs',
  conflictCount: 'conflictCount',
  firstAnsweredAt: 'firstAnsweredAt',
  lastAnsweredAt: 'lastAnsweredAt',
  savedAt: 'savedAt',
  lastSourceEventId: 'lastSourceEventId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionResponseEventScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  attemptQuestionId: 'attemptQuestionId',
  partitionKey: 'partitionKey',
  eventType: 'eventType',
  clientInstanceId: 'clientInstanceId',
  clientSequence: 'clientSequence',
  baseServerVersion: 'baseServerVersion',
  idempotencyKey: 'idempotencyKey',
  answerValue: 'answerValue',
  payloadChecksum: 'payloadChecksum',
  requestSignature: 'requestSignature',
  nonce: 'nonce',
  clientOccurredAt: 'clientOccurredAt',
  serverReceivedAt: 'serverReceivedAt',
  serverAppliedAt: 'serverAppliedAt',
  applyStatus: 'applyStatus',
  rejectReason: 'rejectReason',
  ipHash: 'ipHash',
  userAgentHash: 'userAgentHash',
  deviceFingerprintHash: 'deviceFingerprintHash',
  sourceEventId: 'sourceEventId'
};

exports.Prisma.QuizViolationScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  idempotencyKey: 'idempotencyKey',
  violationType: 'violationType',
  severity: 'severity',
  clientInstanceId: 'clientInstanceId',
  clientSequence: 'clientSequence',
  clientOccurredAt: 'clientOccurredAt',
  serverReceivedAt: 'serverReceivedAt',
  actionTaken: 'actionTaken',
  messageCode: 'messageCode',
  evidenceHash: 'evidenceHash',
  screenshotFileId: 'screenshotFileId',
  proctoringSessionId: 'proctoringSessionId',
  policyRuleId: 'policyRuleId',
  thresholdBefore: 'thresholdBefore',
  thresholdAfter: 'thresholdAfter',
  decisionStatus: 'decisionStatus',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  reviewOutcome: 'reviewOutcome',
  metadata: 'metadata'
};

exports.Prisma.AttemptStateSnapshotScalarFieldEnum = {
  attemptId: 'attemptId',
  snapshotVersion: 'snapshotVersion',
  answers: 'answers',
  encryptedSnapshot: 'encryptedSnapshot',
  markedForReview: 'markedForReview',
  currentAttemptQuestionId: 'currentAttemptQuestionId',
  lastClientSequence: 'lastClientSequence',
  lastResponseServerVersion: 'lastResponseServerVersion',
  navigationState: 'navigationState',
  checksum: 'checksum',
  snapshotHash: 'snapshotHash',
  signature: 'signature',
  keyId: 'keyId',
  lastHeartbeatAt: 'lastHeartbeatAt',
  lastOnlineAt: 'lastOnlineAt',
  pendingSubmitReason: 'pendingSubmitReason',
  offlineSince: 'offlineSince',
  snapshotSource: 'snapshotSource',
  capturedAt: 'capturedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttemptSubmissionScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  submissionVersion: 'submissionVersion',
  idempotencyKey: 'idempotencyKey',
  source: 'source',
  submitReason: 'submitReason',
  finalSnapshotVersion: 'finalSnapshotVersion',
  submissionChecksum: 'submissionChecksum',
  clientSubmittedAt: 'clientSubmittedAt',
  requestedAt: 'requestedAt',
  serverReceivedAt: 'serverReceivedAt',
  clientClockSkewMs: 'clientClockSkewMs',
  finalAnswerCount: 'finalAnswerCount',
  finalMarkedCount: 'finalMarkedCount',
  finalDurationMs: 'finalDurationMs',
  requestSignature: 'requestSignature',
  receiptNumber: 'receiptNumber',
  receiptPayloadHash: 'receiptPayloadHash',
  gradingJobId: 'gradingJobId',
  acceptedAt: 'acceptedAt',
  resultStatus: 'resultStatus',
  rejectionReason: 'rejectionReason'
};

exports.Prisma.AttemptLifecycleEventScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  reason: 'reason',
  actorType: 'actorType',
  actorId: 'actorId',
  idempotencyKey: 'idempotencyKey',
  metadata: 'metadata',
  occurredAt: 'occurredAt'
};

exports.Prisma.AttemptHeartbeatEventScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  clientInstanceId: 'clientInstanceId',
  clientNow: 'clientNow',
  serverReceivedAt: 'serverReceivedAt',
  serverRespondedAt: 'serverRespondedAt',
  visible: 'visible',
  fullscreen: 'fullscreen',
  online: 'online',
  clientClockSkewMs: 'clientClockSkewMs',
  roundTripMs: 'roundTripMs',
  networkType: 'networkType',
  remainingSeconds: 'remainingSeconds',
  status: 'status',
  warning: 'warning',
  requestSignature: 'requestSignature',
  metadata: 'metadata'
};

exports.Prisma.AttemptInstructionAcknowledgementScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  instructionHash: 'instructionHash',
  policyVersion: 'policyVersion',
  acceptedBy: 'acceptedBy',
  acceptedAt: 'acceptedAt',
  clientIpHash: 'clientIpHash',
  userAgentHash: 'userAgentHash',
  metadata: 'metadata'
};

exports.Prisma.AttemptNavigationEventScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  fromAttemptQuestionId: 'fromAttemptQuestionId',
  toAttemptQuestionId: 'toAttemptQuestionId',
  clientSequence: 'clientSequence',
  idempotencyKey: 'idempotencyKey',
  saveRequired: 'saveRequired',
  saveSucceeded: 'saveSucceeded',
  clientOccurredAt: 'clientOccurredAt',
  serverReceivedAt: 'serverReceivedAt'
};

exports.Prisma.AttemptLockDecisionScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  policyRuleId: 'policyRuleId',
  violationCount: 'violationCount',
  decision: 'decision',
  reason: 'reason',
  decidedBy: 'decidedBy',
  decidedAt: 'decidedAt',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  metadata: 'metadata'
};

exports.Prisma.AttemptPayloadReceiptScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  payloadHash: 'payloadHash',
  keyId: 'keyId',
  receiptType: 'receiptType',
  deliveredAt: 'deliveredAt',
  acknowledgedAt: 'acknowledgedAt',
  clientInstanceId: 'clientInstanceId',
  clientIpHash: 'clientIpHash',
  userAgentHash: 'userAgentHash',
  metadata: 'metadata'
};

exports.Prisma.RuntimeDeliveryEventScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  eventType: 'eventType',
  deliveryKey: 'deliveryKey',
  payloadHash: 'payloadHash',
  keyId: 'keyId',
  deliveredAt: 'deliveredAt',
  acknowledgedAt: 'acknowledgedAt',
  expiresAt: 'expiresAt',
  clientInstanceId: 'clientInstanceId',
  metadata: 'metadata'
};

exports.Prisma.OutboxEventScalarFieldEnum = {
  id: 'id',
  eventId: 'eventId',
  aggregateType: 'aggregateType',
  aggregateId: 'aggregateId',
  eventType: 'eventType',
  schemaVersion: 'schemaVersion',
  payload: 'payload',
  partitionKey: 'partitionKey',
  idempotencyKey: 'idempotencyKey',
  traceId: 'traceId',
  correlationId: 'correlationId',
  causationId: 'causationId',
  status: 'status',
  retryCount: 'retryCount',
  maxRetries: 'maxRetries',
  availableAt: 'availableAt',
  nextRetryAt: 'nextRetryAt',
  lockedBy: 'lockedBy',
  lockedAt: 'lockedAt',
  lockExpiresAt: 'lockExpiresAt',
  createdAt: 'createdAt',
  publishedAt: 'publishedAt',
  lastAttemptAt: 'lastAttemptAt',
  deadLetteredAt: 'deadLetteredAt',
  lastError: 'lastError'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.EligibilityStatus = exports.$Enums.EligibilityStatus = {
  PREPARED: 'PREPARED',
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED'
};

exports.AttemptStatus = exports.$Enums.AttemptStatus = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  EXPIRED: 'EXPIRED',
  LOCKED: 'LOCKED',
  CANCELLED: 'CANCELLED',
  INVALIDATED: 'INVALIDATED'
};

exports.SubmissionSource = exports.$Enums.SubmissionSource = {
  USER: 'USER',
  AUTO_EXPIRE: 'AUTO_EXPIRE',
  ADMIN: 'ADMIN',
  SYSTEM_RECOVERY: 'SYSTEM_RECOVERY'
};

exports.AnswerStatus = exports.$Enums.AnswerStatus = {
  EMPTY: 'EMPTY',
  DRAFT: 'DRAFT',
  SAVED: 'SAVED',
  REJECTED: 'REJECTED',
  CONFLICT: 'CONFLICT'
};

exports.ResponseApplyStatus = exports.$Enums.ResponseApplyStatus = {
  APPLIED: 'APPLIED',
  REJECTED: 'REJECTED',
  CONFLICT: 'CONFLICT',
  DUPLICATE: 'DUPLICATE'
};

exports.ViolationSeverity = exports.$Enums.ViolationSeverity = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  CRITICAL: 'CRITICAL'
};

exports.SubmissionResultStatus = exports.$Enums.SubmissionResultStatus = {
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  DUPLICATE: 'DUPLICATE'
};

exports.Prisma.ModelName = {
  AttemptEligibilitySnapshot: 'AttemptEligibilitySnapshot',
  QuizAttempt: 'QuizAttempt',
  AttemptQuestion: 'AttemptQuestion',
  QuestionResponse: 'QuestionResponse',
  QuestionResponseEvent: 'QuestionResponseEvent',
  QuizViolation: 'QuizViolation',
  AttemptStateSnapshot: 'AttemptStateSnapshot',
  AttemptSubmission: 'AttemptSubmission',
  AttemptLifecycleEvent: 'AttemptLifecycleEvent',
  AttemptHeartbeatEvent: 'AttemptHeartbeatEvent',
  AttemptInstructionAcknowledgement: 'AttemptInstructionAcknowledgement',
  AttemptNavigationEvent: 'AttemptNavigationEvent',
  AttemptLockDecision: 'AttemptLockDecision',
  AttemptPayloadReceipt: 'AttemptPayloadReceipt',
  RuntimeDeliveryEvent: 'RuntimeDeliveryEvent',
  OutboxEvent: 'OutboxEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
