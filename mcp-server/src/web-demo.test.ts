import assert from "node:assert/strict";
import test from "node:test";
import { createDemoWebServer } from "./web-demo.js";

test("local synthetic web demo supports the complete review lifecycle", async (t) => {
  const server = createDemoWebServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const post = async (path: string, payload: unknown) => fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(page.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  assert.match(await page.text(), /SYNTHETIC DEMO ONLY/);

  const createdResponse = await post("/api/cases", {
    sourceLanguage: "yo",
    originalStatement: "Oogun ti won fun mi yii dabi eni pe ojo re ti koja.",
    translatedStatement: "This medicine appears to be past its expiry date.",
  });
  assert.equal(createdResponse.status, 201);
  const created = await createdResponse.json() as { case: { caseId: string; status: string; synthetic: boolean; ruleHits: unknown[] } };
  assert.match(created.case.caseId, /^SV-DEMO-/);
  assert.equal(created.case.status, "awaiting_human_review");
  assert.equal(created.case.synthetic, true);
  assert.ok(created.case.ruleHits.length > 0);

  const earlyDecision = await post(`/api/cases/${created.case.caseId}/decision`, {
    decision: "Review", correctiveAction: "Follow up", rationale: "Synthetic only",
  });
  assert.equal(earlyDecision.status, 409);

  const review = await post(`/api/cases/${created.case.caseId}/review`, { reason: "Review fictional report" });
  assert.equal(review.status, 200);
  const decision = await post(`/api/cases/${created.case.caseId}/decision`, {
    decision: "Request qualified review",
    correctiveAction: "Route to a qualified reviewer",
    rationale: "The fictional report mentions a possible expiry issue.",
  });
  assert.equal(decision.status, 200);
  const verification = await post(`/api/cases/${created.case.caseId}/verification`, {
    verification: "Synthetic follow-up was checked.",
  });
  assert.equal(verification.status, 200);
  const finalCase = await verification.json() as { case: { status: string; audit: Array<{ detail: string }> } };
  assert.equal(finalCase.case.status, "verified");
  assert.ok(finalCase.case.audit.some((event) => event.detail.includes("Rationale:")));

  const listResponse = await fetch(`${base}/api/cases`);
  const list = await listResponse.json() as { cases: Array<{ caseId: string }> };
  assert.ok(list.cases.some((item) => item.caseId === created.case.caseId));
});

test("demo API rejects unsupported languages and oversized reports", async (t) => {
  const server = createDemoWebServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const unsupported = await fetch(`${base}/api/cases`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ sourceLanguage: "ha", originalStatement: "A fictional report text." }),
  });
  assert.equal(unsupported.status, 400);
  const oversized = await fetch(`${base}/api/cases`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ sourceLanguage: "en", originalStatement: "x".repeat(15_000) }),
  });
  assert.equal(oversized.status, 400);
});

test("demo API blocks cross-origin and non-JSON mutation requests", async (t) => {
  const server = createDemoWebServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/api/cases`;
  const payload = JSON.stringify({ sourceLanguage: "en", originalStatement: "A fictional report text." });

  const crossOrigin = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://attacker.example" },
    body: payload,
  });
  assert.equal(crossOrigin.status, 403);

  const nonJson = await fetch(url, {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: payload,
  });
  assert.equal(nonJson.status, 415);

  const accepted = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", origin: `http://127.0.0.1:${address.port}` },
    body: payload,
  });
  assert.equal(accepted.status, 201);
});
