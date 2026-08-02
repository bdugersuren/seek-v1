
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

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  lifecycleStatus: 'lifecycleStatus',
  ownerUserId: 'ownerUserId',
  ownerOrganizationId: 'ownerOrganizationId',
  sourceType: 'sourceType',
  sourceImportId: 'sourceImportId',
  visibilityScope: 'visibilityScope',
  accessPolicyId: 'accessPolicyId',
  version: 'version',
  qualityStatus: 'qualityStatus',
  usageCountSnapshot: 'usageCountSnapshot',
  exposureCountSnapshot: 'exposureCountSnapshot',
  currentPublishedVersionId: 'currentPublishedVersionId',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedBy: 'updatedBy',
  updatedAt: 'updatedAt',
  archivedAt: 'archivedAt',
  deletedAt: 'deletedAt',
  deletedBy: 'deletedBy',
  deleteReason: 'deleteReason'
};

exports.Prisma.QuestionTypeScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  schemaVersion: 'schemaVersion',
  answerSchema: 'answerSchema',
  renderSchema: 'renderSchema',
  gradingSchema: 'gradingSchema',
  supportsAutoGrading: 'supportsAutoGrading',
  supportsManualGrading: 'supportsManualGrading',
  supportsPartialCredit: 'supportsPartialCredit',
  defaultLanguageCode: 'defaultLanguageCode',
  isGrid: 'isGrid',
  icon: 'icon',
  isActive: 'isActive'
};

exports.Prisma.QuestionVersionScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  versionNumber: 'versionNumber',
  versionStatus: 'versionStatus',
  typeId: 'typeId',
  title: 'title',
  body: 'body',
  defaultTimeSeconds: 'defaultTimeSeconds',
  defaultMaxScore: 'defaultMaxScore',
  defaultMinScore: 'defaultMinScore',
  languageCode: 'languageCode',
  tags: 'tags',
  feedbackCorrectly: 'feedbackCorrectly',
  feedbackIncorrectly: 'feedbackIncorrectly',
  explanation: 'explanation',
  payload: 'payload',
  answerConfig: 'answerConfig',
  presentationConfig: 'presentationConfig',
  rubric: 'rubric',
  scoringConfig: 'scoringConfig',
  negativeMarkingConfig: 'negativeMarkingConfig',
  partialCreditPolicy: 'partialCreditPolicy',
  securityClassification: 'securityClassification',
  exposurePolicy: 'exposurePolicy',
  confidentialUntil: 'confidentialUntil',
  checksum: 'checksum',
  contentHash: 'contentHash',
  answerKeyHash: 'answerKeyHash',
  changeSummary: 'changeSummary',
  reviewComment: 'reviewComment',
  changeRequestReason: 'changeRequestReason',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedBy: 'updatedBy',
  updatedAt: 'updatedAt',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  publishedBy: 'publishedBy',
  publishedAt: 'publishedAt',
  retiredAt: 'retiredAt'
};

exports.Prisma.QuestionOptionVersionScalarFieldEnum = {
  id: 'id',
  questionVersionId: 'questionVersionId',
  optionKey: 'optionKey',
  value: 'value',
  contentJson: 'contentJson',
  contentHtml: 'contentHtml',
  mediaRefs: 'mediaRefs',
  orderIndex: 'orderIndex',
  isCorrect: 'isCorrect',
  score: 'score',
  negativeScore: 'negativeScore',
  feedback: 'feedback',
  matchRules: 'matchRules',
  metadata: 'metadata'
};

exports.Prisma.QuestionMediaScalarFieldEnum = {
  id: 'id',
  questionVersionId: 'questionVersionId',
  mediaType: 'mediaType',
  fileId: 'fileId',
  storageKey: 'storageKey',
  cdnUrl: 'cdnUrl',
  mimeType: 'mimeType',
  checksum: 'checksum',
  sizeBytes: 'sizeBytes',
  durationMs: 'durationMs',
  width: 'width',
  height: 'height',
  transcodingStatus: 'transcodingStatus',
  accessPolicy: 'accessPolicy',
  signedUrlPolicy: 'signedUrlPolicy',
  languageCode: 'languageCode',
  copyrightOwner: 'copyrightOwner',
  license: 'license',
  altText: 'altText',
  caption: 'caption',
  orderIndex: 'orderIndex',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AudienceTypeScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  description: 'description',
  isActive: 'isActive'
};

exports.Prisma.AudienceLevelScalarFieldEnum = {
  id: 'id',
  audienceTypeId: 'audienceTypeId',
  parentId: 'parentId',
  code: 'code',
  externalCode: 'externalCode',
  levelKind: 'levelKind',
  name: 'name',
  orderIndex: 'orderIndex',
  isActive: 'isActive',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo'
};

exports.Prisma.DifficultyScaleScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  isActive: 'isActive'
};

exports.Prisma.DifficultyLevelScalarFieldEnum = {
  id: 'id',
  difficultyScaleId: 'difficultyScaleId',
  code: 'code',
  name: 'name',
  rank: 'rank',
  numericValue: 'numericValue',
  minAbility: 'minAbility',
  maxAbility: 'maxAbility',
  color: 'color',
  reportOrder: 'reportOrder',
  description: 'description',
  icon: 'icon',
  isActive: 'isActive'
};

exports.Prisma.CognitiveFrameworkScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  frameworkVersion: 'frameworkVersion',
  description: 'description',
  isActive: 'isActive'
};

exports.Prisma.CognitiveLevelScalarFieldEnum = {
  id: 'id',
  cognitiveFrameworkId: 'cognitiveFrameworkId',
  parentId: 'parentId',
  code: 'code',
  name: 'name',
  rank: 'rank',
  description: 'description',
  icon: 'icon',
  reportBucket: 'reportBucket',
  isActive: 'isActive'
};

