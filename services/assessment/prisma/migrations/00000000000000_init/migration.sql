-- CreateEnum
CREATE TYPE "QuestionLifecycleStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuestionVersionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'CHANGES_REQUESTED', 'APPROVED', 'PUBLISHED', 'RETIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ClassificationStatus" AS ENUM ('VALID', 'REVIEW_REQUIRED', 'INVALID', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SectionSelectionStrategy" AS ENUM ('RANDOM', 'UNSEEN_FIRST', 'MOST_FAILED', 'ADAPTIVE', 'EASIEST_FIRST', 'HARDEST_FIRST', 'BALANCED', 'WEAKEST_TOPIC');

-- CreateEnum
CREATE TYPE "SectionMode" AS ENUM ('FIXED', 'RULE_BASED', 'ADAPTIVE');

-- CreateEnum
CREATE TYPE "VersionSelectionMode" AS ENUM ('LATEST_PUBLISHED', 'PINNED_VERSION');

-- CreateEnum
CREATE TYPE "QuizLifecycleStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "QuizRevisionStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'RETIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'OPEN', 'ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('REGULAR', 'MAKEUP', 'PRACTICE', 'PILOT', 'SPECIAL');

-- CreateEnum
CREATE TYPE "EndTimePolicy" AS ENUM ('FIXED_WINDOW_END', 'DURATION_FROM_START', 'EARLIEST_OF_BOTH');

-- CreateEnum
CREATE TYPE "AccessMode" AS ENUM ('ASSIGNED_ONLY', 'PUBLIC_REGISTRATION', 'INVITATION_ONLY', 'ORGANIZATION_ONLY', 'OPEN_WITH_CODE');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'ELIGIBLE', 'REGISTERED', 'REVOKED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('FREE', 'USER_PAYS', 'ORGANIZATION_PAYS', 'SPONSOR_PAYS', 'MIXED');

-- CreateEnum
CREATE TYPE "GradingJobStatus" AS ENUM ('QUEUED', 'PROCESSING', 'WAITING_FOR_MANUAL_GRADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "GradingTrigger" AS ENUM ('SUBMISSION', 'AUTO_EXPIRE', 'MANUAL_REQUEST', 'ANSWER_KEY_CHANGED', 'APPEAL', 'SYSTEM_RECOVERY', 'ADMIN_REGRADE');

-- CreateEnum
CREATE TYPE "QuestionScoreStatus" AS ENUM ('PENDING', 'AUTO_GRADED', 'MANUAL_GRADING_REQUIRED', 'MANUALLY_GRADED', 'PARTIALLY_GRADED', 'INVALIDATED', 'NOT_ANSWERED', 'ERROR');

-- CreateEnum
CREATE TYPE "AnswerEvaluation" AS ENUM ('CORRECT', 'PARTIALLY_CORRECT', 'INCORRECT', 'UNANSWERED', 'NOT_APPLICABLE', 'UNDETERMINED');

-- CreateEnum
CREATE TYPE "GradingMethod" AS ENUM ('AUTOMATIC', 'MANUAL', 'HYBRID', 'IMPORTED', 'OVERRIDDEN');

-- CreateEnum
CREATE TYPE "ManualGradingTaskStatus" AS ENUM ('PENDING_ASSIGNMENT', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'NEEDS_MODERATION', 'RETURNED_FOR_REVISION', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ManualGradingMode" AS ENUM ('SINGLE_GRADER', 'DOUBLE_BLIND', 'DOUBLE_REVIEW', 'CONSENSUS', 'MODERATOR_DECIDES');

-- CreateEnum
CREATE TYPE "GraderRole" AS ENUM ('PRIMARY', 'SECONDARY', 'MODERATOR', 'REVIEWER', 'APPEAL_REVIEWER');

-- CreateEnum
CREATE TYPE "GraderAssignmentStatus" AS ENUM ('ASSIGNED', 'ACCEPTED', 'DECLINED', 'IN_PROGRESS', 'SUBMITTED', 'REASSIGNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GradingDecisionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AssessmentResultStatus" AS ENUM ('PROVISIONAL', 'PENDING_MANUAL_GRADING', 'PENDING_REVIEW', 'FINAL', 'WITHHELD', 'INVALIDATED', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "PassStatus" AS ENUM ('PASSED', 'FAILED', 'CONDITIONAL_PASS', 'NOT_DETERMINED', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "CompetenceAchievementStatus" AS ENUM ('NOT_ASSESSED', 'INSUFFICIENT_EVIDENCE', 'BELOW_EXPECTATION', 'APPROACHING_EXPECTATION', 'MEETS_EXPECTATION', 'EXCEEDS_EXPECTATION');

-- CreateEnum
CREATE TYPE "ResultPublicationStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'PARTIALLY_PUBLISHED', 'WITHHELD', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ResultPublicationAudience" AS ENUM ('CANDIDATE', 'GUARDIAN', 'ORGANIZATION', 'TEACHER', 'GRADER', 'ADMIN', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ResultPublicationEventType" AS ENUM ('CREATED', 'SCHEDULED', 'PUBLISHED', 'WITHHELD', 'REPUBLISHED', 'REVOKED', 'EXPIRED', 'POLICY_CHANGED');

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lifecycleStatus" "QuestionLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "ownerUserId" TEXT,
    "ownerOrganizationId" TEXT,
    "currentPublishedVersionId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_type" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isGrid" BOOLEAN NOT NULL DEFAULT false,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "question_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_version" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "versionStatus" "QuestionVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "typeId" TEXT NOT NULL,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "defaultTimeSeconds" INTEGER,
    "defaultMaxScore" DECIMAL(10,4) NOT NULL DEFAULT 1,
    "defaultMinScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "feedbackCorrectly" TEXT,
    "feedbackIncorrectly" TEXT,
    "explanation" TEXT,
    "payload" JSONB NOT NULL DEFAULT '{}',
    "answerConfig" JSONB NOT NULL DEFAULT '{}',
    "presentationConfig" JSONB NOT NULL DEFAULT '{}',
    "changeSummary" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),

    CONSTRAINT "question_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_option_version" (
    "id" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "matchRules" JSONB DEFAULT '{}',
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "question_option_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_media" (
    "id" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_type" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "audience_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audience_level" (
    "id" TEXT NOT NULL,
    "audienceTypeId" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "audience_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulty_scale" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "difficulty_scale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "difficulty_level" (
    "id" TEXT NOT NULL,
    "difficultyScaleId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "difficulty_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cognitive_framework" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cognitive_framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cognitive_level" (
    "id" TEXT NOT NULL,
    "cognitiveFrameworkId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cognitive_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_framework" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "description" TEXT,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "competence_framework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_type" (
    "id" TEXT NOT NULL,
    "competenceFrameworkId" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "competence_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_context" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audienceTypeId" TEXT NOT NULL,
    "audienceLevelId" TEXT,
    "curriculumId" TEXT,
    "subjectId" TEXT,
    "occupationId" TEXT,
    "organizationTypeId" TEXT,
    "difficultyScaleId" TEXT NOT NULL,
    "cognitiveFrameworkId" TEXT NOT NULL,
    "competenceFrameworkId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "assessment_context_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" TEXT NOT NULL,
    "parentId" TEXT,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_question_classification" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "assessmentContextId" TEXT NOT NULL,
    "difficultyLevelId" TEXT NOT NULL,
    "cognitiveLevelId" TEXT NOT NULL,
    "validatedQuestionVersionId" TEXT,
    "classificationStatus" "ClassificationStatus" NOT NULL DEFAULT 'REVIEW_REQUIRED',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(7,4),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topic_question_classification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_question_competence" (
    "id" TEXT NOT NULL,
    "classificationId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "weight" DECIMAL(7,4),
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_question_competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_template" (
    "id" TEXT NOT NULL,
    "assessmentContextId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultDurationMinutes" INTEGER NOT NULL,
    "defaultPassingScore" DECIMAL(7,4) NOT NULL,
    "defaultMaxAttempts" INTEGER NOT NULL DEFAULT 1,
    "defaultShuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "defaultShuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "lifecycleStatus" "QuizLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_section" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sectionMode" "SectionMode" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "maxScorePerQuestion" DECIMAL(10,4) NOT NULL,
    "minScorePerQuestion" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "topicId" TEXT,
    "difficultyLevelId" TEXT,
    "difficultyWeights" JSONB NOT NULL DEFAULT '{}',
    "selectionStrategy" "SectionSelectionStrategy" NOT NULL,
    "timeLimitPerQuestionSec" INTEGER,
    "allowSeenQuestions" BOOLEAN NOT NULL DEFAULT true,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_question" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "pinnedQuestionVersionId" TEXT,
    "versionSelectionMode" "VersionSelectionMode" NOT NULL DEFAULT 'LATEST_PUBLISHED',
    "orderIndex" INTEGER NOT NULL,
    "maxScoreOverride" DECIMAL(10,4),
    "minScoreOverride" DECIMAL(10,4),
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "section_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lifecycleStatus" "QuizLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "currentPublishedRevisionId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_revision" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "revisionStatus" "QuizRevisionStatus" NOT NULL DEFAULT 'DRAFT',
    "assessmentContextId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "passingScore" DECIMAL(7,4) NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 1,
    "shuffleQuestions" BOOLEAN NOT NULL DEFAULT false,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,
    "resumeAllowed" BOOLEAN NOT NULL DEFAULT true,
    "proctoringPolicy" JSONB NOT NULL DEFAULT '{}',
    "resultVisibilityPolicy" JSONB NOT NULL DEFAULT '{}',
    "runtimePolicy" JSONB NOT NULL DEFAULT '{}',
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "defaultPrice" DECIMAL(14,2),
    "currencyCode" VARCHAR(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "retiredAt" TIMESTAMP(3),

    CONSTRAINT "quiz_revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_revision_section" (
    "id" TEXT NOT NULL,
    "quizRevisionId" TEXT NOT NULL,
    "sourceSectionId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sectionMode" "SectionMode" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "maxScorePerQuestion" DECIMAL(10,4) NOT NULL,
    "minScorePerQuestion" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "selectionStrategy" "SectionSelectionStrategy" NOT NULL,
    "selectionRuleSnapshot" JSONB NOT NULL DEFAULT '{}',
    "timeLimitPerQuestionSec" INTEGER,
    "shuffleOptions" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "quiz_revision_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_revision_question" (
    "id" TEXT NOT NULL,
    "revisionSectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "classificationId" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "maxScore" DECIMAL(10,4) NOT NULL,
    "minScore" DECIMAL(10,4) NOT NULL DEFAULT 0,

    CONSTRAINT "quiz_revision_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_schedule" (
    "id" TEXT NOT NULL,
    "quizRevisionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scheduleType" "ScheduleType" NOT NULL DEFAULT 'REGULAR',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'DRAFT',
    "registrationStartAt" TIMESTAMP(3),
    "registrationEndAt" TIMESTAMP(3),
    "availableFrom" TIMESTAMP(3) NOT NULL,
    "availableUntil" TIMESTAMP(3) NOT NULL,
    "durationMinutesOverride" INTEGER,
    "maxAttemptsOverride" INTEGER,
    "shuffleQuestionsOverride" BOOLEAN,
    "shuffleOptionsOverride" BOOLEAN,
    "resumeAllowedOverride" BOOLEAN,
    "endTimePolicy" "EndTimePolicy" NOT NULL DEFAULT 'EARLIEST_OF_BOTH',
    "accessMode" "AccessMode" NOT NULL DEFAULT 'ASSIGNED_ONLY',
    "accessCodeHash" TEXT,
    "capacity" INTEGER,
    "priceOverride" DECIMAL(14,2),
    "currencyCodeOverride" VARCHAR(3),
    "operationalPolicyOverride" JSONB NOT NULL DEFAULT '{}',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ulaanbaatar',
    "organizationId" TEXT,
    "venueId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "cancelledBy" TEXT,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,

    CONSTRAINT "quiz_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_audience_rule" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "assessmentContextId" TEXT,
    "audienceTypeId" TEXT,
    "audienceLevelId" TEXT,
    "organizationId" TEXT,
    "organizationUnitId" TEXT,
    "regionId" TEXT,
    "groupId" TEXT,
    "additionalCriteria" JSONB NOT NULL DEFAULT '{}',
    "includeFutureMembers" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_audience_rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_user_assignment" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceRuleId" TEXT,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registeredAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "availableFromOverride" TIMESTAMP(3),
    "availableUntilOverride" TIMESTAMP(3),
    "maxAttemptsOverride" INTEGER,
    "paymentRequiredOverride" BOOLEAN,
    "priceOverride" DECIMAL(14,2),
    "currencyCodeOverride" VARCHAR(3),

    CONSTRAINT "quiz_user_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_schedule_payment_policy" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "paymentRequired" BOOLEAN NOT NULL DEFAULT false,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'FREE',
    "defaultAmount" DECIMAL(14,2),
    "currencyCode" VARCHAR(3),
    "refundAllowed" BOOLEAN NOT NULL DEFAULT false,
    "refundPolicy" JSONB NOT NULL DEFAULT '{}',
    "eligibilityRules" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_schedule_payment_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grading_job" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "submissionId" TEXT,
    "gradingVersion" INTEGER NOT NULL,
    "trigger" "GradingTrigger" NOT NULL,
    "status" "GradingJobStatus" NOT NULL DEFAULT 'QUEUED',
    "algorithmVersion" TEXT,
    "gradingPolicySnapshot" JSONB NOT NULL DEFAULT '{}',
    "answerKeySnapshotHash" TEXT,
    "inputChecksum" TEXT NOT NULL,
    "outputChecksum" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureCode" TEXT,
    "failureMessage" TEXT,
    "requestedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grading_job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attempt_question_score" (
    "id" TEXT NOT NULL,
    "gradingJobId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionVersionId" TEXT NOT NULL,
    "revisionSectionId" TEXT NOT NULL,
    "classificationId" TEXT,
    "status" "QuestionScoreStatus" NOT NULL DEFAULT 'PENDING',
    "evaluation" "AnswerEvaluation" NOT NULL DEFAULT 'UNDETERMINED',
    "gradingMethod" "GradingMethod" NOT NULL,
    "rawScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "finalScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "minScore" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "maxScore" DECIMAL(10,4) NOT NULL,
    "scoreBeforeOverride" DECIMAL(10,4),
    "scoreOverrideReason" TEXT,
    "scoreOverriddenBy" TEXT,
    "scoreOverriddenAt" TIMESTAMP(3),
    "answerSnapshot" JSONB NOT NULL,
    "answerKeySnapshot" JSONB,
    "gradingDetail" JSONB NOT NULL DEFAULT '{}',
    "feedback" TEXT,
    "autoGradedAt" TIMESTAMP(3),
    "manuallyGradedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attempt_question_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_grading_task" (
    "id" TEXT NOT NULL,
    "gradingJobId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "attemptQuestionId" TEXT NOT NULL,
    "questionScoreId" TEXT NOT NULL,
    "status" "ManualGradingTaskStatus" NOT NULL DEFAULT 'PENDING_ASSIGNMENT',
    "gradingMode" "ManualGradingMode" NOT NULL DEFAULT 'SINGLE_GRADER',
    "rubricSnapshot" JSONB NOT NULL,
    "responseSnapshot" JSONB NOT NULL,
    "requiredGraderCount" INTEGER NOT NULL DEFAULT 1,
    "completedGraderCount" INTEGER NOT NULL DEFAULT 0,
    "dueAt" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "assignedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_grading_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grader_assignment" (
    "id" TEXT NOT NULL,
    "manualTaskId" TEXT NOT NULL,
    "graderUserId" TEXT NOT NULL,
    "role" "GraderRole" NOT NULL,
    "status" "GraderAssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedBy" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "declineReason" TEXT,
    "startedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "workloadMetadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grader_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_grading_decision" (
    "id" TEXT NOT NULL,
    "manualTaskId" TEXT NOT NULL,
    "graderAssignmentId" TEXT NOT NULL,
    "questionScoreId" TEXT NOT NULL,
    "decisionVersion" INTEGER NOT NULL,
    "status" "GradingDecisionStatus" NOT NULL DEFAULT 'DRAFT',
    "awardedScore" DECIMAL(10,4) NOT NULL,
    "rubricScores" JSONB NOT NULL DEFAULT '{}',
    "feedbackToCandidate" TEXT,
    "internalComment" TEXT,
    "confidence" DECIMAL(7,4),
    "submittedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_grading_decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_competence_score_contribution" (
    "id" TEXT NOT NULL,
    "questionScoreId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "classificationId" TEXT,
    "weight" DECIMAL(7,4) NOT NULL,
    "earnedContribution" DECIMAL(14,4) NOT NULL,
    "maxContribution" DECIMAL(14,4) NOT NULL,
    "calculationDetail" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_competence_score_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_result" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "gradingJobId" TEXT NOT NULL,
    "resultVersion" INTEGER NOT NULL,
    "status" "AssessmentResultStatus" NOT NULL,
    "passStatus" "PassStatus" NOT NULL DEFAULT 'NOT_DETERMINED',
    "rawScore" DECIMAL(14,4) NOT NULL,
    "adjustedScore" DECIMAL(14,4) NOT NULL,
    "finalScore" DECIMAL(14,4) NOT NULL,
    "maxPossibleScore" DECIMAL(14,4) NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "passingScore" DECIMAL(7,4),
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "partiallyCorrectCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "unansweredCount" INTEGER NOT NULL DEFAULT 0,
    "invalidQuestionCount" INTEGER NOT NULL DEFAULT 0,
    "gradeCode" TEXT,
    "gradeLabel" TEXT,
    "percentileRank" DECIMAL(7,4),
    "standardScore" DECIMAL(14,4),
    "calculationPolicy" JSONB NOT NULL DEFAULT '{}',
    "calculationBreakdown" JSONB NOT NULL DEFAULT '{}',
    "finalizedBy" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "invalidatedBy" TEXT,
    "invalidatedAt" TIMESTAMP(3),
    "invalidationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_result" (
    "id" TEXT NOT NULL,
    "assessmentResultId" TEXT NOT NULL,
    "revisionSectionId" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "earnedScore" DECIMAL(14,4) NOT NULL,
    "maxPossibleScore" DECIMAL(14,4) NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "partiallyCorrectCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "unansweredCount" INTEGER NOT NULL DEFAULT 0,
    "calculationDetail" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "section_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_result" (
    "id" TEXT NOT NULL,
    "assessmentResultId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "topicCode" TEXT,
    "topicTitle" TEXT,
    "earnedScore" DECIMAL(14,4) NOT NULL,
    "maxPossibleScore" DECIMAL(14,4) NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "evidenceQuestionCount" INTEGER NOT NULL DEFAULT 0,
    "calculationDetail" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "topic_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competence_result" (
    "id" TEXT NOT NULL,
    "assessmentResultId" TEXT NOT NULL,
    "competenceId" TEXT NOT NULL,
    "competenceCode" TEXT,
    "competenceName" TEXT,
    "earnedScore" DECIMAL(14,4) NOT NULL,
    "maxPossibleScore" DECIMAL(14,4) NOT NULL,
    "percentage" DECIMAL(7,4) NOT NULL,
    "evidenceQuestionCount" INTEGER NOT NULL DEFAULT 0,
    "achievementStatus" "CompetenceAchievementStatus" NOT NULL,
    "proficiencyLevelCode" TEXT,
    "confidence" DECIMAL(7,4),
    "calculationDetail" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competence_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_publication" (
    "id" TEXT NOT NULL,
    "assessmentResultId" TEXT NOT NULL,
    "publicationVersion" INTEGER NOT NULL,
    "audience" "ResultPublicationAudience" NOT NULL,
    "status" "ResultPublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "visibilityPolicy" JSONB NOT NULL DEFAULT '{}',
    "availableFrom" TIMESTAMP(3),
    "availableUntil" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "withheldBy" TEXT,
    "withheldAt" TIMESTAMP(3),
    "withheldReason" TEXT,
    "revokedBy" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revocationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "result_publication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result_publication_event" (
    "id" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "eventType" "ResultPublicationEventType" NOT NULL,
    "actorUserId" TEXT,
    "reason" TEXT,
    "previousState" JSONB,
    "newState" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_publication_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbox_event" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "lastError" TEXT,

    CONSTRAINT "outbox_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_code_key" ON "question"("code");

-- CreateIndex
CREATE UNIQUE INDEX "question_currentPublishedVersionId_key" ON "question"("currentPublishedVersionId");

-- CreateIndex
CREATE INDEX "question_lifecycleStatus_idx" ON "question"("lifecycleStatus");

-- CreateIndex
CREATE INDEX "question_ownerOrganizationId_idx" ON "question"("ownerOrganizationId");

-- CreateIndex
CREATE UNIQUE INDEX "question_type_code_key" ON "question_type"("code");

-- CreateIndex
CREATE INDEX "question_version_questionId_versionStatus_idx" ON "question_version"("questionId", "versionStatus");

-- CreateIndex
CREATE INDEX "question_version_typeId_idx" ON "question_version"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "question_version_questionId_versionNumber_key" ON "question_version"("questionId", "versionNumber");

-- CreateIndex
CREATE INDEX "question_option_version_questionVersionId_idx" ON "question_option_version"("questionVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_option_version_questionVersionId_optionKey_key" ON "question_option_version"("questionVersionId", "optionKey");

-- CreateIndex
CREATE UNIQUE INDEX "question_option_version_questionVersionId_orderIndex_key" ON "question_option_version"("questionVersionId", "orderIndex");

-- CreateIndex
CREATE INDEX "question_media_questionVersionId_idx" ON "question_media"("questionVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "question_media_questionVersionId_orderIndex_key" ON "question_media"("questionVersionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "audience_type_code_key" ON "audience_type"("code");

-- CreateIndex
CREATE INDEX "audience_level_parentId_idx" ON "audience_level"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "audience_level_audienceTypeId_code_key" ON "audience_level"("audienceTypeId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "difficulty_scale_code_key" ON "difficulty_scale"("code");

-- CreateIndex
CREATE UNIQUE INDEX "difficulty_level_difficultyScaleId_code_key" ON "difficulty_level"("difficultyScaleId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "difficulty_level_difficultyScaleId_rank_key" ON "difficulty_level"("difficultyScaleId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "cognitive_framework_code_key" ON "cognitive_framework"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cognitive_level_cognitiveFrameworkId_code_key" ON "cognitive_level"("cognitiveFrameworkId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "cognitive_level_cognitiveFrameworkId_rank_key" ON "cognitive_level"("cognitiveFrameworkId", "rank");

-- CreateIndex
CREATE UNIQUE INDEX "competence_framework_code_version_key" ON "competence_framework"("code", "version");

-- CreateIndex
CREATE INDEX "competence_type_parentId_idx" ON "competence_type"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "competence_type_competenceFrameworkId_code_key" ON "competence_type"("competenceFrameworkId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_context_code_key" ON "assessment_context"("code");

-- CreateIndex
CREATE INDEX "assessment_context_audienceTypeId_audienceLevelId_idx" ON "assessment_context"("audienceTypeId", "audienceLevelId");

-- CreateIndex
CREATE INDEX "assessment_context_curriculumId_subjectId_idx" ON "assessment_context"("curriculumId", "subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "topic_code_key" ON "topic"("code");

-- CreateIndex
CREATE INDEX "topic_parentId_idx" ON "topic"("parentId");

-- CreateIndex
CREATE INDEX "topic_question_classification_assessmentContextId_topicId_d_idx" ON "topic_question_classification"("assessmentContextId", "topicId", "difficultyLevelId");

-- CreateIndex
CREATE INDEX "topic_question_classification_questionId_classificationStat_idx" ON "topic_question_classification"("questionId", "classificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "topic_question_classification_topicId_questionId_assessment_key" ON "topic_question_classification"("topicId", "questionId", "assessmentContextId");

-- CreateIndex
CREATE UNIQUE INDEX "topic_question_competence_classificationId_competenceId_key" ON "topic_question_competence"("classificationId", "competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_template_code_key" ON "quiz_template"("code");

-- CreateIndex
CREATE INDEX "quiz_template_assessmentContextId_lifecycleStatus_idx" ON "quiz_template"("assessmentContextId", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "quiz_section_topicId_difficultyLevelId_idx" ON "quiz_section"("topicId", "difficultyLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_section_templateId_orderIndex_key" ON "quiz_section"("templateId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "section_question_sectionId_questionId_key" ON "section_question"("sectionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "section_question_sectionId_orderIndex_key" ON "section_question"("sectionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_code_key" ON "quiz"("code");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_currentPublishedRevisionId_key" ON "quiz"("currentPublishedRevisionId");

-- CreateIndex
CREATE INDEX "quiz_templateId_lifecycleStatus_idx" ON "quiz"("templateId", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "quiz_revision_quizId_revisionStatus_idx" ON "quiz_revision"("quizId", "revisionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_revision_quizId_revisionNumber_key" ON "quiz_revision"("quizId", "revisionNumber");

-- CreateIndex
CREATE INDEX "quiz_revision_section_sourceSectionId_idx" ON "quiz_revision_section"("sourceSectionId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_revision_section_quizRevisionId_orderIndex_key" ON "quiz_revision_section"("quizRevisionId", "orderIndex");

-- CreateIndex
CREATE INDEX "quiz_revision_question_questionVersionId_idx" ON "quiz_revision_question"("questionVersionId");

-- CreateIndex
CREATE INDEX "quiz_revision_question_classificationId_idx" ON "quiz_revision_question"("classificationId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_revision_question_revisionSectionId_orderIndex_key" ON "quiz_revision_question"("revisionSectionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_schedule_code_key" ON "quiz_schedule"("code");

-- CreateIndex
CREATE INDEX "quiz_schedule_quizRevisionId_status_idx" ON "quiz_schedule"("quizRevisionId", "status");

-- CreateIndex
CREATE INDEX "quiz_schedule_availableFrom_availableUntil_idx" ON "quiz_schedule"("availableFrom", "availableUntil");

-- CreateIndex
CREATE INDEX "quiz_schedule_organizationId_idx" ON "quiz_schedule"("organizationId");

-- CreateIndex
CREATE INDEX "quiz_audience_rule_scheduleId_idx" ON "quiz_audience_rule"("scheduleId");

-- CreateIndex
CREATE INDEX "quiz_audience_rule_organizationId_organizationUnitId_idx" ON "quiz_audience_rule"("organizationId", "organizationUnitId");

-- CreateIndex
CREATE INDEX "quiz_audience_rule_regionId_groupId_idx" ON "quiz_audience_rule"("regionId", "groupId");

-- CreateIndex
CREATE INDEX "quiz_user_assignment_userId_status_idx" ON "quiz_user_assignment"("userId", "status");

-- CreateIndex
CREATE INDEX "quiz_user_assignment_sourceRuleId_idx" ON "quiz_user_assignment"("sourceRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_user_assignment_scheduleId_userId_key" ON "quiz_user_assignment"("scheduleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_schedule_payment_policy_scheduleId_key" ON "quiz_schedule_payment_policy"("scheduleId");

-- CreateIndex
CREATE INDEX "grading_job_attemptId_status_idx" ON "grading_job"("attemptId", "status");

-- CreateIndex
CREATE INDEX "grading_job_status_createdAt_idx" ON "grading_job"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "grading_job_attemptId_gradingVersion_key" ON "grading_job"("attemptId", "gradingVersion");

-- CreateIndex
CREATE INDEX "attempt_question_score_attemptId_status_idx" ON "attempt_question_score"("attemptId", "status");

-- CreateIndex
CREATE INDEX "attempt_question_score_attemptQuestionId_idx" ON "attempt_question_score"("attemptQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "attempt_question_score_gradingJobId_attemptQuestionId_key" ON "attempt_question_score"("gradingJobId", "attemptQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "manual_grading_task_questionScoreId_key" ON "manual_grading_task"("questionScoreId");

-- CreateIndex
CREATE INDEX "manual_grading_task_status_priority_dueAt_idx" ON "manual_grading_task"("status", "priority", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "manual_grading_task_gradingJobId_attemptQuestionId_key" ON "manual_grading_task"("gradingJobId", "attemptQuestionId");

-- CreateIndex
CREATE INDEX "grader_assignment_graderUserId_status_idx" ON "grader_assignment"("graderUserId", "status");

-- CreateIndex
CREATE INDEX "grader_assignment_manualTaskId_role_idx" ON "grader_assignment"("manualTaskId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "grader_assignment_manualTaskId_graderUserId_role_key" ON "grader_assignment"("manualTaskId", "graderUserId", "role");

-- CreateIndex
CREATE INDEX "manual_grading_decision_manualTaskId_status_idx" ON "manual_grading_decision"("manualTaskId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "manual_grading_decision_graderAssignmentId_decisionVersion_key" ON "manual_grading_decision"("graderAssignmentId", "decisionVersion");

-- CreateIndex
CREATE INDEX "question_competence_score_contribution_competenceId_idx" ON "question_competence_score_contribution"("competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "question_competence_score_contribution_questionScoreId_comp_key" ON "question_competence_score_contribution"("questionScoreId", "competenceId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_result_gradingJobId_key" ON "assessment_result"("gradingJobId");

-- CreateIndex
CREATE INDEX "assessment_result_attemptId_status_idx" ON "assessment_result"("attemptId", "status");

-- CreateIndex
CREATE INDEX "assessment_result_passStatus_idx" ON "assessment_result"("passStatus");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_result_attemptId_resultVersion_key" ON "assessment_result"("attemptId", "resultVersion");

-- CreateIndex
CREATE UNIQUE INDEX "section_result_assessmentResultId_revisionSectionId_key" ON "section_result"("assessmentResultId", "revisionSectionId");

-- CreateIndex
CREATE INDEX "topic_result_topicId_idx" ON "topic_result"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "topic_result_assessmentResultId_topicId_key" ON "topic_result"("assessmentResultId", "topicId");

-- CreateIndex
CREATE INDEX "competence_result_competenceId_achievementStatus_idx" ON "competence_result"("competenceId", "achievementStatus");

-- CreateIndex
CREATE UNIQUE INDEX "competence_result_assessmentResultId_competenceId_key" ON "competence_result"("assessmentResultId", "competenceId");

-- CreateIndex
CREATE INDEX "result_publication_status_availableFrom_idx" ON "result_publication"("status", "availableFrom");

-- CreateIndex
CREATE UNIQUE INDEX "result_publication_assessmentResultId_publicationVersion_au_key" ON "result_publication"("assessmentResultId", "publicationVersion", "audience");

-- CreateIndex
CREATE INDEX "result_publication_event_publicationId_occurredAt_idx" ON "result_publication_event"("publicationId", "occurredAt");

-- CreateIndex
CREATE INDEX "outbox_event_status_availableAt_idx" ON "outbox_event"("status", "availableAt");

-- CreateIndex
CREATE INDEX "outbox_event_aggregateType_aggregateId_idx" ON "outbox_event"("aggregateType", "aggregateId");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_currentPublishedVersionId_fkey" FOREIGN KEY ("currentPublishedVersionId") REFERENCES "question_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "question_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_option_version" ADD CONSTRAINT "question_option_version_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_media" ADD CONSTRAINT "question_media_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_level" ADD CONSTRAINT "audience_level_audienceTypeId_fkey" FOREIGN KEY ("audienceTypeId") REFERENCES "audience_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audience_level" ADD CONSTRAINT "audience_level_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "audience_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "difficulty_level" ADD CONSTRAINT "difficulty_level_difficultyScaleId_fkey" FOREIGN KEY ("difficultyScaleId") REFERENCES "difficulty_scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cognitive_level" ADD CONSTRAINT "cognitive_level_cognitiveFrameworkId_fkey" FOREIGN KEY ("cognitiveFrameworkId") REFERENCES "cognitive_framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_type" ADD CONSTRAINT "competence_type_competenceFrameworkId_fkey" FOREIGN KEY ("competenceFrameworkId") REFERENCES "competence_framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_type" ADD CONSTRAINT "competence_type_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "competence_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_context" ADD CONSTRAINT "assessment_context_audienceTypeId_fkey" FOREIGN KEY ("audienceTypeId") REFERENCES "audience_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_context" ADD CONSTRAINT "assessment_context_audienceLevelId_fkey" FOREIGN KEY ("audienceLevelId") REFERENCES "audience_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_context" ADD CONSTRAINT "assessment_context_difficultyScaleId_fkey" FOREIGN KEY ("difficultyScaleId") REFERENCES "difficulty_scale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_context" ADD CONSTRAINT "assessment_context_cognitiveFrameworkId_fkey" FOREIGN KEY ("cognitiveFrameworkId") REFERENCES "cognitive_framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_context" ADD CONSTRAINT "assessment_context_competenceFrameworkId_fkey" FOREIGN KEY ("competenceFrameworkId") REFERENCES "competence_framework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_assessmentContextId_fkey" FOREIGN KEY ("assessmentContextId") REFERENCES "assessment_context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "difficulty_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_cognitiveLevelId_fkey" FOREIGN KEY ("cognitiveLevelId") REFERENCES "cognitive_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_classification" ADD CONSTRAINT "topic_question_classification_validatedQuestionVersionId_fkey" FOREIGN KEY ("validatedQuestionVersionId") REFERENCES "question_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_competence" ADD CONSTRAINT "topic_question_competence_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "topic_question_classification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_question_competence" ADD CONSTRAINT "topic_question_competence_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "competence_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_template" ADD CONSTRAINT "quiz_template_assessmentContextId_fkey" FOREIGN KEY ("assessmentContextId") REFERENCES "assessment_context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_section" ADD CONSTRAINT "quiz_section_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "quiz_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_section" ADD CONSTRAINT "quiz_section_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_section" ADD CONSTRAINT "quiz_section_difficultyLevelId_fkey" FOREIGN KEY ("difficultyLevelId") REFERENCES "difficulty_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_question" ADD CONSTRAINT "section_question_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "quiz_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_question" ADD CONSTRAINT "section_question_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_question" ADD CONSTRAINT "section_question_pinnedQuestionVersionId_fkey" FOREIGN KEY ("pinnedQuestionVersionId") REFERENCES "question_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "quiz_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_currentPublishedRevisionId_fkey" FOREIGN KEY ("currentPublishedRevisionId") REFERENCES "quiz_revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision" ADD CONSTRAINT "quiz_revision_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision" ADD CONSTRAINT "quiz_revision_assessmentContextId_fkey" FOREIGN KEY ("assessmentContextId") REFERENCES "assessment_context"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_section" ADD CONSTRAINT "quiz_revision_section_quizRevisionId_fkey" FOREIGN KEY ("quizRevisionId") REFERENCES "quiz_revision"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_section" ADD CONSTRAINT "quiz_revision_section_sourceSectionId_fkey" FOREIGN KEY ("sourceSectionId") REFERENCES "quiz_section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_question" ADD CONSTRAINT "quiz_revision_question_revisionSectionId_fkey" FOREIGN KEY ("revisionSectionId") REFERENCES "quiz_revision_section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_question" ADD CONSTRAINT "quiz_revision_question_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_question" ADD CONSTRAINT "quiz_revision_question_questionVersionId_fkey" FOREIGN KEY ("questionVersionId") REFERENCES "question_version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_revision_question" ADD CONSTRAINT "quiz_revision_question_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "topic_question_classification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_schedule" ADD CONSTRAINT "quiz_schedule_quizRevisionId_fkey" FOREIGN KEY ("quizRevisionId") REFERENCES "quiz_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_audience_rule" ADD CONSTRAINT "quiz_audience_rule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "quiz_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_audience_rule" ADD CONSTRAINT "quiz_audience_rule_assessmentContextId_fkey" FOREIGN KEY ("assessmentContextId") REFERENCES "assessment_context"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_audience_rule" ADD CONSTRAINT "quiz_audience_rule_audienceTypeId_fkey" FOREIGN KEY ("audienceTypeId") REFERENCES "audience_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_audience_rule" ADD CONSTRAINT "quiz_audience_rule_audienceLevelId_fkey" FOREIGN KEY ("audienceLevelId") REFERENCES "audience_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_user_assignment" ADD CONSTRAINT "quiz_user_assignment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "quiz_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_user_assignment" ADD CONSTRAINT "quiz_user_assignment_sourceRuleId_fkey" FOREIGN KEY ("sourceRuleId") REFERENCES "quiz_audience_rule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_schedule_payment_policy" ADD CONSTRAINT "quiz_schedule_payment_policy_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "quiz_schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attempt_question_score" ADD CONSTRAINT "attempt_question_score_gradingJobId_fkey" FOREIGN KEY ("gradingJobId") REFERENCES "grading_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_task" ADD CONSTRAINT "manual_grading_task_gradingJobId_fkey" FOREIGN KEY ("gradingJobId") REFERENCES "grading_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_task" ADD CONSTRAINT "manual_grading_task_questionScoreId_fkey" FOREIGN KEY ("questionScoreId") REFERENCES "attempt_question_score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grader_assignment" ADD CONSTRAINT "grader_assignment_manualTaskId_fkey" FOREIGN KEY ("manualTaskId") REFERENCES "manual_grading_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_decision" ADD CONSTRAINT "manual_grading_decision_manualTaskId_fkey" FOREIGN KEY ("manualTaskId") REFERENCES "manual_grading_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_decision" ADD CONSTRAINT "manual_grading_decision_graderAssignmentId_fkey" FOREIGN KEY ("graderAssignmentId") REFERENCES "grader_assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_grading_decision" ADD CONSTRAINT "manual_grading_decision_questionScoreId_fkey" FOREIGN KEY ("questionScoreId") REFERENCES "attempt_question_score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_competence_score_contribution" ADD CONSTRAINT "question_competence_score_contribution_questionScoreId_fkey" FOREIGN KEY ("questionScoreId") REFERENCES "attempt_question_score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_result" ADD CONSTRAINT "assessment_result_gradingJobId_fkey" FOREIGN KEY ("gradingJobId") REFERENCES "grading_job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section_result" ADD CONSTRAINT "section_result_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "assessment_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_result" ADD CONSTRAINT "topic_result_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "assessment_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competence_result" ADD CONSTRAINT "competence_result_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "assessment_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_publication" ADD CONSTRAINT "result_publication_assessmentResultId_fkey" FOREIGN KEY ("assessmentResultId") REFERENCES "assessment_result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result_publication_event" ADD CONSTRAINT "result_publication_event_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "result_publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

