# Base44 Integration Plan

## Current position

SafeVoice Intelligence has an application prototype being developed in Base44 and a separate public GitHub repository for architecture, governance, MCP, API and integration artefacts.

The two should be connected carefully rather than treating the Base44 front end as the system of record.

## Recommended role split

### Base44

Use Base44 initially for:

- multilingual reporting UI
- mobile-first forms
- case-status experience
- dashboards
- demonstration workflows
- synthetic demo content

### SafeVoice service layer

Use a dedicated service layer for:

- case IDs
- durable evidence storage
- tenant isolation
- policy/risk rules
- audit events
- human approval state
- API authentication
- MCP access
- integration webhooks

This keeps the regulated/high-risk logic behind controlled APIs instead of embedding consequential logic in front-end components.

## Integration contract

The Base44 app should eventually call versioned SafeVoice endpoints such as:

```text
POST /v1/reports
GET  /v1/reports/{caseId}
POST /v1/reports/{caseId}/evidence
POST /v1/reports/{caseId}/human-review
GET  /v1/reports/{caseId}/timeline
```

The public app should never receive unrestricted credentials for administrative or regulator-level actions.

## Minimum handoff payload

```json
{
  "source_channel": "base44_web",
  "source_language": "yo",
  "original_statement": "...",
  "identity_mode": "anonymous|pseudonymous|identified",
  "domain_hint": "medicine_safety",
  "consent": {
    "evidence_processing": true
  }
}
```

## Response model

```json
{
  "case_id": "SV-...",
  "status": "received",
  "human_review_required": true,
  "next_safe_action": "provide_optional_evidence",
  "reporter_message": "Your report has been received and is awaiting review."
}
```

## Security rules

- never embed permanent privileged tokens in Base44 client code
- minimise sensitive data held in the UI layer
- preserve original-language evidence server side
- use short-lived/scoped credentials where supported
- validate tenant and case access on the server, not just in UI logic
- treat all user-submitted text and files as untrusted input
- require server-side approval gates for high-impact transitions

## Export / code-sync milestone

When Base44 source export or Git integration is available, the next steps are:

1. inspect generated source before publication
2. remove secrets and environment-specific identifiers
3. review dependency and licence posture
4. add `.env.example` rather than real secrets
5. run static/security checks
6. connect only the safe client-facing portion to GitHub
7. keep production secrets in deployment secret stores

## Definition of connected

SafeVoice should only be described as fully connected to Base44 when the prototype UI can submit a synthetic report to the governed service layer, receive a case ID, display status, and demonstrate a human-review state without bypassing the audit trail.
