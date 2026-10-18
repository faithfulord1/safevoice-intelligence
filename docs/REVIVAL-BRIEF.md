# SafeVoice revival brief

**Status:** working local synthetic web demo and MCP workflow; no production deployment  
**Proposed next step:** validate the workflow and Yoruba-English wording with a qualified reviewer, then scope a secure partner-backed pilot  
**Funding ask:** not set; costs and eligibility need a delivery partner and funder guidance

## The opportunity

SafeVoice can make safety reporting easier for people who are more comfortable speaking than completing a formal form, including people who report in a language an organisation does not routinely handle. It can help an organisation preserve the original report, identify unanswered questions, and send the case to a person who can review it.

The Prompt2Voice account review highlighted a useful product lesson: a broad promise of voice, image and video generation is not enough to establish trust or operational value. SafeVoice should use voice and media as accessible ways to submit evidence, then make provenance, uncertainty, human review and follow-up visible. This is an independent product direction; it does not rely on Prompt2Voice or its API.

SafeVoice is the **Language Application** layer of Palm92's existing three-part Nigeria Language AI initiative. **Language Access** handles the person's input and understandable response; **Language Assurance / VoiceGuard** checks whether language systems preserve meaning and escalate uncertainty; **SafeVoice** applies those capabilities to a safety-report workflow. Reuse those assets instead of starting another disconnected language app.

## First use case to validate

Start with synthetic Yoruba-English medicine and food-safety reports. The local web demo preserves original wording and stores an optional English rendering separately. Food-safety and community organisations in Nigeria or the UK are later partner candidates only; no partner or endorsement is confirmed. A successful smoke test does not establish language coverage or translation quality.

Use simulated scenarios first. Do not collect live reports, health details, whistleblowing disclosures or identifiable media during the prototype stage.

## Smallest useful service

1. Accept a typed English or Yoruba example, with the original wording preserved.
2. Keep any translation separate and label who prepared or checked it.
3. Use the existing VoiceGuard approach to check language identification, meaning preservation, names, dates and uncertainty before relying on a derived transcript or translation.
4. Show the relevant SafeVoice rule signal and open evidence questions without asserting a diagnosis or regulatory finding.
5. Put every case in a human-review queue immediately, even when evidence is incomplete.
6. Record review rationale, action and follow-up verification as separate timeline events.

Voice upload, automated transcription, automatic translation, photo/video storage, regulator routing, identity management and live organisational integrations are outside the current demo.

## 30-day evidence sprint

| Days | Work | Evidence produced |
| --- | --- | --- |
| Days 1–3 | Freeze one SafeVoice journey and claims; map original-language, derived-language and audit fields | Architecture, data-flow map, synthetic test plan |
| Days 4–10 | Build a text-first demonstration around the existing synthetic workflow | Working Yoruba-English scenario, immediate review state and timeline |
| Days 11–17 | Prepare a small consented or synthetic language test set with a qualified Yoruba reviewer | VoiceGuard rubric, provenance and issue log; no public score yet |
| Days 18–24 | Run the same cases through the language workflow and SafeVoice review gate | Errors, corrections, missing evidence, blocked transitions |
| Days 25–30 | Decide whether to continue, change use case or stop; cost any next phase with a real partner | Evidence summary, risks, partner questions, next-stage scope |

Reviewer availability, sample size, participation counts and timing targets remain to be agreed; they are not confirmed.

## Measures to agree before testing

- proportion of synthetic cases that reach the human-review queue without evidence completion;
- time from submission to a reviewer seeing the case;
- proportion of original statements retained unchanged alongside any translation;
- number and type of reviewer corrections to the structured summary;
- number of required questions that the intake fails to collect;
- user-reported clarity and accessibility;
- proportion of language cases where a qualified reviewer confirms or corrects the intended meaning;
- correct blocking of a decision made before review or verification made before action;
- privacy or safeguarding incidents (target: zero in a synthetic exercise).

## Controls and boundaries

- Synthetic data only until the partner, safeguarding route, lawful basis, privacy information, retention, access controls and incident process are approved.
- Do not present the prototype as an emergency service, medical product, regulator, clinical tool or autonomous decision maker.
- Do not show a numeric confidence score until the rules or models have been evaluated on an appropriate dataset.
- Treat translation as derived evidence and request qualified review where meaning is uncertain.
- Require qualified human review for any real safety interpretation or consequential action.
- The current web and MCP demos have no authentication, durable storage, media upload, tenant isolation or external routing. Do not connect them to real cases.
- Seek a data-protection and safeguarding review before any move beyond synthetic exercises.

## Open questions for a partner

1. Which reports are currently delayed, lost or difficult to understand, and what happens after they arrive?
2. Who is authorised to review, route and verify each report, including outside normal hours?
3. Which languages and accessibility needs are common enough to test first?
4. What evidence is necessary, and what should never be collected at intake?
5. What systems, retention rules and incident procedures must an integration respect?

## Near-term ecosystem opportunities

- **UNDP AI Diffusion Jobs and Tools Programme:** its partner/advisor expression of interest closes **30 October 2026**. It is a non-financial collaboration call, not a grant or procurement route. A draft contribution could describe Palm92's early-stage language assurance and SafeVoice application work without claiming validated deployments. Any submission needs Faith's review and approval. [Official call](https://www.undp.org/digital-innovation/ai-diffusion-workforce-and-tools-accelerator).
- **ATLAS Umoja AI / GSMA:** non-members can register interest and complete a participation agreement. Treat this as a collaboration route to explore, not a confirmed partnership or guaranteed access. [Official project page](https://www.gsma.com/get-involved/gsma-foundry/the-african-ai-languages-model-project/).
- **N-ATLAS National AI Innovation Challenge 2026:** the 12 October 2026 deadline has passed. Its published eligibility also requires Nigerian citizens or registered Nigerian entities. Do not prepare a late application or assume eligibility for a future cycle. [Official challenge page](https://ncair.nitda.gov.ng/naic/).

## Decision gate

Proceed to a live-data design only if a named partner confirms the problem, an authorised review route, a qualified language reviewer, participant protections, the lawful data-handling basis, security requirements and an affordable implementation path. Otherwise keep the project synthetic, change the use case or stop.
