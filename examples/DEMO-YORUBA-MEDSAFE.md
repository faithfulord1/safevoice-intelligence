# Synthetic Demo Case: Yoruba Medicine-Safety Report

> **Synthetic demonstration only.** This case is fictional and must not be treated as medical advice, a real complaint, or evidence about any real pharmacy, medicine, patient, clinician or organisation.

## Scenario

A Yoruba-speaking user notices that a medicine supplied to them appears to have an expiry date that has already passed. They do not know which regulator, organisation or internal team should receive the concern, and they are more comfortable speaking Yoruba than completing a complex English form.

## Original report

**Language:** Yoruba

> “Òògùn tí wọ́n fún mi yìí dàbí ẹni pé ọjọ́ rẹ̀ ti kọjá. Mo fẹ́ kí ẹ ṣàyẹ̀wò rẹ̀.”

## Human-reviewed English meaning

> “This medicine they gave me appears to be past its expiry date. I would like it to be checked.”

The original Yoruba statement remains the primary evidence. Translation is stored as a separate derived artefact rather than replacing the source.

## SafeVoice intake record

```json
{
  "case_id": "SV-DEMO-MED-001",
  "synthetic": true,
  "channel": "voice",
  "source_language": "yo",
  "identity_mode": "identified",
  "original_statement_preserved": true,
  "translation_status": "human_reviewed",
  "domain": "medicine_safety",
  "issue_type": "suspected_expired_medicine",
  "initial_priority": "high",
  "human_review_required": true
}
```

## Evidence prompts

SafeVoice may ask the reporter to provide only what is necessary, such as:

- medicine name, if visible
- packaging photograph
- visible expiry date
- date supplied or purchased
- dispensing or purchase location
- whether the medicine has already been taken
- whether urgent symptoms or immediate danger are present

The system must not diagnose the person or decide clinical treatment.

## AI-assisted interpretation

```text
Potential concern: medicine may be past labelled expiry date
Domain: MedSafe
Confidence: moderate to high, subject to evidence review
Immediate platform action: preserve evidence and request authorised human review
Clinical decision: NOT delegated to AI
Regulatory/enforcement decision: NOT delegated to AI
```

## Human-governed workflow

```text
Yoruba voice report
      ↓
Original audio preserved
      ↓
Yoruba transcript created
      ↓
English translation created as separate artefact
      ↓
Medicine-safety concern structured
      ↓
Packaging / expiry evidence requested
      ↓
Authorised human review
      ↓
Correct organisational or regulatory route identified
      ↓
Reporter receives case status
      ↓
Corrective action recorded if appropriate
      ↓
Outcome verified and audit trail retained
```

## Example evidence timeline

| Time | Event | Actor | Governance note |
| --- | --- | --- | --- |
| 10:02 | Voice report received | Reporter | Original evidence preserved |
| 10:03 | Yoruba transcript generated | AI-assisted service | Derived artefact |
| 10:04 | English translation generated | AI-assisted service | Requires confidence tracking |
| 10:05 | Medicine-safety category suggested | Safety engine | Recommendation only |
| 10:07 | Packaging photograph attached | Reporter | Source evidence |
| 10:11 | Human review requested | SafeVoice workflow | Mandatory for high-risk case |
| 10:18 | Evidence reviewed | Authorised reviewer | Human decision point |
| 10:21 | Correct route selected | Authorised reviewer | No autonomous enforcement |
| 11:05 | Reporter status updated | SafeVoice | Plain-language notification |

## Accessibility principles demonstrated

- the reporter does not need to know regulatory terminology
- the reporter can begin in Yoruba
- the original language is not discarded after translation
- AI uncertainty is visible
- high-impact action requires an authorised person
- every meaningful state change is logged
- the user receives understandable status information

## Demo message

**SafeVoice turns a person's natural-language safety concern into structured, traceable action without removing human accountability.**
