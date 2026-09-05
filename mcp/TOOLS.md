# SafeVoice MCP Tool Contract

## Purpose

The SafeVoice Model Context Protocol surface is intended to let approved AI agents interact with SafeVoice through narrow, auditable tools rather than unrestricted database access.

The MCP layer should preserve the same governance model as the human application.

## Design rules

1. Tools should do one clear thing.
2. Read and prepare actions should be separated from high-impact execution.
3. Sensitive outputs should be minimised.
4. High-impact actions should require explicit human approval.
5. Every mutating tool should return a correlation ID and audit reference.
6. Tool descriptions should clearly state side effects.
7. Anonymous or cross-tenant access must never be inferred by the agent.

## Proposed tools

### `submit_safety_report`

Create a new safety report from structured content supplied by an approved client.

Inputs:

- source_channel
- original_language
- report_text
- organisation_context
- location_context
- reporter_mode
- consent_state
- evidence_refs

Returns:

- report_id
- case_id
- correlation_id
- intake_status
- human_review_required

Side effect: creates a report and case.

### `translate_safety_report`

Create a translated representation while preserving the original report.

Inputs:

- report_id
- target_language

Returns:

- translation
- confidence
- ambiguity_flags
- original_evidence_ref

Side effect: creates a derived translation record.

### `classify_safety_report`

Analyse a report and prepare a structured concern.

Inputs:

- report_id

Returns:

- domain
- issue_type
- extracted_claims
- missing_information
- proposed_severity
- confidence
- human_validation_required

Side effect: may create a draft classification, not a final human decision.

### `find_relevant_safety_policy`

Retrieve approved policy or regulatory references relevant to a structured concern.

Inputs:

- case_id
- jurisdiction
- organisation_id

Returns:

- policy_refs
- rule_refs
- applicability_notes
- version_information

Side effect: none.

### `prepare_escalation`

Prepare an escalation recommendation without executing it.

Inputs:

- case_id
- reason

Returns:

- proposed_target
- proposed_priority
- rationale
- missing_requirements
- approval_required

Side effect: may create a draft recommendation.

### `request_human_review`

Place a case into an authorised human review queue.

Inputs:

- case_id
- review_type
- reason
- recommended_role

Returns:

- review_request_id
- status
- assigned_role
- audit_ref

Side effect: creates a review request.

### `attach_evidence`

Attach a permitted evidence reference to a case.

Inputs:

- case_id
- evidence_type
- evidence_ref
- description
- source

Returns:

- evidence_id
- checksum_or_integrity_ref
- audit_ref

Side effect: mutates case evidence.

### `get_case_status`

Return the minimum case status needed by the caller.

Inputs:

- case_id

Returns:

- status
- severity
- assigned_role
- next_required_action
- deadlines

Side effect: none.

### `get_incident_timeline`

Return an authorised timeline of case events.

Inputs:

- case_id

Returns:

- ordered_events
- evidence_refs_allowed_for_caller

Side effect: none.

### `verify_corrective_action`

Record a verification result after an approved corrective action.

Inputs:

- case_id
- action_id
- verification_method
- result
- evidence_refs

Returns:

- verification_id
- status
- audit_ref

Side effect: creates a verification record.

### `get_anonymised_safety_trends`

Return privacy-preserving aggregate safety patterns.

Inputs:

- organisation_scope
- domain
- date_range
- aggregation_level

Returns:

- trend_summary
- counts
- recurring_categories
- suppression_notes

Side effect: none.

### `find_regulatory_route`

Prepare a likely regulatory or external reporting route using validated jurisdiction mappings.

Inputs:

- case_id
- jurisdiction

Returns:

- candidate_routes
- applicability_notes
- required_human_confirmation

Side effect: none.

## High-impact actions deliberately not exposed as autonomous tools

SafeVoice should not expose unrestricted tools such as:

```text
issue_regulatory_penalty
diagnose_patient
change_medication
terminate_employee
dismiss_whistleblower_report
close_critical_case_without_review
notify_law_enforcement_automatically
```

Where an external action is legitimate, the safer pattern is:

```text
prepare_action
request_authorised_human_approval
execute_approved_action
verify_action
```

## Example agent flow

```text
1. submit_safety_report
2. classify_safety_report
3. find_relevant_safety_policy
4. prepare_escalation
5. request_human_review
6. authorised human approves in SafeVoice
7. approved workflow executes outside or inside SafeVoice
8. attach_evidence
9. verify_corrective_action
10. get_incident_timeline
```

## Authentication direction

Production MCP deployments should use authenticated, organisation-scoped access with least privilege. Credentials should never be embedded in prompts or committed to source control.

Potential scopes:

```text
reports:create
reports:read
cases:read
evidence:write
reviews:create
analytics:read
policies:read
```

## Audit requirements

Every mutating MCP call should log:

- tool name
- caller identity
- organisation / tenant
- correlation ID
- timestamp
- input classification
- result status
- downstream approval requirement

The MCP layer must never become a shortcut around SafeVoice governance controls.
