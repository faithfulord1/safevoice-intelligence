# SafeVoice in Palm92's Nigeria Language AI initiative

**Purpose:** connect existing Palm92 work without duplicating a general language model.  
**Status:** architecture and synthetic workflow only; language performance is not benchmarked.

## Three layers, one evidence path

| Layer | Existing Palm92 work | Role in SafeVoice | Current evidence |
| --- | --- | --- | --- |
| Language Access | `language-access` | Receive text or a human-prepared transcript; preserve the original wording; show a separate translation and plain-language response | SafeVoice web demo accepts English or Yoruba text and an optional derived translation in memory |
| Language Assurance | `language-assurance` / VoiceGuard | Evaluate language identification, meaning, names, dates, numbers, code-switching, pronunciation and unsafe outputs; record uncertainty and escalation | No VoiceGuard benchmark is integrated yet; no language performance claims |
| Language Application | `language-application` / SafeVoice | Apply the reviewed language workflow to a safety-report case, evidence questions and human-governed timeline | SafeVoice v0.4 local synthetic web and MCP demos; no live reports |

The product flow is:

```text
Original language report
        ↓
Original text or transcript preserved
        ↓
Translation and language checks stored separately
        ↓
SafeVoice rule signals and evidence questions
        ↓
Immediate human-review queue
        ↓
Human decision, action and verification recorded separately
```

## First controlled test

Use synthetic Yoruba-English food-safety and medicine-safety scenarios. The web demo keeps original Yoruba wording unchanged and labels any English wording as a separate, unverified rendering. A qualified Yoruba reviewer must check intended meaning before any translation result is described as validated. A single example is only a workflow smoke test, not a language benchmark.

For the first sprint, use text and human-prepared transcripts. Do not collect live voice, photo or video reports. Add automated ASR, TTS or translation only after a documented comparison shows a clear benefit, data terms are reviewed, and failure handling is tested. N-ATLAS, CommonLingua and other providers are candidate components, not current dependencies or verified integrations.

## What to measure

- Did the original report remain unchanged?
- Were language, dialect and code-switch assumptions made visible?
- Did the reviewer catch meaning changes, especially names, dates, quantities and safety terms?
- Were open evidence questions and uncertainty clear to the reviewer?
- Did any missing evidence delay immediate human review?
- Did the workflow block decisions before review and verification before action?

Report examples, reviewer corrections and limitations. Do not publish an accuracy percentage, language coverage claim or PASS label based on one case. PASS / REVIEW / FAIL should be introduced only with a written rubric, appropriate sample, qualified review and documented failure thresholds.

## Live opportunity snapshot, checked 18 October 2026

- **UNDP AI Diffusion Jobs and Tools Programme:** partner/advisor expressions of interest close 30 October 2026. This is a non-financial collaboration call; existing AI tools are not required. A truthful contribution could describe Palm92's early-stage language assurance and SafeVoice application work. No selection, funding or partnership is implied. [Official call](https://www.undp.org/digital-innovation/ai-diffusion-workforce-and-tools-accelerator).
- **ATLAS Umoja AI / GSMA:** non-members may register interest and complete a participation agreement. Treat this as an ecosystem route to explore, not a confirmed partnership. [Official project page](https://www.gsma.com/get-involved/gsma-foundry/the-african-ai-languages-model-project/).
- **N-ATLAS National AI Innovation Challenge 2026:** the 12 October deadline has passed. The published 2026 rules require Nigerian citizens or registered Nigerian entities. Reassess eligibility and dates before considering a future cycle. [Official challenge page](https://ncair.nitda.gov.ng/naic/).

No external form has been submitted and no outreach has been sent.