exports.Prisma.CompetenceFrameworkScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  jurisdiction: 'jurisdiction',
  ownerOrganizationId: 'ownerOrganizationId',
  proficiencyScaleId: 'proficiencyScaleId',
  externalStandardRef: 'externalStandardRef',
  code: 'code',
  name: 'name',
  version: 'version',
  description: 'description',
  validFrom: 'validFrom',
  validTo: 'validTo',
  isActive: 'isActive'
};

exports.Prisma.CompetenceTypeScalarFieldEnum = {
  id: 'id',
  competenceFrameworkId: 'competenceFrameworkId',
  parentId: 'parentId',
  code: 'code',
  name: 'name',
  description: 'description',
  orderIndex: 'orderIndex',
  icon: 'icon',
  isActive: 'isActive'
};

exports.Prisma.AssessmentContextScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  code: 'code',
  name: 'name',
  assessmentType: 'assessmentType',
  jurisdictionLevel: 'jurisdictionLevel',
  regionId: 'regionId',
  educationLevel: 'educationLevel',
  gradeLevel: 'gradeLevel',
  subjectCode: 'subjectCode',
  ownerOrganizationId: 'ownerOrganizationId',
  languagePolicy: 'languagePolicy',
  reportingDimensionSetId: 'reportingDimensionSetId',
  audienceTypeId: 'audienceTypeId',
  audienceLevelId: 'audienceLevelId',
  curriculumId: 'curriculumId',
  subjectId: 'subjectId',
  occupationId: 'occupationId',
  organizationTypeId: 'organizationTypeId',
  difficultyScaleId: 'difficultyScaleId',
  cognitiveFrameworkId: 'cognitiveFrameworkId',
  competenceFrameworkId: 'competenceFrameworkId',
  validFrom: 'validFrom',
  validTo: 'validTo',
  isActive: 'isActive'
};

