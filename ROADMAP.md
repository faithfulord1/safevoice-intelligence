# SafeVoice Intelligence Roadmap

## North star

Build a multilingual safety-intelligence platform that makes it easier for people to report hazards in their own language and easier for responsible organisations to turn those reports into accountable action.

**Product rule:** AI may assist with understanding and recommendation. Consequential decisions remain under authorised human control.

## Phase 0: Public foundation

**Status: in progress**

- [x] public project repository
- [x] product README
- [x] initial architecture
- [x] governance principles
- [x] API direction
- [x] MCP tool contract
- [x] synthetic Yoruba MedSafe case
- [x] initial threat model
- [ ] runnable MCP scaffold
- [ ] public demo recording
- [ ] project website screenshots

### Exit criteria

A developer, safety professional or potential partner can understand the problem, architecture, governance model and integration direction without a private briefing.

## Phase 1: Reporting MVP

### User experience

- voice and text intake
- mobile-first reporting
- English and Yoruba as first validated language pair
- reporter chooses anonymous, pseudonymous or identified mode where lawful and operationally possible
- photographs and basic evidence upload
- case reference and status page
- plain-language acknowledgement

### Case engine

- incident ID generation
- original evidence preservation
- transcript and translation as separate artefacts
- issue category
- severity framework
- human-review queue
- case timeline
- corrective-action record
- verification status

### Initial verticals

1. FoodSafe
2. MedSafe
3. HospitalitySafe

### Exit criteria

A synthetic report can travel end-to-end from multilingual intake to authorised human review, action, verification and audit trail.

## Phase 2: Governed intelligence

- structured claim extraction
- configurable deterministic safety rules
- policy retrieval with source provenance
- confidence and uncertainty display
- duplicate/related incident detection
- service-level timers
- escalation workflows
- before/action/after/verification evidence model
- role-based access controls
- tenant isolation

### Exit criteria

SafeVoice can demonstrate that AI assistance is bounded by policy and human approvals rather than hidden autonomous decisions.

## Phase 3: API + MCP

### API

- versioned REST endpoints
- OAuth/token scopes
- webhook events
- organisation configuration
- case/evidence APIs
- idempotency and replay protection

### MCP

Initial tools:

- `submit_safety_report`
- `get_case_status`
- `classify_safety_report`
- `translate_safety_report`
- `find_relevant_safety_policy`
- `prepare_escalation`
- `request_human_review`
- `get_incident_timeline`

### Safety gates

No autonomous tools for clinical diagnosis, enforcement, sanctions, protected-identity disclosure or high-risk case closure.

### Exit criteria

An external authorised application or AI agent can safely submit a synthetic concern and inspect its status without gaining inappropriate privileges.

## Phase 4: Enterprise and public-sector pilots

Target pilot environments:

- hospitality groups
- food businesses
- pharmacies / medicine-safety teams
- care organisations
- healthcare non-clinical safety teams
- manufacturers
- charities and community organisations

Capabilities:

- SSO
- multi-site dashboards
- configurable routing
- retention policies
- data residency controls
- advanced access reviews
- regulatory mapping packs
- organisation-specific policy rules

## Phase 5: Global language and jurisdiction layer

- Hausa
- Igbo
- French
- Arabic
- Hindi
- Urdu
- Polish
- additional languages selected through real user need

Country packs may include:

- regulatory authorities
- reporting routes
- legal disclaimers
- emergency guidance
- retention requirements
- sector-specific controls

Translations and jurisdiction rules require human and domain validation before production reliance.

## Phase 6: Safety signal intelligence

Subject to privacy and legal controls:

- anonymised cross-case trends
- recurring hazard detection
- geographic or site-level safety signals
- repeated product/batch concerns
- time-to-resolution analytics
- escalation effectiveness
- policy effectiveness evidence

SafeVoice must not turn sensitive individual reports into uncontrolled surveillance data.

## Phase 7: Ecosystem

- public developer documentation
- reference integrations
- partner adapters
- MCP Registry publication when server maturity permits
- security disclosure process
- responsible research programme
- community language contributors with QA controls
- public synthetic demo dataset

## Commercial direction

Potential tiers:

- **Community:** accessible reporting and case tracking
- **SME:** incident dashboard and basic workflow
- **Enterprise:** multi-site governance, integrations, analytics and SSO
- **Public Sector / Regulator:** structured routing and aggregate intelligence under appropriate agreements
- **Developer:** API and MCP usage

Commercial design must not create incentives to suppress, downgrade or hide legitimate safety reports.

## Success measures

SafeVoice should optimise for outcomes such as:

- time from observation to acknowledged report
- percentage of reports that reach the right authorised team
- time to human review for high-priority cases
- percentage of actions with verification evidence
- accessibility completion rate by language/channel
- translation correction rate
- false escalation rate
- reporter status transparency
- recurrence of previously remediated hazards

Downloads, model calls and dashboard page views are secondary metrics.

## Current build priority

1. executable MCP demo
2. multilingual reporting prototype
3. FoodSafe / MedSafe deterministic demo rules
4. evidence timeline UI
5. security tests
6. public demo video
7. first partner discovery conversations
