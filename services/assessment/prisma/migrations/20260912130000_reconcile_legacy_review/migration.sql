-- Reconcile only unambiguous legacy submissions: a single version and the
-- workflow's own status write immediately after its pending event. Never approve.
WITH latest_event AS (
 SELECT DISTINCT ON ("questionId") * FROM question_workflow_event
 ORDER BY "questionId", "occurredAt" DESC, id DESC
), eligible AS (
 SELECT v.id, v."questionId" FROM question_version v
 JOIN latest_event e ON e."questionId"=v."questionId"
 WHERE v."versionStatus"='DRAFT' AND e."newStatus"='pending'
 AND e.action IN ('approval_requested','resubmitted')
 AND v."updatedAt">=e."occurredAt" AND v."updatedAt"<=e."occurredAt"+interval '1 second'
 AND (SELECT count(*) FROM question_version x WHERE x."questionId"=v."questionId")=1
)
UPDATE question_version v SET "versionStatus"='IN_REVIEW',
 "classificationSnapshot"=COALESCE((SELECT jsonb_agg(to_jsonb(c)) FROM topic_question_classification c WHERE c."questionId"=v."questionId"),'[]')
FROM eligible e WHERE v.id=e.id;
UPDATE topic_question_classification c SET "validatedQuestionVersionId"=v.id
FROM question_version v WHERE c."questionId"=v."questionId" AND v."versionStatus"='IN_REVIEW' AND c."validatedQuestionVersionId" IS NULL;
UPDATE question_workflow_event e SET "questionVersionId"=v.id
FROM question_version v WHERE e."questionId"=v."questionId" AND e."questionVersionId" IS NULL
AND (SELECT count(*) FROM question_version x WHERE x."questionId"=v."questionId")=1;