exports.Prisma.TopicScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  assessmentContextId: 'assessmentContextId',
  parentId: 'parentId',
  code: 'code',
  title: 'title',
  description: 'description',
  path: 'path',
  depth: 'depth',
  orderIndex: 'orderIndex',
  externalCode: 'externalCode',
  validFrom: 'validFrom',
  validTo: 'validTo',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TopicQuestionClassificationScalarFieldEnum = {
  id: 'id',
  topicId: 'topicId',
  questionId: 'questionId',
  assessmentContextId: 'assessmentContextId',
  difficultyLevelId: 'difficultyLevelId',
  cognitiveLevelId: 'cognitiveLevelId',
  validatedQuestionVersionId: 'validatedQuestionVersionId',
  classificationStatus: 'classificationStatus',
  validityStatusReason: 'validityStatusReason',
  isPrimary: 'isPrimary',
  weight: 'weight',
  confidence: 'confidence',
  classifierType: 'classifierType',
  evidence: 'evidence',
  reviewComment: 'reviewComment',
  version: 'version',
  validFrom: 'validFrom',
  validTo: 'validTo',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TopicQuestionCompetenceScalarFieldEnum = {
  id: 'id',
  classificationId: 'classificationId',
  competenceId: 'competenceId',
  weight: 'weight',
  contributionRule: 'contributionRule',
  minEvidenceRequired: 'minEvidenceRequired',
  reportingWeight: 'reportingWeight',
  isPrimary: 'isPrimary',
  createdBy: 'createdBy',
  reviewedBy: 'reviewedBy',
  createdAt: 'createdAt'
};

exports.Prisma.QuizTemplateScalarFieldEnum = {
  id: 'id',
  assessmentContextId: 'assessmentContextId',
  code: 'code',
  name: 'name',
  description: 'description',
  defaultDurationMinutes: 'defaultDurationMinutes',
  defaultPassingScore: 'defaultPassingScore',
  defaultMaxAttempts: 'defaultMaxAttempts',
  defaultShuffleQuestions: 'defaultShuffleQuestions',
  defaultShuffleOptions: 'defaultShuffleOptions',
  lifecycleStatus: 'lifecycleStatus',
  approvalWorkflowId: 'approvalWorkflowId',
  reviewComment: 'reviewComment',
  publishedBy: 'publishedBy',
  publishedAt: 'publishedAt',
  totalQuestionCount: 'totalQuestionCount',
  totalMaxScore: 'totalMaxScore',
  blueprintType: 'blueprintType',
  assessmentType: 'assessmentType',
  version: 'version',
  negativeMarkingPolicy: 'negativeMarkingPolicy',
  sectionShufflePolicy: 'sectionShufflePolicy',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuizSectionScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  title: 'title',
  description: 'description',
  sectionMode: 'sectionMode',
  orderIndex: 'orderIndex',
  questionCount: 'questionCount',
  durationSeconds: 'durationSeconds',
  poolMinSize: 'poolMinSize',
  poolMaxSize: 'poolMaxSize',
  mandatoryCount: 'mandatoryCount',
  excludedCount: 'excludedCount',
  maxScorePerQuestion: 'maxScorePerQuestion',
  minScorePerQuestion: 'minScorePerQuestion',
  topicId: 'topicId',
  difficultyLevelId: 'difficultyLevelId',
  difficultyWeights: 'difficultyWeights',
  competenceWeights: 'competenceWeights',
  cognitiveWeights: 'cognitiveWeights',
  topicWeights: 'topicWeights',
  adaptiveConfig: 'adaptiveConfig',
  leastUsedWindowDays: 'leastUsedWindowDays',
  selectionStrategy: 'selectionStrategy',
  timeLimitPerQuestionSec: 'timeLimitPerQuestionSec',
  allowBackNavigation: 'allowBackNavigation',
  requireSequential: 'requireSequential',
  allowSeenQuestions: 'allowSeenQuestions',
  shuffleOptions: 'shuffleOptions',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SectionQuestionScalarFieldEnum = {
  id: 'id',
  sectionId: 'sectionId',
  questionId: 'questionId',
  pinnedQuestionVersionId: 'pinnedQuestionVersionId',
  versionSelectionMode: 'versionSelectionMode',
  orderIndex: 'orderIndex',
  maxScoreOverride: 'maxScoreOverride',
  minScoreOverride: 'minScoreOverride',
  selectionRole: 'selectionRole',
  weight: 'weight',
  negativeScoreOverride: 'negativeScoreOverride',
  timeLimitOverride: 'timeLimitOverride',
  isRequired: 'isRequired',
  reason: 'reason',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.QuizScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  ownerOrganizationId: 'ownerOrganizationId',
  templateId: 'templateId',
  code: 'code',
  title: 'title',
  assessmentType: 'assessmentType',
  languageCode: 'languageCode',
  visibilityStatus: 'visibilityStatus',
  catalogStatus: 'catalogStatus',
  lifecycleStatus: 'lifecycleStatus',
  currentPublishedRevisionId: 'currentPublishedRevisionId',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedBy: 'updatedBy',
  version: 'version',
  updatedAt: 'updatedAt',
  archivedAt: 'archivedAt'
};

exports.Prisma.QuizRevisionScalarFieldEnum = {
  id: 'id',
  quizId: 'quizId',
  revisionNumber: 'revisionNumber',
  revisionStatus: 'revisionStatus',
  assessmentContextId: 'assessmentContextId',
  title: 'title',
  description: 'description',
  durationMinutes: 'durationMinutes',
  passingScore: 'passingScore',
  maxAttempts: 'maxAttempts',
  languageCode: 'languageCode',
  totalQuestionCount: 'totalQuestionCount',
  totalMaxScore: 'totalMaxScore',
  questionManifestHash: 'questionManifestHash',
  shuffleQuestions: 'shuffleQuestions',
  shuffleSections: 'shuffleSections',
  shuffleOptions: 'shuffleOptions',
  resumeAllowed: 'resumeAllowed',
  proctoringPolicy: 'proctoringPolicy',
  resultVisibilityPolicy: 'resultVisibilityPolicy',
  runtimePolicy: 'runtimePolicy',
  leaderboardPolicy: 'leaderboardPolicy',
  solutionVisibilityPolicy: 'solutionVisibilityPolicy',
  negativeMarkingPolicy: 'negativeMarkingPolicy',
  roundingPolicy: 'roundingPolicy',
  appealPolicy: 'appealPolicy',
  certificatePolicy: 'certificatePolicy',
  lockdownBrowserPolicy: 'lockdownBrowserPolicy',
  devicePolicy: 'devicePolicy',
  paymentRequired: 'paymentRequired',
  defaultPrice: 'defaultPrice',
  currencyCode: 'currencyCode',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  reviewedBy: 'reviewedBy',
  reviewedAt: 'reviewedAt',
  approvalComment: 'approvalComment',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  publishedBy: 'publishedBy',
  publishedAt: 'publishedAt',
  retiredAt: 'retiredAt'
};

exports.Prisma.QuizRevisionSectionScalarFieldEnum = {
  id: 'id',
  quizRevisionId: 'quizRevisionId',
  sourceSectionId: 'sourceSectionId',
  title: 'title',
  description: 'description',
  sectionMode: 'sectionMode',
  orderIndex: 'orderIndex',
  questionCount: 'questionCount',
  durationSeconds: 'durationSeconds',
  maxScorePerQuestion: 'maxScorePerQuestion',
  minScorePerQuestion: 'minScorePerQuestion',
  selectionStrategy: 'selectionStrategy',
  selectionRuleSnapshot: 'selectionRuleSnapshot',
  timeLimitPerQuestionSec: 'timeLimitPerQuestionSec',
  shuffleQuestions: 'shuffleQuestions',
  shuffleOptions: 'shuffleOptions',
  navigationPolicy: 'navigationPolicy',
  displayInstruction: 'displayInstruction'
};

exports.Prisma.QuizRevisionQuestionScalarFieldEnum = {
  id: 'id',
  revisionSectionId: 'revisionSectionId',
  questionId: 'questionId',
  questionVersionId: 'questionVersionId',
  classificationId: 'classificationId',
  orderIndex: 'orderIndex',
  maxScore: 'maxScore',
  minScore: 'minScore',
  questionTypeCodeSnapshot: 'questionTypeCodeSnapshot',
  contentHash: 'contentHash',
  answerKeyHash: 'answerKeyHash',
  rubricSnapshot: 'rubricSnapshot',
  topicSnapshot: 'topicSnapshot',
  cognitiveSnapshot: 'cognitiveSnapshot',
  difficultySnapshot: 'difficultySnapshot',
  competenceSnapshot: 'competenceSnapshot'
};

exports.Prisma.QuizScheduleScalarFieldEnum = {
  id: 'id',
  quizRevisionId: 'quizRevisionId',
  code: 'code',
  name: 'name',
  scheduleType: 'scheduleType',
  status: 'status',
  registrationStartAt: 'registrationStartAt',
  registrationEndAt: 'registrationEndAt',
  availableFrom: 'availableFrom',
  availableUntil: 'availableUntil',
  durationMinutesOverride: 'durationMinutesOverride',
  languageCode: 'languageCode',
  waitingRoomOpensAt: 'waitingRoomOpensAt',
  requiredEarlyJoinMinutes: 'requiredEarlyJoinMinutes',
  lateJoinPolicy: 'lateJoinPolicy',
  lateJoinGraceSeconds: 'lateJoinGraceSeconds',
  denyAfterSeconds: 'denyAfterSeconds',
  resumePolicy: 'resumePolicy',
  maxResumeCount: 'maxResumeCount',
  resumeGraceSeconds: 'resumeGraceSeconds',
  pausePolicy: 'pausePolicy',
  pauseAllowed: 'pauseAllowed',
  pauseMaxSeconds: 'pauseMaxSeconds',
  pauseReasonRequired: 'pauseReasonRequired',
  admissionPolicy: 'admissionPolicy',
  capacityStrategy: 'capacityStrategy',
  waitingQueueEnabled: 'waitingQueueEnabled',
  admissionBatchSize: 'admissionBatchSize',
  heartbeatIntervalSeconds: 'heartbeatIntervalSeconds',
  autosaveIntervalSeconds: 'autosaveIntervalSeconds',
  serverUnlockMode: 'serverUnlockMode',
  unlockEventLeadSeconds: 'unlockEventLeadSeconds',
  payloadPreloadRequired: 'payloadPreloadRequired',
  proctoringProfileId: 'proctoringProfileId',
  lockPolicyId: 'lockPolicyId',
  resultReleaseAt: 'resultReleaseAt',
  leaderboardEnabled: 'leaderboardEnabled',
  certificateEnabled: 'certificateEnabled',
  publishedRevisionHash: 'publishedRevisionHash',
  scheduleVersion: 'scheduleVersion',
  maxAttemptsOverride: 'maxAttemptsOverride',
  shuffleQuestionsOverride: 'shuffleQuestionsOverride',
  shuffleOptionsOverride: 'shuffleOptionsOverride',
  resumeAllowedOverride: 'resumeAllowedOverride',
  endTimePolicy: 'endTimePolicy',
  accessMode: 'accessMode',
  accessCodeHash: 'accessCodeHash',
  capacity: 'capacity',
  priceOverride: 'priceOverride',
  currencyCodeOverride: 'currencyCodeOverride',
  operationalPolicyOverride: 'operationalPolicyOverride',
  timezone: 'timezone',
  organizationId: 'organizationId',
  venueId: 'venueId',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  publishedBy: 'publishedBy',
  publishedAt: 'publishedAt',
  cancelledBy: 'cancelledBy',
  cancelledAt: 'cancelledAt',
  cancellationReason: 'cancellationReason'
};

exports.Prisma.QuizAudienceRuleScalarFieldEnum = {
  id: 'id',
  scheduleId: 'scheduleId',
  assessmentContextId: 'assessmentContextId',
  audienceTypeId: 'audienceTypeId',
  audienceLevelId: 'audienceLevelId',
  organizationId: 'organizationId',
  organizationUnitId: 'organizationUnitId',
  regionId: 'regionId',
  groupId: 'groupId',
  exclude: 'exclude',
  priority: 'priority',
  effectiveFrom: 'effectiveFrom',
  effectiveTo: 'effectiveTo',
  ruleSnapshotHash: 'ruleSnapshotHash',
  eligibilityEvaluationMode: 'eligibilityEvaluationMode',
  additionalCriteria: 'additionalCriteria',
  includeFutureMembers: 'includeFutureMembers',
  createdBy: 'createdBy',
  updatedBy: 'updatedBy',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt'
};

exports.Prisma.QuizUserAssignmentScalarFieldEnum = {
  id: 'id',
  scheduleId: 'scheduleId',
  userId: 'userId',
  sourceRuleId: 'sourceRuleId',
  status: 'status',
  attemptsUsed: 'attemptsUsed',
  lastAttemptId: 'lastAttemptId',
  eligibilitySnapshotId: 'eligibilitySnapshotId',
  assignedBy: 'assignedBy',
  assignedAt: 'assignedAt',
  registeredAt: 'registeredAt',
  revokedBy: 'revokedBy',
  revokedAt: 'revokedAt',
  revokeReason: 'revokeReason',
  paymentStatus: 'paymentStatus',
  paymentOrderId: 'paymentOrderId',
  accessTokenHash: 'accessTokenHash',
  inviteSentAt: 'inviteSentAt',
  acceptedTermsAt: 'acceptedTermsAt',
  organizationId: 'organizationId',
  groupId: 'groupId',
  regionId: 'regionId',
  availableFromOverride: 'availableFromOverride',
  availableUntilOverride: 'availableUntilOverride',
  maxAttemptsOverride: 'maxAttemptsOverride',
  paymentRequiredOverride: 'paymentRequiredOverride',
  priceOverride: 'priceOverride',
  currencyCodeOverride: 'currencyCodeOverride'
};

exports.Prisma.QuizSchedulePaymentPolicyScalarFieldEnum = {
  id: 'id',
  scheduleId: 'scheduleId',
  paymentRequired: 'paymentRequired',
  paymentMode: 'paymentMode',
  defaultAmount: 'defaultAmount',
  currencyCode: 'currencyCode',
  taxPolicy: 'taxPolicy',
  invoiceRequired: 'invoiceRequired',
  paymentProvider: 'paymentProvider',
  settlementAccountId: 'settlementAccountId',
  couponPolicy: 'couponPolicy',
  sponsorOrganizationId: 'sponsorOrganizationId',
  refundAllowed: 'refundAllowed',
  refundPolicy: 'refundPolicy',
  eligibilityRules: 'eligibilityRules',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GradingJobScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  submissionId: 'submissionId',
  gradingVersion: 'gradingVersion',
  trigger: 'trigger',
  status: 'status',
  algorithmVersion: 'algorithmVersion',
  gradingPolicySnapshot: 'gradingPolicySnapshot',
  answerKeySnapshotHash: 'answerKeySnapshotHash',
  inputChecksum: 'inputChecksum',
  outputChecksum: 'outputChecksum',
  queueName: 'queueName',
  workerId: 'workerId',
  lockedAt: 'lockedAt',
  lockExpiresAt: 'lockExpiresAt',
  retryCount: 'retryCount',
  maxRetries: 'maxRetries',
  nextRetryAt: 'nextRetryAt',
  idempotencyKey: 'idempotencyKey',
  priority: 'priority',
  partitionKey: 'partitionKey',
  traceId: 'traceId',
  correlationId: 'correlationId',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  failedAt: 'failedAt',
  failureCode: 'failureCode',
  failureMessage: 'failureMessage',
  requestedBy: 'requestedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AttemptQuestionScoreScalarFieldEnum = {
  id: 'id',
  gradingJobId: 'gradingJobId',
  attemptId: 'attemptId',
  attemptQuestionId: 'attemptQuestionId',
  questionId: 'questionId',
  questionVersionId: 'questionVersionId',
  revisionSectionId: 'revisionSectionId',
  classificationId: 'classificationId',
  status: 'status',
  evaluation: 'evaluation',
  gradingMethod: 'gradingMethod',
  rawScore: 'rawScore',
  negativeScore: 'negativeScore',
  finalScore: 'finalScore',
  minScore: 'minScore',
  maxScore: 'maxScore',
  scoreBeforeOverride: 'scoreBeforeOverride',
  scoreOverrideReason: 'scoreOverrideReason',
  penaltyReason: 'penaltyReason',
  scoreOverriddenBy: 'scoreOverriddenBy',
  scoreOverriddenAt: 'scoreOverriddenAt',
  answerSnapshot: 'answerSnapshot',
  answerKeySnapshot: 'answerKeySnapshot',
  gradingDetail: 'gradingDetail',
  feedback: 'feedback',
  timeSpentMs: 'timeSpentMs',
  answeredAt: 'answeredAt',
  graderConfidence: 'graderConfidence',
  moderationRequired: 'moderationRequired',
  rubricLevelId: 'rubricLevelId',
  scoreBand: 'scoreBand',
  autoGradedAt: 'autoGradedAt',
  manuallyGradedAt: 'manuallyGradedAt',
  finalizedAt: 'finalizedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ManualGradingTaskScalarFieldEnum = {
  id: 'id',
  gradingJobId: 'gradingJobId',
  attemptId: 'attemptId',
  attemptQuestionId: 'attemptQuestionId',
  questionScoreId: 'questionScoreId',
  status: 'status',
  gradingMode: 'gradingMode',
  rubricSnapshot: 'rubricSnapshot',
  responseSnapshot: 'responseSnapshot',
  requiredGraderCount: 'requiredGraderCount',
  anonymizedCandidateKey: 'anonymizedCandidateKey',
  slaBreachedAt: 'slaBreachedAt',
  escalatedAt: 'escalatedAt',
  escalatedTo: 'escalatedTo',
  appealId: 'appealId',
  regradeReason: 'regradeReason',
  completedGraderCount: 'completedGraderCount',
  dueAt: 'dueAt',
  priority: 'priority',
  assignedAt: 'assignedAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  cancelledAt: 'cancelledAt',
  cancellationReason: 'cancellationReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.GraderAssignmentScalarFieldEnum = {
  id: 'id',
  manualTaskId: 'manualTaskId',
  graderUserId: 'graderUserId',
  role: 'role',
  status: 'status',
  assignedBy: 'assignedBy',
  assignedAt: 'assignedAt',
  acceptedAt: 'acceptedAt',
  declinedAt: 'declinedAt',
  declineReason: 'declineReason',
  startedAt: 'startedAt',
  submittedAt: 'submittedAt',
  cancelledAt: 'cancelledAt',
  workloadMetadata: 'workloadMetadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ManualGradingDecisionScalarFieldEnum = {
  id: 'id',
  manualTaskId: 'manualTaskId',
  graderAssignmentId: 'graderAssignmentId',
  questionScoreId: 'questionScoreId',
  decisionVersion: 'decisionVersion',
  status: 'status',
  awardedScore: 'awardedScore',
  rubricScores: 'rubricScores',
  feedbackToCandidate: 'feedbackToCandidate',
  internalComment: 'internalComment',
  confidence: 'confidence',
  submittedAt: 'submittedAt',
  acceptedAt: 'acceptedAt',
  rejectedAt: 'rejectedAt',
  rejectionReason: 'rejectionReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ManualGradingResolutionScalarFieldEnum = {
  id: 'id',
  manualTaskId: 'manualTaskId',
  resolutionType: 'resolutionType',
  resolvedScore: 'resolvedScore',
  reason: 'reason',
  resolvedBy: 'resolvedBy',
  resolvedAt: 'resolvedAt',
  metadata: 'metadata'
};

exports.Prisma.QuestionCompetenceScoreContributionScalarFieldEnum = {
  id: 'id',
  questionScoreId: 'questionScoreId',
  competenceId: 'competenceId',
  classificationId: 'classificationId',
  topicId: 'topicId',
  cognitiveLevelId: 'cognitiveLevelId',
  difficultyLevelId: 'difficultyLevelId',
  weight: 'weight',
  evidenceStrength: 'evidenceStrength',
  confidence: 'confidence',
  earnedContribution: 'earnedContribution',
  maxContribution: 'maxContribution',
  calculationDetail: 'calculationDetail',
  createdAt: 'createdAt'
};

exports.Prisma.AssessmentResultScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  gradingJobId: 'gradingJobId',
  resultVersion: 'resultVersion',
  candidateId: 'candidateId',
  scheduleId: 'scheduleId',
  quizId: 'quizId',
  quizRevisionId: 'quizRevisionId',
  organizationId: 'organizationId',
  schoolId: 'schoolId',
  classId: 'classId',
  regionId: 'regionId',
  districtId: 'districtId',
  cohortId: 'cohortId',
  status: 'status',
  passStatus: 'passStatus',
  rawScore: 'rawScore',
  adjustedScore: 'adjustedScore',
  finalScore: 'finalScore',
  maxPossibleScore: 'maxPossibleScore',
  percentage: 'percentage',
  passingScore: 'passingScore',
  correctCount: 'correctCount',
  partiallyCorrectCount: 'partiallyCorrectCount',
  incorrectCount: 'incorrectCount',
  unansweredCount: 'unansweredCount',
  invalidQuestionCount: 'invalidQuestionCount',
  gradeCode: 'gradeCode',
  gradeLabel: 'gradeLabel',
  percentileRank: 'percentileRank',
  standardScore: 'standardScore',
  rank: 'rank',
  cohortPercentile: 'cohortPercentile',
  negativeMarks: 'negativeMarks',
  durationSeconds: 'durationSeconds',
  startedAt: 'startedAt',
  submittedAt: 'submittedAt',
  aiAnalysis: 'aiAnalysis',
  recommendation: 'recommendation',
  weaknessSummary: 'weaknessSummary',
  calculationPolicy: 'calculationPolicy',
  calculationBreakdown: 'calculationBreakdown',
  finalizedBy: 'finalizedBy',
  finalizedAt: 'finalizedAt',
  invalidatedBy: 'invalidatedBy',
  invalidatedAt: 'invalidatedAt',
  invalidationReason: 'invalidationReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SectionResultScalarFieldEnum = {
  id: 'id',
  assessmentResultId: 'assessmentResultId',
  revisionSectionId: 'revisionSectionId',
  sectionTitle: 'sectionTitle',
  orderIndex: 'orderIndex',
  earnedScore: 'earnedScore',
  maxPossibleScore: 'maxPossibleScore',
  percentage: 'percentage',
  correctCount: 'correctCount',
  partiallyCorrectCount: 'partiallyCorrectCount',
  incorrectCount: 'incorrectCount',
  unansweredCount: 'unansweredCount',
  calculationDetail: 'calculationDetail'
};

exports.Prisma.TopicResultScalarFieldEnum = {
  id: 'id',
  assessmentResultId: 'assessmentResultId',
  topicId: 'topicId',
  topicCode: 'topicCode',
  topicTitle: 'topicTitle',
  earnedScore: 'earnedScore',
  maxPossibleScore: 'maxPossibleScore',
  percentage: 'percentage',
  evidenceQuestionCount: 'evidenceQuestionCount',
  calculationDetail: 'calculationDetail'
};

exports.Prisma.CompetenceResultScalarFieldEnum = {
  id: 'id',
  assessmentResultId: 'assessmentResultId',
  competenceId: 'competenceId',
  competenceCode: 'competenceCode',
  competenceName: 'competenceName',
  earnedScore: 'earnedScore',
  maxPossibleScore: 'maxPossibleScore',
  percentage: 'percentage',
  evidenceQuestionCount: 'evidenceQuestionCount',
  achievementStatus: 'achievementStatus',
  proficiencyLevelCode: 'proficiencyLevelCode',
  confidence: 'confidence',
  calculationDetail: 'calculationDetail',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ResultPublicationScalarFieldEnum = {
  id: 'id',
  assessmentResultId: 'assessmentResultId',
  publicationVersion: 'publicationVersion',
  audience: 'audience',
  status: 'status',
  channel: 'channel',
  downloadAllowed: 'downloadAllowed',
  certificateIncluded: 'certificateIncluded',
  watermarkPolicy: 'watermarkPolicy',
  exportJobId: 'exportJobId',
  visibilityPolicy: 'visibilityPolicy',
  availableFrom: 'availableFrom',
  availableUntil: 'availableUntil',
  publishedBy: 'publishedBy',
  publishedAt: 'publishedAt',
  withheldBy: 'withheldBy',
  withheldAt: 'withheldAt',
  withheldReason: 'withheldReason',
  revokedBy: 'revokedBy',
  revokedAt: 'revokedAt',
  revocationReason: 'revocationReason',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ResultPublicationEventScalarFieldEnum = {
  id: 'id',
  publicationId: 'publicationId',
  eventType: 'eventType',
  actorUserId: 'actorUserId',
  reason: 'reason',
  previousState: 'previousState',
  newState: 'newState',
  occurredAt: 'occurredAt'
};

exports.Prisma.ResultAccessLogScalarFieldEnum = {
  id: 'id',
  publicationId: 'publicationId',
  actorUserId: 'actorUserId',
  channel: 'channel',
  ipHash: 'ipHash',
  userAgentHash: 'userAgentHash',
  viewedAt: 'viewedAt',
  metadata: 'metadata'
};

exports.Prisma.ResultAiAnalysisScalarFieldEnum = {
  id: 'id',
  assessmentResultId: 'assessmentResultId',
  modelName: 'modelName',
  modelVersion: 'modelVersion',
  promptVersion: 'promptVersion',
  summary: 'summary',
  strengths: 'strengths',
  weaknesses: 'weaknesses',
  recommendations: 'recommendations',
  confidence: 'confidence',
  createdAt: 'createdAt'
};

exports.Prisma.QuestionWorkflowEventScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  questionVersionId: 'questionVersionId',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  action: 'action',
  comment: 'comment',
  actorUserId: 'actorUserId',
  actorRole: 'actorRole',
  occurredAt: 'occurredAt',
  metadata: 'metadata'
};

exports.Prisma.ReportingAttemptFactScalarFieldEnum = {
  id: 'id',
  attemptId: 'attemptId',
  resultId: 'resultId',
  tenantId: 'tenantId',
  scheduleId: 'scheduleId',
  quizId: 'quizId',
  quizRevisionId: 'quizRevisionId',
  candidateId: 'candidateId',
  organizationId: 'organizationId',
  regionId: 'regionId',
  districtId: 'districtId',
  schoolId: 'schoolId',
  classId: 'classId',
  teacherId: 'teacherId',
  assessmentContextId: 'assessmentContextId',
  startedAt: 'startedAt',
  submittedAt: 'submittedAt',
  durationSeconds: 'durationSeconds',
  finalScore: 'finalScore',
  maxPossibleScore: 'maxPossibleScore',
  percentage: 'percentage',
  passStatus: 'passStatus',
  status: 'status',
  createdAt: 'createdAt'
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

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.QuestionLifecycleStatus = exports.$Enums.QuestionLifecycleStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED'
};

exports.QuestionVersionStatus = exports.$Enums.QuestionVersionStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  RETIRED: 'RETIRED',
  REJECTED: 'REJECTED'
};

exports.ClassificationStatus = exports.$Enums.ClassificationStatus = {
  VALID: 'VALID',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  INVALID: 'INVALID',
  ARCHIVED: 'ARCHIVED'
};

exports.QuizLifecycleStatus = exports.$Enums.QuizLifecycleStatus = {
  DRAFT: 'DRAFT',
  READY: 'READY',
  IN_REVIEW: 'IN_REVIEW',
  PUBLISHED: 'PUBLISHED',
  SUSPENDED: 'SUSPENDED',
  ARCHIVED: 'ARCHIVED'
};

exports.SectionMode = exports.$Enums.SectionMode = {
  FIXED: 'FIXED',
  RULE_BASED: 'RULE_BASED',
  ADAPTIVE: 'ADAPTIVE'
};

exports.SectionSelectionStrategy = exports.$Enums.SectionSelectionStrategy = {
  RANDOM: 'RANDOM',
  UNSEEN_FIRST: 'UNSEEN_FIRST',
  MOST_FAILED: 'MOST_FAILED',
  ADAPTIVE: 'ADAPTIVE',
  EASIEST_FIRST: 'EASIEST_FIRST',
  HARDEST_FIRST: 'HARDEST_FIRST',
  BALANCED: 'BALANCED',
  WEAKEST_TOPIC: 'WEAKEST_TOPIC'
};

exports.VersionSelectionMode = exports.$Enums.VersionSelectionMode = {
  LATEST_PUBLISHED: 'LATEST_PUBLISHED',
  PINNED_VERSION: 'PINNED_VERSION'
};

exports.QuizRevisionStatus = exports.$Enums.QuizRevisionStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  RETIRED: 'RETIRED',
  REJECTED: 'REJECTED'
};

