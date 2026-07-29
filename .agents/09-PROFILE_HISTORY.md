# Profile and History / Профайл ба түүх

## Separation

`UserAccount` belongs to `auth`; `Person` belongs to `profile`.

## EmploymentPlacement

```text
personId
organisationId
departmentId
positionId
jobRoleId
employmentType
isPrimary
validFrom
validTo
status
source
verificationLevel
changeReason
```

Statuses:

```text
DRAFT
SCHEDULED
ACTIVE
COMPLETED
CANCELLED
SUPERSEDED
```

A new primary ACTIVE record must resolve overlap by closing the previous record or becoming secondary. History is never overwritten.
