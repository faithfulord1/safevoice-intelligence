import assert from "node:assert/strict";
import test from "node:test";
import {
  beginDemoHumanReview,
  createDemoCase,
  recordDemoHumanDecision,
  verifyDemoCorrectiveAction,
} from "./workflow.js";

test("missing evidence stays visible but does not block immediate human review", () => {
  const record = createDemoCase({
    caseId: "SV-DEMO-TEST-1",
    sourceLanguage: "en",
    originalStatement: "This medicine appears to be past its expiry date.",
  });

  assert.equal(record.status, "awaiting_human_review");
  assert.ok(record.evidenceRequests.length > 0);
  assert.equal(record.originalStatement, "This medicine appears to be past its expiry date.");
  assert.equal(record.humanReviewRequired, true);

  beginDemoHumanReview(record, "Synthetic reviewer opens the case.");
  assert.equal(record.status, "under_review");
});

test("a decision cannot be recorded before review starts", () => {
  const record = createDemoCase({
    caseId: "SV-DEMO-TEST-2",
    sourceLanguage: "en",
    originalStatement: "I noticed an unusual safety concern.",
  });
  assert.throws(
    () => recordDemoHumanDecision(record, "reviewed", "follow up", "synthetic test"),
    /review must start/,
  );
  assert.equal(record.status, "awaiting_human_review");
});

test("verification requires a recorded action and the timeline retains rationale", () => {
  const record = createDemoCase({
    caseId: "SV-DEMO-TEST-3",
    sourceLanguage: "yo",
    originalStatement: "Oogun ti won fun mi yii dabi eni pe ojo re ti koja.",
    translatedStatement: "This medicine appears to be past its expiry date.",
  });
  assert.throws(() => verifyDemoCorrectiveAction(record, "checked"), /must be recorded/);

  beginDemoHumanReview(record, "Review fictional translation and evidence prompts.");
  recordDemoHumanDecision(
    record,
    "Request qualified review",
    "Route to a qualified reviewer",
    "The synthetic report mentions a possible expiry issue.",
  );
  verifyDemoCorrectiveAction(record, "Synthetic follow-up confirms the route was completed.");

  assert.equal(record.status, "verified");
  assert.match(record.audit[4].detail, /Rationale:/);
  assert.equal(record.audit[4].actor, "demo_human");
  assert.equal(record.originalStatement, "Oogun ti won fun mi yii dabi eni pe ojo re ti koja.");
  assert.equal(record.translatedStatement, "This medicine appears to be past its expiry date.");
});