exports.ScheduleType = exports.$Enums.ScheduleType = {
  REGULAR: 'REGULAR',
  MAKEUP: 'MAKEUP',
  PRACTICE: 'PRACTICE',
  PILOT: 'PILOT',
  SPECIAL: 'SPECIAL'
};

exports.ScheduleStatus = exports.$Enums.ScheduleStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED'
};

exports.EndTimePolicy = exports.$Enums.EndTimePolicy = {
  FIXED_WINDOW_END: 'FIXED_WINDOW_END',
  DURATION_FROM_START: 'DURATION_FROM_START',
  EARLIEST_OF_BOTH: 'EARLIEST_OF_BOTH'
};

exports.AccessMode = exports.$Enums.AccessMode = {
  ASSIGNED_ONLY: 'ASSIGNED_ONLY',
  PUBLIC_REGISTRATION: 'PUBLIC_REGISTRATION',
  INVITATION_ONLY: 'INVITATION_ONLY',
  ORGANIZATION_ONLY: 'ORGANIZATION_ONLY',
  OPEN_WITH_CODE: 'OPEN_WITH_CODE'
};

exports.AssignmentStatus = exports.$Enums.AssignmentStatus = {
  ASSIGNED: 'ASSIGNED',
  ELIGIBLE: 'ELIGIBLE',
  REGISTERED: 'REGISTERED',
  REVOKED: 'REVOKED',
  COMPLETED: 'COMPLETED'
};

