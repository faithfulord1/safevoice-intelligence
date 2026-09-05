# SafeVoice MCP Reference Server

This folder contains an early reference implementation of a SafeVoice Intelligence MCP server.

It is intentionally limited to **synthetic demonstration data** and bounded, low-risk actions.

## Available tools

### `submit_safety_report`

Creates an in-memory synthetic case and marks it for human review.

### `get_case_status`

Returns the current state of an in-memory synthetic case.

### `classify_safety_report`

Provides a basic non-clinical classification suggestion with a visible confidence value.

### `request_human_review`

Queues the synthetic case for an authorised human decision.

## Deliberately absent tools

This reference server does **not** expose tools that can:

- diagnose a patient
- instruct treatment changes
- contact emergency services
- report a person to law enforcement
- impose regulatory enforcement
- sanction an employee or supplier
- disclose protected reporter identity
- delete evidence
- close a high-risk case autonomously

These boundaries are part of the SafeVoice governance model.

## Run locally

Requirements:

- Node.js 20+
- npm

```bash
cd mcp-server
npm install
npm run build
npm start
```

For development:

```bash
npm run dev
```

The server currently uses the MCP stdio transport and stores demo cases only in process memory. Restarting it clears the cases.

## Example synthetic report

```json
{
  "sourceLanguage": "yo",
  "originalStatement": "Òògùn tí wọ́n fún mi yìí dàbí ẹni pé ọjọ́ rẹ̀ ti kọjá.",
  "domain": "medicine_safety"
}
```

Expected behaviour:

1. create a synthetic incident ID
2. preserve the original Yoruba text
3. classify the concern as a possible medicine-safety issue
4. mark it for human review
5. return no clinical or enforcement decision

## Production work still required

Before this can become a production MCP service, SafeVoice needs:

- persistent case storage
- authentication and delegated authorisation
- tenant isolation
- scoped tool permissions
- encryption and key management
- production audit logging
- evidence hashing and versioning
- abuse/rate controls
- policy/routing service
- validated multilingual transcription and translation
- formal human-review workflow
- privacy impact assessment
- security testing
- jurisdiction-specific regulatory validation
- remote MCP transport and deployment design

## MCP publication direction

The long-term objective is to publish a mature SafeVoice MCP server for discovery through the public MCP ecosystem. Registry publication should happen only after the server has stable versioning, documented authentication, production-grade privacy/security controls and clear tool safety annotations.

## Principle

> **Agent access must never become a shortcut around human accountability.**
