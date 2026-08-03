# Active Task

Status: `IN_PROGRESS`

## Goal

Candidate onboarding болон assessment enrollment gate-г хэрэгжүүлж, email-verified хэрэглэгч үнэлгээнд орохоос өмнө profile completion, enrollment/payment/access шалгалтуудыг нэг backend-authoritative урсгал болгох.

## Scope

- Candidate profile completion state тодорхойлох.
- Portal дээр onboarding/profile completion UX нэмэх.
- Assessment enrollment gate API contract тодорхойлох.
- Free/private-code/paid assessment access decision flow хэрэгжүүлэх эхний суурь.
- Candidate catalog/assessment start action дээр gate шалгалт холбох.
- Backend tests болон frontend smoke validation нэмэх.

## Implementation Plan

1. `DONE` Discovery and Current Flow Map
   - Candidate profile data одоогоор хаана хадгалагдаж байгааг шалгах: `services/profile`, `apps/portal-web/src/features/profile`.
   - Catalog болон assessment start урсгалын одоогийн API/mock boundary-г зураглах.
   - Commerce/order болон assessment attempt service-тэй холбогдох боломжтой endpoint-үүдийг тодорхойлох.
   - Existing mock data-г production path-аас салгах эрсдэлийг тэмдэглэх.

2. `DONE` Profile Completion Contract
   - Candidate profile completion-д шаардагдах minimum fields тодорхойлох:
     - full name
     - phone number
     - organisation/school optional or required policy
     - role-specific metadata optional fields
   - `ProfileCompletionStatus` contract нэмэх.
   - Backend response shape:
     - `isComplete`
     - `missingFields`
     - `nextAction`
   - Email verification болон profile completion хоёрын ялгааг API contract дээр тодорхой болгох.

3. `DONE` Profile Backend Foundation
   - `services/profile` дээр current-user profile get/update endpoint хэрэгжүүлэх эсвэл байгаа endpoint-г harden хийх.
   - Gateway identity header (`x-user-id`, `x-user-roles`) ашиглах.
   - Profile update validation нэмэх.
   - Profile completion status endpoint нэмэх.
   - Unit tests нэмэх.

4. `DONE` Candidate Onboarding UX
   - Portal дээр first-login/profile incomplete үед onboarding form харуулах.
   - Candidate profile page-тэй давхардалгүй component reuse хийх.
   - Save success/error/loading states нэмэх.
   - Mock auth mode-д demo profile completion-г эвдэхгүй байх.

5. `DONE` Enrollment Gate Contract
   - Assessment access decision contract тодорхойлох:
     - `allowed`
     - `blockedReason`
     - `requiredAction`
     - `assessmentId`
     - `enrollmentId/orderId/attemptId` optional
   - Block reasons:
     - `EMAIL_NOT_VERIFIED`
     - `PROFILE_INCOMPLETE`
     - `NOT_ENROLLED`
     - `PAYMENT_REQUIRED`
     - `ASSESSMENT_NOT_OPEN`
     - `ALREADY_ATTEMPTED`
   - Free/private-code/paid access modes-г decision matrix дээр бичих.

6. `IN_PROGRESS` Enrollment Gate Backend Foundation
   - Assessment/catalog start action дээр gate endpoint нэмэх эсвэл existing create attempt flow-д gate check хийх.
   - Email verified шалгалтыг auth identity/profile lookup-той холбох.
   - Profile completion шалгалт холбох.
   - Free assessment start allowed response нэмсэн.
   - Private-code assessment code validation placeholder эсвэл existing join-code logic ашиглах.
   - Paid assessment бол `PAYMENT_REQUIRED` response буцаах.
   - Remaining: dedicated enrollment/order persistence болон private-code validation-г catalog/commerce bounded context-той холбох.

7. `DONE` Portal Catalog Integration
   - Candidate catalog card/start button дээр gate API дуудах.
   - `PROFILE_INCOMPLETE` бол onboarding руу чиглүүлэх.
   - `PAYMENT_REQUIRED` бол payment/order placeholder screen рүү чиглүүлэх.
   - `allowed` бол existing attempt creation/runtime flow руу үргэлжлүүлэх.
   - Clear error/empty/loading states нэмэх.

8. `IN_PROGRESS` Payment/Order Placeholder
   - Commerce integration бүрэн хийгдээгүй бол payment required screen болон mock/manual payment placeholder нэмэх.
   - Future commerce order lifecycle-той холбогдох TODO boundary үлдээх.
   - Paid assessment flow-г frontend дээр dead-end биш, ойлгомжтой pending state болгох.
   - Current: paid gate нь catalog cart/checkout placeholder руу чиглэж байна.
   - Remaining: dedicated payment required route/order status screen.

9. `IN_PROGRESS` Validation
   - Backend unit tests:
     - profile incomplete
     - email not verified
     - free assessment allowed
     - paid assessment payment required
   - Frontend tests:
     - onboarding form render
     - gate blocked profile incomplete
     - gate payment required state
   - Integration smoke:
     - verified candidate -> profile incomplete -> onboarding -> catalog gate.

## Implementation Notes

- `services/profile`:
  - `GET /profile/me`
  - `PUT /profile/me`
  - `GET /profile/me/completion`
  - `GET /profile/me/assessment-gate/:assessmentId`
- `services/gateway`:
  - `/api/v1/profile/me*` authenticated proxy-г profile service рүү дамжуулна.
- `apps/portal-web`:
  - `/onboarding` profile completion form нэмсэн.
  - Catalog start action backend gate дуудаж, `PROFILE_INCOMPLETE` үед onboarding руу, `PAYMENT_REQUIRED` үед cart/checkout placeholder руу чиглүүлнэ.

## Validation Run

- `pnpm --filter @seek/contracts build` PASS
- `pnpm --filter @seek/profile typecheck` PASS
- `pnpm --filter @seek/profile test -- --runInBand` PASS
- `pnpm --filter @seek/gateway test -- --runInBand` PASS
- `pnpm --filter @seek/portal-web typecheck` PASS
- `pnpm --filter @seek/portal-web test -- --runInBand` PASS

## Done Criteria

- Email verified candidate profile incomplete бол үнэлгээ эхлүүлэхээс өмнө onboarding руу чиглэнэ.
- Profile completion status backend-authoritative байна.
- Assessment start/enrollment gate нь frontend-only биш backend decision ашиглана.
- Free assessment-д allowed/enroll path тодорхой байна.
- Paid assessment-д payment required path ойлгомжтой байна.
- Existing auth verification/login/session flow эвдэхгүй.
- Unit/component/integration smoke tests pass байна.