exports.PaymentMode = exports.$Enums.PaymentMode = {
  FREE: 'FREE',
  USER_PAYS: 'USER_PAYS',
  ORGANIZATION_PAYS: 'ORGANIZATION_PAYS',
  SPONSOR_PAYS: 'SPONSOR_PAYS',
  MIXED: 'MIXED'
};

exports.GradingTrigger = exports.$Enums.GradingTrigger = {
  SUBMISSION: 'SUBMISSION',
  AUTO_EXPIRE: 'AUTO_EXPIRE',
  MANUAL_REQUEST: 'MANUAL_REQUEST',
  ANSWER_KEY_CHANGED: 'ANSWER_KEY_CHANGED',
  APPEAL: 'APPEAL',
  SYSTEM_RECOVERY: 'SYSTEM_RECOVERY',
  ADMIN_REGRADE: 'ADMIN_REGRADE'
};

exports.GradingJobStatus = exports.$Enums.GradingJobStatus = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  WAITING_FOR_MANUAL_GRADING: 'WAITING_FOR_MANUAL_GRADING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  SUPERSEDED: 'SUPERSEDED'
};

exports.QuestionScoreStatus = exports.$Enums.QuestionScoreStatus = {
  PENDING: 'PENDING',
  AUTO_GRADED: 'AUTO_GRADED',
  MANUAL_GRADING_REQUIRED: 'MANUAL_GRADING_REQUIRED',
  MANUALLY_GRADED: 'MANUALLY_GRADED',
  PARTIALLY_GRADED: 'PARTIALLY_GRADED',
  INVALIDATED: 'INVALIDATED',
  NOT_ANSWERED: 'NOT_ANSWERED',
  ERROR: 'ERROR'
};

