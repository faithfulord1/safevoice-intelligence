# SafeVoice revival brief

**Status:** early product concept with a tested synthetic MCP workflow  
**Proposed next step:** partner discovery and a simulated pilot  
**Funding ask:** not set; costs and eligibility need a delivery partner and funder guidance

## The opportunity

SafeVoice can make safety reporting easier for people who are more comfortable speaking than completing a formal form, including people who report in a language an organisation does not routinely handle. It can help an organisation preserve the original report, identify unanswered questions, and send the case to a person who can review it.

The Prompt2Voice account review highlighted a useful product lesson: a broad promise of voice, image and video generation is not enough to establish trust or operational value. SafeVoice should use voice and media as accessible ways to submit evidence, then make provenance, uncertainty, human review and follow-up visible. This is an independent product direction; it does not rely on Prompt2Voice or its API.

## First group to validate

Start discovery with one UK community food organisation, food bank or small hospitality operator that receives safety concerns from multilingual staff or service users. These are candidate settings only; no partner or endorsement is confirmed.

Use simulated scenarios first. Do not collect live reports, health details, whistleblowing disclosures or identifiable media during the prototype stage.

## Smallest useful service

1. Accept a text report or a human-prepared transcript, with the original wording preserved.
2. Keep any translation separate and label who prepared or checked it.
3. Show the relevant rule signal, open evidence questions and uncertainty without asserting a diagnosis or regulatory finding.
4. Put every case in a human-review queue immediately, even when evidence is incomplete.
5. Record review rationale, action and follow-up verification as separate timeline events.
6. Give the reporter a plain-language status and a clear emergency boundary.

Voice upload, automated transcription, translation, photo/video storage, regulator routing, identity management and live organisational integrations are outside the first simulated pilot.

## 6-week discovery and simulation pilot

| Weeks | Work | Evidence produced |
| --- | --- | --- |
| 1–2 | Interview one delivery partner and 5–8 frontline users; map the existing reporting route | Current-state map, accessibility needs, baseline response steps |
| 3 | Agree synthetic scenarios, permissions, retention and escalation boundary | Scenario pack, data-flow map, review checklist |
| 4–5 | Run tabletop exercises using synthetic English and Yoruba text cases | Completion, review timing, translation corrections, missed/unclear fields |
| 6 | Review results with the partner and decide whether to stop, revise or scope a controlled live pilot | Findings, risks, costed next-stage scope |

Participation counts and timing targets should be agreed with the partner before the pilot; they are not yet confirmed.

## Measures to agree before testing

- proportion of synthetic cases that reach the human-review queue without evidence completion;
- time from submission to a reviewer seeing the case;
- proportion of original statements retained unchanged alongside any translation;
- number and type of reviewer corrections to the structured summary;
- number of required questions that the intake fails to collect;
- user-reported clarity and accessibility;
- correct blocking of a decision made before review or verification made before action;
- privacy or safeguarding incidents (target: zero in a synthetic exercise).

## Controls and boundaries

- Synthetic data only until the partner, safeguarding route, lawful basis, privacy information, retention, access controls and incident process are approved.
- Do not present the prototype as an emergency service, medical product, regulator, clinical tool or autonomous decision maker.
- Do not show a numeric confidence score until the rules or models have been evaluated on an appropriate dataset.
- Treat translation as derived evidence and request qualified review where meaning is uncertain.
- Require qualified human review for any real safety interpretation or consequential action.
- The current MCP demo has no authentication, persistent storage, media upload, tenant isolation or external routing. Do not connect it to real cases.
- Seek a data-protection and safeguarding review before any move beyond synthetic exercises.

## Open questions for a partner

1. Which reports are currently delayed, lost or difficult to understand, and what happens after they arrive?
2. Who is authorised to review, route and verify each report, including outside normal hours?
3. Which languages and accessibility needs are common enough to test first?
4. What evidence is necessary, and what should never be collected at intake?
5. What systems, retention rules and incident procedures must an integration respect?

## Decision gate

Proceed to a live-data design only if a named partner confirms the problem, an authorised review route, participant protections, the lawful data-handling basis, security requirements and an affordable implementation path. Otherwise keep the project synthetic, change the use case or stop.
