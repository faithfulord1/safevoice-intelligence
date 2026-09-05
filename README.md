# SafeVoice Intelligence

**Speak up. Stay protected. Get the right action.**

SafeVoice Intelligence is a multilingual, human-governed safety intelligence platform for turning real-world safety concerns into structured, traceable action.

A person can report a concern by voice, text, photo, video, QR code or assisted channel in the language that is most natural to them. SafeVoice preserves the original evidence, helps structure and classify the concern, routes it to the right workflow, starts escalation timers, supports authorised human review, and maintains an auditable evidence trail from first report to verified resolution.

> **AI understands. AI recommends. Humans decide. Every action is accountable.**

## Why SafeVoice exists

People often notice danger before organisations see the data.

A restaurant worker notices unsafe food handling. A patient notices a medicine that looks wrong. A care worker notices neglect. A parent spots an unsafe product. A factory worker sees a hazard. A person who speaks mainly Yoruba notices something dangerous but cannot easily complete a complex English-language form.

SafeVoice is designed to reduce the distance between that human observation and responsible organisational action.

## Core workflow

```text
Speak / Type / Upload / Scan
          ↓
Preserve Original Evidence
          ↓
Transcribe + Translate
          ↓
Structure the Safety Concern
          ↓
Domain + Risk Classification
          ↓
Policy / Rule Checks
          ↓
Recommended Next Action
          ↓
Authorised Human Review
          ↓
Route / Escalate / Resolve
          ↓
Verify Corrective Action
          ↓
Evidence Timeline
```

## Initial industry modules

| Module | Example concerns |
| --- | --- |
| FoodSafe | contamination, allergens, hygiene, temperature control, unsafe preparation |
| MedSafe | suspected counterfeit, expired, incorrect or damaged medicines |
| HealthSafe | patient-safety and non-clinical healthcare incidents |
| CareSafe | safeguarding, medication errors, neglect and care-quality concerns |
| ProductSafe | unsafe consumer products and product defects |
| WorkSafe | workplace hazards, unsafe conditions and near misses |
| SupplySafe | supplier integrity, product provenance and supply-chain concerns |
| HospitalitySafe | guest safety, allergen, food and service-recovery incidents |
| CommunitySafe | public-interest and community safety reporting |

## Multilingual and culturally inclusive by design

SafeVoice is being designed for multilingual reporting rather than simple interface translation.

The intended evidence model keeps:

1. the original voice, text, image or video report,
2. the original-language transcript,
3. the translated version,
4. structured facts extracted from the report,
5. confidence and uncertainty indicators,
6. the human-reviewed interpretation used for action.

Early language priorities include English, Yoruba, Hausa, Igbo, French, Arabic, Hindi, Urdu and Polish, with expansion based on community and partner needs.

## Human governance

SafeVoice is not intended to let AI make high-impact regulatory, clinical, employment, safeguarding or enforcement decisions autonomously.

AI may assist with transcription, translation, categorisation, summarisation, policy retrieval, risk signals, routing suggestions and preparation of recommended actions.

Authorised humans remain responsible for consequential decisions, including enforcement, clinical action, safeguarding action, sanctions and closure of high-risk cases.

## Evidence-first incident record

A SafeVoice case can capture:

```text
Incident ID
Original report
Original language
Translation
Reporter consent and identity mode
Location and organisation
Domain and issue type
Risk level
Evidence attachments
AI classification and confidence
Applicable policy or rule references
Recommended action
Human reviewer
Human decision
Corrective action
Before state
After state
Verification
Escalation history
Timestamps
Audit events
```

## Integration strategy

SafeVoice is being designed as more than a standalone application.

### Human access

Web, mobile-responsive interface, voice reporting, QR entry points, accessibility modes and assisted reporting.

### Developer access

A versioned API for organisations that need to integrate SafeVoice into existing systems.

### Agent access

A Model Context Protocol server exposing tightly controlled tools such as:

```text
submit_safety_report
classify_safety_report
translate_safety_report
get_case_status
find_relevant_safety_policy
prepare_escalation
request_human_review
attach_evidence
verify_corrective_action
get_incident_timeline
get_anonymised_safety_trends
find_regulatory_route
```

High-impact actions are intentionally designed around human approval rather than autonomous AI execution.

## Architecture principle

```text
Human Reporting Channels
        ↓
Evidence Intake Layer
        ↓
Language + Accessibility Layer
        ↓
Safety Intelligence Engine
        ↓
Domain Risk Engines
        ↓
Rules / Policy / Regulatory Mapping
        ↓
Human Governance + Approval
        ↓
Routing + Escalation + Corrective Action
        ↓
Evidence Vault + Audit Trail
        ↓
Dashboards + Analytics + Integrations
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the evolving technical architecture.

## Project status

**Early-stage platform build.**

The current focus is establishing the product architecture, governance model, multilingual reporting workflow, API contract and MCP surface before connecting production integrations.

This repository intentionally does not contain real personal, clinical or incident data.

## Roadmap

### Phase 1: Foundation

- multilingual incident intake
- text and voice reporting
- original-evidence preservation
- structured case model
- human review workflow
- severity and escalation framework
- basic organisation dashboard

### Phase 2: Safety engines

- FoodSafe
- MedSafe
- HospitalitySafe
- CareSafe
- configurable rules and policy mappings
- evidence verification workflow

### Phase 3: Integrations

- public API
- MCP server
- webhook/event integration
- identity and organisation controls
- regulator and enterprise routing adapters

### Phase 4: Intelligence

- cross-case trend detection
- anonymised safety signals
- multilingual analytics
- recurring hazard detection
- governance dashboards
- policy effectiveness evidence

### Phase 5: Global platform

- country-specific regulatory mappings
- expanded language coverage
- NGO, public-sector and enterprise deployments
- low-bandwidth and assisted-access channels
- partner ecosystem and public MCP discovery

## Security and privacy direction

SafeVoice is intended for environments where reports may contain sensitive or special-category information. Security and privacy must therefore be architectural requirements, not afterthoughts.

Planned controls include data minimisation, encryption, tenant isolation, role-based access, secure evidence handling, consent tracking, retention rules, audit logging, human-approval controls and privacy-aware analytics.

See [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md).

## Repository structure

```text
docs/          Architecture, governance and product documentation
mcp/           MCP tool contracts and server specification
api/           Public API specifications
examples/      Synthetic demonstration cases
locales/       Language and localisation resources
security/      Security model and threat documentation
```

## Contributing

SafeVoice is at an early design stage. Contributions will be welcomed around accessibility, multilingual safety reporting, responsible AI, food safety, medicine safety, healthcare safety, product safety, human factors, governance and secure system design.

Please do not submit real patient, employee, whistleblower or incident data to this repository.

## Ownership

SafeVoice Intelligence is an original project initiated by **Faith Wright / Palm92 Intelligence**.

All rights are reserved unless and until an explicit licence is added to this repository.