exports.AnswerEvaluation = exports.$Enums.AnswerEvaluation = {
  CORRECT: 'CORRECT',
  PARTIALLY_CORRECT: 'PARTIALLY_CORRECT',
  INCORRECT: 'INCORRECT',
  UNANSWERED: 'UNANSWERED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
  UNDETERMINED: 'UNDETERMINED'
};

exports.GradingMethod = exports.$Enums.GradingMethod = {
  AUTOMATIC: 'AUTOMATIC',
  MANUAL: 'MANUAL',
  HYBRID: 'HYBRID',
  IMPORTED: 'IMPORTED',
  OVERRIDDEN: 'OVERRIDDEN'
};

exports.ManualGradingTaskStatus = exports.$Enums.ManualGradingTaskStatus = {
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  NEEDS_MODERATION: 'NEEDS_MODERATION',
  RETURNED_FOR_REVISION: 'RETURNED_FOR_REVISION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.ManualGradingMode = exports.$Enums.ManualGradingMode = {
  SINGLE_GRADER: 'SINGLE_GRADER',
  DOUBLE_BLIND: 'DOUBLE_BLIND',
  DOUBLE_REVIEW: 'DOUBLE_REVIEW',
  CONSENSUS: 'CONSENSUS',
  MODERATOR_DECIDES: 'MODERATOR_DECIDES'
};

