import { randomUUID } from "node:crypto";
import { evaluateSafetyRules, type RuleHit, type RiskLevel } from "./rules.js";

export type DemoStatus =
  | "awaiting_human_review"
  | "under_review"
  | "action_recorded"
  | "verified";

export type AuditEvent = {
  at: string;
  event: string;
  actor: "reporter" | "safevoice" | "demo_human";
  detail: string;
};

export type DemoCase = {
  caseId: string;
  sourceLanguage: string;
  originalStatement: string;
  translatedStatement?: string;
  domain: string;
  issueType: string;
  priority: RiskLevel;
  status: DemoStatus;
  humanReviewRequired: true;
  ruleHits: RuleHit[];
  evidenceRequests: string[];
  humanDecision?: string;
  correctiveAction?: string;
  verification?: string;
  audit: AuditEvent[];
};

function now() {
  return new Date().toISOString();
}

export function newDemoCaseId() {
  return `SV-DEMO-${randomUUID()}`;
}

function appendAudit(
  record: DemoCase,
  event: string,
  actor: AuditEvent["actor"],
  detail: string,
) {
  record.audit.push({ at: now(), event, actor, detail });
}

export function createDemoCase(input: {
  caseId?: string;
  sourceLanguage: string;
  originalStatement: string;
  translatedStatement?: string;
}): DemoCase {
  // Only the original wording can trigger deterministic rules. A human-entered
  // translation is unverified and must not change risk signals or prioritisation.
  const evaluated = evaluateSafetyRules(input.originalStatement);
  const evidenceRequests = [
    ...new Set(evaluated.hits.flatMap((hit) => hit.evidenceRequests)),
  ];
  const record: DemoCase = {
    caseId: input.caseId ?? newDemoCaseId(),
    sourceLanguage: input.sourceLanguage,
    originalStatement: input.originalStatement,
    translatedStatement: input.translatedStatement,
    domain: evaluated.primaryDomain,
    issueType: evaluated.hits[0]?.issueType ?? "unclassified_safety_concern",
    priority: evaluated.overallRisk,
    // Evidence prompts remain visible, but never block a reviewer from seeing a report.
    status: "awaiting_human_review",
    humanReviewRequired: true,
    ruleHits: evaluated.hits,
    evidenceRequests,
    audit: [],
  };

  appendAudit(
    record,
    "report_received",
    "reporter",
    "Original-language safety concern received and preserved.",
  );
  if (input.translatedStatement) {
    appendAudit(
      record,
      "translation_attached",
      "safevoice",
      "Translation stored as a derived artefact; original statement remains preserved.",
    );
  }
  appendAudit(
    record,
    "rules_evaluated",
    "safevoice",
    evaluated.hits.length
      ? `Matched deterministic demo rules against original wording only: ${evaluated.hits.map((hit) => hit.ruleId).join(", ")}.`
      : "No deterministic demo rule matched against original wording; case remains queued for human review.",
  );
  return record;
}

export function beginDemoHumanReview(record: DemoCase, reason: string) {
  if (record.status !== "awaiting_human_review") {
    throw new Error(`Cannot start review while case is ${record.status}.`);
  }
  record.status = "under_review";
  appendAudit(record, "human_review_started", "demo_human", reason);
  return record;
}

export function recordDemoHumanDecision(
  record: DemoCase,
  decision: string,
  correctiveAction: string,
  rationale: string,
) {
  if (record.status !== "under_review") {
    throw new Error("A demo human review must start before a decision is recorded.");
  }
  record.humanDecision = decision;
  record.correctiveAction = correctiveAction;
  record.status = "action_recorded";
  appendAudit(record, "human_decision_recorded", "demo_human", `${decision}. Rationale: ${rationale}`);
  appendAudit(record, "corrective_action_recorded", "demo_human", correctiveAction);
  return record;
}

export function verifyDemoCorrectiveAction(record: DemoCase, verification: string) {
  if (record.status !== "action_recorded") {
    throw new Error("A corrective action must be recorded before verification.");
  }
  record.verification = verification;
  record.status = "verified";
  appendAudit(record, "corrective_action_verified", "demo_human", verification);
  return record;
}
