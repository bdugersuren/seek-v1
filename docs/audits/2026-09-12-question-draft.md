# ASSESSOR question draft creation

## Root cause
The initial question modal creates a draft before the classification step. The context access guard required a nonempty topicMappings array on every create. The modal did not send its route context, and Question had no independent context association; granting unclassified drafts access by owner alone would cross context boundaries.

Two additional editor defects were found: cognitive frameworks loaded through the disabled database explorer endpoint (causing the entire Promise.all metadata load to fail), and requestApproval saved content without sending a workflow event.

## Changes
- Nullable Question.assessmentContextId with indexed, restrictive foreign key; no legacy data rewrite or seed.
- Context modal passes explicit context. ASSESSOR can create private drafts only in an active assigned context. Owner is set from authenticated identity.
- Owned context drafts participate in scoped lists and direct access. Existing mapped questions retain their previous scope rules. Context cannot be moved by ASSESSOR; cross-context mappings are rejected.
- Empty classification is allowed for context drafts; approval requests require classification. Empty saves do not resolve or create a fallback context.
- API mapping no longer fabricates a classification for unclassified questions. Draft save removes the editor's unsaved placeholder.
- Editor uses the scoped cognitive-framework metadata endpoint, displays missing-topic guidance, and actually sends the approval workflow request after saving.

## Rollout
Apply additive migration 20260912090000_question_draft_context before assessment deployment. Deploy assessment then portal only. Keep gateway and all other services running.
Rollback images: seek-backend:before-question-draft-20260912 and seek-portal-web:before-question-draft-20260912. Retain the additive column and any newly created questions; never restore the old database over user data. Private backup and evidence: .production/evidence/question-draft/.

## Verification
Completed:
- Assessment and portal TypeScript checks; production backend/frontend builds.
- 29 gateway tests, 2 production compose tests.
- Isolated real API: context-only draft create/read/update/list, classification persistence, unclassified submission rejection, wrong-context and other-owner rejection, grant revocation, existing classified question/blueprint/quiz regression checks.
- Isolated browser: modal Continue returns 201; editor loads, refresh works, Ctrl+S returns 200; metadata requests have no failures. Screenshot reviewed in .production/evidence/question-draft/editor.png.
- Additive migration applied in verification and production. Production assessment image seek-backend:question-draft-20260912 and portal image seek-portal-web:question-draft-final-20260912 deployed. Gateway unchanged.
- All 14 production services healthy. LAN HTTPS with valid certificate: context page 307 authentication redirect; question and cognitive-framework APIs return 401 without authentication.
- Production counts unchanged: questions 0, contexts 1, topics 6, grants 1. Current context has 1 active topic, 3 difficulty levels, 6 cognitive levels. No production fixtures were added.

Authenticated create/save was exercised in isolation; the real user's browser session was not used for production write testing. User should refresh the page and repeat creation.

