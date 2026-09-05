# SafeVoice Intelligence Architecture

## Purpose

SafeVoice Intelligence is designed as a multilingual safety reporting, triage, governance and resolution platform for regulated and safety-critical environments.

The platform is intentionally modular so the same reporting experience can support food safety, medicines, healthcare, care, workplace safety, product safety, hospitality and related domains without collapsing all risk logic into one generic AI model.

## Design principles

1. **Human-first reporting**
   - People should be able to report naturally by voice, text, image, video, QR code or assisted channel.
   - The system should not require regulatory knowledge from the reporter.

2. **Preserve the original evidence**
   - Original-language content and original media should be retained separately from translations and AI-generated summaries.

3. **AI assists, humans govern**
   - AI may structure, classify and recommend.
   - Consequential actions require authorised human review.

4. **Domain-specific rules**
   - Food, medicine, healthcare and safeguarding risks require distinct rule sets, evidence needs and escalation paths.

5. **Traceability by default**
   - Each recommendation, approval, action and verification event should be attributable and timestamped.

6. **Privacy and security by design**
   - Minimise collection, isolate tenants, restrict access, and design for sensitive information from the beginning.

## Logical architecture

```text
┌──────────────────────────────────────────┐
│            REPORTING CHANNELS            │
│ Voice | Text | Photo | Video | QR | IVR  │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│          EVIDENCE INTAKE LAYER           │
│ Consent | Metadata | Media | Case ID     │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│      LANGUAGE + ACCESSIBILITY LAYER      │
│ Transcription | Translation | Reading UX │
│ Original-language preservation           │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│       SAFETY INTELLIGENCE ENGINE         │
│ Claim extraction | Classification        │
│ Confidence | Missing information         │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│             DOMAIN ENGINES               │
│ Food | Medicines | Health | Care | Work  │
│ Product | Hospitality | Supply | Other   │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│      RULES + POLICY MAPPING LAYER        │
│ Deterministic rules | SLA | Evidence     │
│ Regulatory mapping | Organisation policy │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│       HUMAN GOVERNANCE + APPROVAL        │
│ Review | Override | Approve | Escalate   │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│      ACTION + RESOLUTION ORCHESTRATION   │
│ Route | Notify | Correct | Verify | Close│
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│       EVIDENCE VAULT + AUDIT TRAIL       │
│ Before | Action | After | Verification   │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│       DASHBOARDS + API + MCP LAYER       │
│ Analytics | Integrations | Agent tools   │
└──────────────────────────────────────────┘
```

## Core data objects

### SafetyReport

Represents the first report from a person or external system.

Suggested fields:

- report_id
- organisation_id
- reporter_mode: identified | anonymous | assisted
- consent_state
- source_channel
- original_language
- original_text
- original_media_refs
- location
- reported_at
- submitted_at

### StructuredConcern

Represents the interpreted safety concern without replacing the original report.

Suggested fields:

- concern_id
- report_id
- domain
- issue_type
- entities_involved
- event_time
- affected_people
- extracted_claims
- missing_information
- translation
- ai_confidence
- human_validation_state

### RiskAssessment

Represents risk signals and deterministic rule outcomes.

Suggested fields:

- assessment_id
- concern_id
- severity
- urgency
- rule_hits
- policy_references
- uncertainty
- recommended_next_steps
- requires_human_review

### Case

Represents the operational workflow.

Suggested fields:

- case_id
- status
- assigned_team
- assigned_reviewer
- acknowledgement_due_at
- resolution_due_at
- escalation_level
- current_decision
- current_action

### EvidenceRecord

Represents traceable operational evidence.

Suggested fields:

- evidence_id
- case_id
- correlation_id
- before_state
- action
- after_state
- verification
- approver
- timestamps
- evidence_hashes

### AuditEvent

Represents immutable or append-only activity history.

Suggested fields:

- event_id
- case_id
- actor_type
- actor_id
- event_type
- source
- timestamp
- prior_state_ref
- resulting_state_ref

## Multilingual architecture

SafeVoice should treat translation as a derived representation rather than the source of truth.

```text
Original voice/text
      ↓
Original-language transcript
      ↓
Translation
      ↓
Structured facts
      ↓
Human-reviewed interpretation
```

All downstream decisions should retain references back to the original evidence.

## AI boundary

AI may:

- transcribe
- translate
- summarise
- extract facts
- identify missing information
- classify likely domain
- propose severity
- retrieve relevant policy
- prepare routing options
- prepare escalation recommendations
- identify recurring anonymised patterns

AI must not autonomously:

- diagnose patients
- prescribe or change medication
- decide safeguarding outcomes
- issue regulatory sanctions
- dismiss whistleblowing reports
- terminate employment
- impose disciplinary action
- close critical cases without authorised review

## Rules engine

High-risk decisions should not rely only on probabilistic model output.

Example deterministic food rule:

```text
IF concern.issue_type = "undeclared_allergen"
AND affected_product.status = "served_or_available"
THEN severity >= HIGH
AND human_review_required = true
AND immediate_containment_recommendation = true
```

Example medicine rule:

```text
IF concern.issue_type = "suspected_expired_medicine"
AND patient_exposure = true
THEN human_review_required = true
AND pharmacist_or_clinical_route_required = true
```

The rules engine should have stable rule IDs, versioning and auditability.

## Escalation model

Each organisation can configure acknowledgement and resolution timers by domain and severity.

Example:

```text
Critical: immediate alert + 15 minute acknowledgement target
High: 1 hour acknowledgement target
Medium: 4 hour acknowledgement target
Low: next-business-day acknowledgement target
```

These values are examples only. Production values must come from validated organisational and regulatory requirements.

## Tenant and access model

Potential roles:

- reporter
- investigator
- supervisor
- domain specialist
- safeguarding lead
- pharmacist / clinical reviewer
- organisation administrator
- auditor
- regulator / external reviewer with explicit scope

Access should follow least privilege and case need-to-know principles.

## Integration surfaces

### Human interfaces

- responsive web
- mobile web / PWA
- QR reporting
- voice capture
- assisted reporting
- accessible interface modes

### API

REST or event-driven API for enterprise systems.

### MCP

Agent-facing tools for controlled AI integration.

### Webhooks / events

Potential events:

- report.created
- case.risk_changed
- case.assigned
- case.escalated
- action.approved
- corrective_action.completed
- verification.completed
- case.closed

## Deployment direction

SafeVoice should support a staged path:

1. prototype / demo environment
2. pilot with synthetic data
3. limited real-world pilot with DPIA, security review and strict scope
4. enterprise tenant model
5. regulated integrations after legal and domain validation

## Non-goals for the early platform

- autonomous medical diagnosis
- autonomous law enforcement
- universal global regulatory determination
- replacing emergency services
- replacing qualified safety professionals
- ingesting unrestricted public surveillance feeds

## Success criteria

The platform succeeds when it improves the probability that a legitimate safety signal is:

1. understood correctly,
2. preserved as evidence,
3. routed quickly,
4. reviewed by the right human,
5. acted upon appropriately,
6. verified after action,
7. available for accountable audit and learning.
