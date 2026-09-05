# Security Policy

SafeVoice Intelligence is a safety-reporting and governance prototype. It is not an emergency service, clinical diagnosis tool, regulator, enforcement system, or substitute for authorised professional review.

## Security principles

- Preserve the original report and distinguish it from translations or derived analysis.
- Keep consequential actions under authorised human control.
- Use synthetic or appropriately authorised data in demonstrations.
- Never commit API keys, credentials, tokens, or private production data.
- Treat model output and deterministic rule output as advisory signals, not final decisions.
- Production deployments should add authentication, role-based access control, encrypted persistence, rate limiting, audit retention, monitoring, incident response, and approved data-retention controls.
- External integrations should use server-side secrets and least-privilege credentials.

## Reporting a vulnerability

Please report security concerns privately to the repository owner rather than publishing sensitive exploit details in a public issue.
