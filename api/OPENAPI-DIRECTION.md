# SafeVoice Public API Direction

## Purpose

The SafeVoice API is intended for approved organisations that need to integrate safety reporting, case status, evidence and governed workflow actions into existing systems.

This document is an early design contract, not a production API specification.

## Versioning

Use explicit versioning from the beginning:

```text
/api/v1/
```

Breaking changes should create a new major version rather than silently altering client behaviour.

## Proposed resources

### Reports

```text
POST /api/v1/reports
GET  /api/v1/reports/{report_id}
POST /api/v1/reports/{report_id}/translations
POST /api/v1/reports/{report_id}/classification
```

### Cases

```text
GET  /api/v1/cases/{case_id}
GET  /api/v1/cases/{case_id}/timeline
POST /api/v1/cases/{case_id}/review-requests
POST /api/v1/cases/{case_id}/escalation-drafts
```

### Evidence

```text
POST /api/v1/cases/{case_id}/evidence
GET  /api/v1/cases/{case_id}/evidence
```

### Corrective actions

```text
POST /api/v1/cases/{case_id}/actions
POST /api/v1/cases/{case_id}/actions/{action_id}/verification
```

Execution of consequential actions should require an authorised approval state.

### Policy and regulatory mapping

```text
GET /api/v1/policies/search
GET /api/v1/regulatory-routes
```

### Analytics

```text
GET /api/v1/analytics/trends
```

Analytics endpoints should return privacy-preserving aggregates and should enforce suppression thresholds where needed.

## Example report request

Synthetic example:

```json
{
  "source_channel": "voice",
  "original_language": "yo",
  "report_text": "Synthetic example only",
  "reporter_mode": "anonymous",
  "consent_state": "recorded",
  "organisation_context": "demo-pharmacy-001",
  "location_context": "London demo site"
}
```

## Example report response

```json
{
  "report_id": "SV-RPT-DEMO-001",
  "case_id": "SV-CASE-DEMO-001",
  "correlation_id": "SV-CORR-DEMO-001",
  "status": "received",
  "human_review_required": true
}
```

## Authentication direction

Potential patterns:

- OAuth 2.1 / OIDC for user and enterprise access
- short-lived service credentials for backend integrations
- scoped tokens for machine access

Avoid permanent broad API keys where narrower, rotating credentials are possible.

## Authorisation

Scopes may include:

```text
reports:create
reports:read
cases:read
cases:review
evidence:write
actions:prepare
actions:verify
analytics:read
policies:read
```

High-risk execution should require both permission and case-level approval state.

## Idempotency

Mutation endpoints that could be retried should support idempotency keys to reduce duplicate cases and duplicate action records.

## Correlation IDs

Every request that creates or changes a material object should return a correlation ID for operational tracing.

## Error model

Errors should be machine-readable and should never expose sensitive internal data.

Example:

```json
{
  "error": {
    "code": "HUMAN_APPROVAL_REQUIRED",
    "message": "This action requires authorised human approval.",
    "correlation_id": "SV-CORR-DEMO-002"
  }
}
```

## Webhooks

Potential events:

```text
report.created
classification.prepared
case.assigned
case.escalated
review.requested
review.completed
action.approved
action.completed
verification.completed
case.closed
```

Webhook payloads should be signed and replay-protected.

## Privacy direction

API responses should follow data minimisation. A caller should receive only the fields required for its authorised purpose.

## Safety boundary

The API must not become a bypass around human-review controls. Where the UI requires an authorised human approval, equivalent API and MCP routes must enforce the same control.