exports.GraderRole = exports.$Enums.GraderRole = {
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  MODERATOR: 'MODERATOR',
  REVIEWER: 'REVIEWER',
  APPEAL_REVIEWER: 'APPEAL_REVIEWER'
};

exports.GraderAssignmentStatus = exports.$Enums.GraderAssignmentStatus = {
  ASSIGNED: 'ASSIGNED',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  IN_PROGRESS: 'IN_PROGRESS',
  SUBMITTED: 'SUBMITTED',
  REASSIGNED: 'REASSIGNED',
  CANCELLED: 'CANCELLED'
};

exports.GradingDecisionStatus = exports.$Enums.GradingDecisionStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  SUPERSEDED: 'SUPERSEDED'
};

exports.AssessmentResultStatus = exports.$Enums.AssessmentResultStatus = {
  PROVISIONAL: 'PROVISIONAL',
  PENDING_MANUAL_GRADING: 'PENDING_MANUAL_GRADING',
  PENDING_REVIEW: 'PENDING_REVIEW',
  FINAL: 'FINAL',
  WITHHELD: 'WITHHELD',
  INVALIDATED: 'INVALIDATED',
  SUPERSEDED: 'SUPERSEDED'
};

exports.PassStatus = exports.$Enums.PassStatus = {
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  CONDITIONAL_PASS: 'CONDITIONAL_PASS',
  NOT_DETERMINED: 'NOT_DETERMINED',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
};

