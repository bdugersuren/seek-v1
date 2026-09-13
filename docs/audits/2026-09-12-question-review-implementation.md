# Question review workflow implementation

## Implemented
- Authenticated, version-specific state machine: submit/resubmit, withdraw, request changes, reject, approve, publish, retire. No self approval.
- Question row locks, revision checks, request idempotency and version/actor audit fields.
- Backend submission validation across the 13 existing question types; structured rubric serialization fixed.
- Read-only in-review content, editable returned draft, new draft versions for approved/published/rejected questions.
- Version classification snapshots and preservation of previously pinned classification rows.
- Quiz creation/update uses published versions only, rechecked under a row lock. Existing revision pins stay unchanged.
- SUPER_ADMIN review queue with server pagination, status/context/author/date/search filters, version preview, comparison, comments and decision history.
- ASSESSOR submit/rework/withdraw/new-version pages and in-app decision notices. Unauthorized bulk publication controls removed.
- MN/EN review labels and missing retired status label.
- Restrictive migration of unambiguous legacy pending submissions, verified against a restored production backup.

## Verification
- 15 submission-validation and permission unit tests passed.
- Assessment and portal typechecks passed.
- Real isolated API lifecycle, concurrent decisions, duplicate request IDs, self-review denial, unclassified submit denial, unpublished quiz denial, publication pinning, grant revocation passed.
- Browser author create/save/submit and separate administrator approve/publish passed on candidate images.
- Production backup restored into a dedicated temporary verification database; both migrations passed: legacy draft became IN_REVIEW with one classification snapshot, both historical events retained. Temporary restore database removed.
- Final images passed the full real API/browser suite, including mobile overflow, retirement and creating a new draft version. Final logs/screenshots: .production/evidence/question-review/.
- Production deployed: seek-backend:question-review-release-20260912 and seek-portal-web:question-review-complete-20260912. Only assessment and portal containers replaced; all 14 services healthy.
- Both migrations applied successfully. Existing data retained: 2 questions, 2 workflow events, 2 media attachments. One legacy pending request is now IN_REVIEW; the other question remains DRAFT.
- HTTPS authentication redirects and unauthenticated API denial passed. Both existing attachment URLs returned HTTP 200 over HTTPS. Authenticated write workflows were exercised in isolation, not with production test questions.
- 29 gateway regression tests and 2 compose tests passed; git diff whitespace check passed.

No production fixtures were inserted. SMTP is optional follow-up; in-app decision notices are implemented.
