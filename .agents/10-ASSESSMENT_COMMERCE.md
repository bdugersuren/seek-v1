# Assessment Commerce / Үнэлгээний худалдаа ба эрх

## Separation

```text
AssessmentDefinition
AssessmentVersion
AssessmentOffer
PricingPolicy
AvailabilityPolicy
AudiencePolicy
Entitlement
Order
Payment
AssessmentAttempt
AssessmentResult
```

## Offer Types

```text
PUBLIC_FREE
PUBLIC_PAID
TARGETED
INVITATION_ONLY
ORGANISATION_COMMISSIONED
ORGANISATION_INTERNAL
CAMPAIGN
SUBSCRIPTION_INCLUDED
LICENSE_INCLUDED
BUNDLE_INCLUDED
COUPON_ACCESS
SPONSORED
```

## Critical Rule

Payment creates or extends entitlement only. It never changes score, confidence, verification, competency, or certificate status.