exports.CompetenceAchievementStatus = exports.$Enums.CompetenceAchievementStatus = {
  NOT_ASSESSED: 'NOT_ASSESSED',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT_EVIDENCE',
  BELOW_EXPECTATION: 'BELOW_EXPECTATION',
  APPROACHING_EXPECTATION: 'APPROACHING_EXPECTATION',
  MEETS_EXPECTATION: 'MEETS_EXPECTATION',
  EXCEEDS_EXPECTATION: 'EXCEEDS_EXPECTATION'
};

exports.ResultPublicationAudience = exports.$Enums.ResultPublicationAudience = {
  CANDIDATE: 'CANDIDATE',
  GUARDIAN: 'GUARDIAN',
  ORGANIZATION: 'ORGANIZATION',
  TEACHER: 'TEACHER',
  GRADER: 'GRADER',
  ADMIN: 'ADMIN',
  PUBLIC: 'PUBLIC'
};

exports.ResultPublicationStatus = exports.$Enums.ResultPublicationStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
  PARTIALLY_PUBLISHED: 'PARTIALLY_PUBLISHED',
  WITHHELD: 'WITHHELD',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED'
};

exports.ResultPublicationEventType = exports.$Enums.ResultPublicationEventType = {
  CREATED: 'CREATED',
  SCHEDULED: 'SCHEDULED',
  PUBLISHED: 'PUBLISHED',
  WITHHELD: 'WITHHELD',
  REPUBLISHED: 'REPUBLISHED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
  POLICY_CHANGED: 'POLICY_CHANGED'
};

exports.OutboxStatus = exports.$Enums.OutboxStatus = {
  PENDING: 'PENDING',
  PUBLISHING: 'PUBLISHING',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
  DEAD_LETTERED: 'DEAD_LETTERED'
};

exports.Prisma.ModelName = {
  Question: 'Question',
  QuestionType: 'QuestionType',
  QuestionVersion: 'QuestionVersion',
  QuestionOptionVersion: 'QuestionOptionVersion',
  QuestionMedia: 'QuestionMedia',
  AudienceType: 'AudienceType',
  AudienceLevel: 'AudienceLevel',
  DifficultyScale: 'DifficultyScale',
  DifficultyLevel: 'DifficultyLevel',
  CognitiveFramework: 'CognitiveFramework',
  CognitiveLevel: 'CognitiveLevel',
  CompetenceFramework: 'CompetenceFramework',
  CompetenceType: 'CompetenceType',
  AssessmentContext: 'AssessmentContext',
  Topic: 'Topic',
  TopicQuestionClassification: 'TopicQuestionClassification',
  TopicQuestionCompetence: 'TopicQuestionCompetence',
  QuizTemplate: 'QuizTemplate',
  QuizSection: 'QuizSection',
  SectionQuestion: 'SectionQuestion',
  Quiz: 'Quiz',
  QuizRevision: 'QuizRevision',
  QuizRevisionSection: 'QuizRevisionSection',
  QuizRevisionQuestion: 'QuizRevisionQuestion',
  QuizSchedule: 'QuizSchedule',
  QuizAudienceRule: 'QuizAudienceRule',
  QuizUserAssignment: 'QuizUserAssignment',
  QuizSchedulePaymentPolicy: 'QuizSchedulePaymentPolicy',
  GradingJob: 'GradingJob',
  AttemptQuestionScore: 'AttemptQuestionScore',
  ManualGradingTask: 'ManualGradingTask',
  GraderAssignment: 'GraderAssignment',
  ManualGradingDecision: 'ManualGradingDecision',
  ManualGradingResolution: 'ManualGradingResolution',
  QuestionCompetenceScoreContribution: 'QuestionCompetenceScoreContribution',
  AssessmentResult: 'AssessmentResult',
  SectionResult: 'SectionResult',
  TopicResult: 'TopicResult',
  CompetenceResult: 'CompetenceResult',
  ResultPublication: 'ResultPublication',
  ResultPublicationEvent: 'ResultPublicationEvent',
  ResultAccessLog: 'ResultAccessLog',
  ResultAiAnalysis: 'ResultAiAnalysis',
  QuestionWorkflowEvent: 'QuestionWorkflowEvent',
  ReportingAttemptFact: 'ReportingAttemptFact',
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
