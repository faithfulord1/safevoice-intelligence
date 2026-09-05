# SafeVoice Intelligence Threat Model

## Purpose

SafeVoice may process safety reports that contain sensitive personal information, allegations, health-related information, images, audio, whistleblowing material and organisational evidence. The platform therefore treats security, privacy, integrity and human governance as core product requirements.

This document describes the initial threat model for the platform. It is a living design artefact, not a certification or claim of production readiness.

## Assets to protect

- original voice, text, image and video evidence
- reporter identity and contact details
- anonymous or pseudonymous reporting choices
- translations and transcripts
- incident classifications and risk scores
- human review decisions
- corrective-action evidence
- organisation and tenant data
- API credentials, webhook secrets and service tokens
- audit trails
- regulatory-routing decisions
- MCP and API tool permissions

## Trust boundaries

```text
Reporter device
   ↓
Public intake boundary
   ↓
Authentication / anonymous-access boundary
   ↓
Application services
   ↓
AI and language services
   ↓
Rules / policy layer
   ↓
Human review boundary
   ↓
Organisation / regulator integration boundary
   ↓
Evidence store and audit systems
```

Each boundary should have explicit authentication, authorisation, validation, logging and data-minimisation controls appropriate to the risk.

## Principal threats

### 1. False or malicious reports

Attackers may submit fabricated claims, abusive material, coordinated spam or deliberately misleading evidence.

**Mitigations**

- rate limiting and abuse controls
- provenance metadata
- evidence confidence markers
- human verification before high-impact action
- duplicate and coordinated-report detection
- separation of allegation from verified fact
- clear case-state labels

### 2. Prompt injection through user evidence

Text, documents, images or transcribed speech could contain instructions intended to manipulate an AI component or agent.

**Mitigations**

- treat all reporter content as untrusted data
- never allow evidence text to override system policy
- tool allowlists
- schema-constrained extraction
- no autonomous high-impact tools
- context separation between evidence and instructions
- human approval for consequential transitions

### 3. Cross-tenant data exposure

One organisation must never see another organisation's cases or evidence unless explicitly authorised.

**Mitigations**

- tenant-scoped identifiers
- row-level access controls
- deny-by-default authorisation
- server-side tenant checks
- test coverage for insecure direct object reference scenarios
- separate audit events for cross-organisation sharing

### 4. Reporter re-identification

Anonymous or pseudonymous reporters could be identified through metadata, filenames, audio, location data or analytics.

**Mitigations**

- explain anonymity limitations clearly
- remove unnecessary metadata
- minimise IP/device retention
- separate identity vault from case content where feasible
- restrict raw audio access
- aggregate analytics with re-identification safeguards

### 5. Translation distortion

A translation error could change the meaning of a safety concern.

**Mitigations**

- preserve original-language evidence
- store translation as a derived artefact
- record language and model/service metadata
- confidence flags
- human review for high-risk or ambiguous cases
- allow reporter correction where appropriate

### 6. AI overreach

An AI system could produce a confident but incorrect clinical, regulatory or enforcement recommendation.

**Mitigations**

- explicit prohibited-action list
- deterministic policy gates
- human review requirements
- confidence and uncertainty display
- evidence citations where available
- no autonomous clinical diagnosis, sanctions or enforcement

### 7. Evidence tampering

A user, insider or compromised service could alter evidence after submission.

**Mitigations**

- immutable or append-only evidence records where technically appropriate
- content hashing
- timestamped audit events
- versioned derived artefacts
- restricted deletion workflows
- documented retention and legal-hold processes

### 8. Privileged insider abuse

An authorised employee could access, export or manipulate sensitive cases without legitimate need.

**Mitigations**

- least privilege
- role and purpose-based access
- privileged-access logging
- export controls
- approval for sensitive bulk actions
- anomaly detection on administrator activity
- periodic access reviews

### 9. API and MCP privilege escalation

An external application or AI agent could call tools beyond its intended authority.

**Mitigations**

- scoped tokens
- OAuth or equivalent delegated authorisation where appropriate
- per-tool permission checks
- server-side human-approval gates
- rate limits
- explicit read/write distinction
- no trust in client-side UI restrictions

### 10. Unsafe file uploads

Uploaded files may contain malware, oversized payloads or deceptive content.

**Mitigations**

- file-type allowlists
- size limits
- malware scanning
- quarantine workflow
- safe rendering
- metadata stripping where appropriate
- no direct execution of uploaded content

### 11. Denial of service during urgent reporting

Attackers or traffic spikes could make the reporting system unavailable.

**Mitigations**

- rate limiting that preserves emergency usability
- queue-based ingestion
- graceful degradation
- low-bandwidth intake option
- operational monitoring
- alternative reporting instructions when service is unavailable

### 12. Regulatory misrouting

A concern may be sent to the wrong organisation, country or regulator.

**Mitigations**

- jurisdiction metadata
- versioned routing rules
- human confirmation for ambiguous routes
- routing provenance
- periodic policy review
- no claim that routing equals official acceptance

## Prohibited autonomous actions

The following should not be executable solely because an AI model requests them:

- make a clinical diagnosis
- instruct a patient to change prescribed treatment
- impose sanctions
- issue regulatory enforcement
- determine criminal liability
- dismiss a safeguarding concern
- expose a reporter's protected identity
- delete or conceal evidence
- close a high-risk case without authorised review

## Security testing priorities

1. authentication and authorisation bypass
2. cross-tenant access
3. anonymous-reporter privacy leakage
4. prompt-injection resistance
5. unsafe MCP tool invocation
6. malicious file upload
7. audit-log integrity
8. API abuse and rate limiting
9. role-escalation scenarios
10. evidence tampering and replay

## Incident-response principle

A security incident affecting SafeVoice must itself generate an auditable incident record with correlation ID, affected assets, containment action, before state, after state, verification and authorised closure.

## Status

This is the initial design threat model. Production deployment requires formal security review, privacy impact assessment, penetration testing, jurisdiction-specific legal analysis and operational incident-response procedures.
