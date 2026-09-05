import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluateSafetyRules, type RuleHit, type RiskLevel } from "./rules.js";

const server = new McpServer({
  name: "safevoice-intelligence",
  version: "0.2.0",
});

type AuditEvent = {
  at: string;
  event: string;
  actor: "reporter" | "safevoice" | "authorised_human";
  detail: string;
};

type DemoCase = {
  caseId: string;
  sourceLanguage: string;
  originalStatement: string;
  translatedStatement?: string;
  domain: string;
  issueType: string;
  priority: RiskLevel;
  status:
    | "received"
    | "awaiting_evidence"
    | "awaiting_human_review"
    | "under_review"
    | "action_recorded"
    | "verified"
    | "resolved";
  humanReviewRequired: boolean;
  ruleHits: RuleHit[];
  evidenceRequests: string[];
  humanDecision?: string;
  correctiveAction?: string;
  verification?: string;
  audit: AuditEvent[];
};

const demoCases = new Map<string, DemoCase>();

function now() {
  return new Date().toISOString();
}

function newCaseId() {
  return `SV-DEMO-${Date.now()}`;
}

function audit(caseRecord: DemoCase, event: AuditEvent["event"], actor: AuditEvent["actor"], detail: string) {
  caseRecord.audit.push({ at: now(), event, actor, detail });
}

server.registerTool(
  "submit_safety_report",
  {
    description:
      "Create a synthetic SafeVoice safety report. Demo data is held in memory only. This tool does not contact regulators, clinicians, employers or emergency services.",
    inputSchema: {
      sourceLanguage: z.string().min(2),
      originalStatement: z.string().min(5),
      translatedStatement: z.string().optional(),
    },
  },
  async ({ sourceLanguage, originalStatement, translatedStatement }) => {
    const evaluated = evaluateSafetyRules(`${originalStatement}\n${translatedStatement ?? ""}`);
    const caseId = newCaseId();
    const primaryHit = evaluated.hits[0];
    const evidenceRequests = [...new Set(evaluated.hits.flatMap((hit) => hit.evidenceRequests))];

    const caseRecord: DemoCase = {
      caseId,
      sourceLanguage,
      originalStatement,
      translatedStatement,
      domain: evaluated.primaryDomain,
      issueType: primaryHit?.issueType ?? "unclassified_safety_concern",
      priority: evaluated.overallRisk,
      status: evidenceRequests.length > 0 ? "awaiting_evidence" : "awaiting_human_review",
      humanReviewRequired: true,
      ruleHits: evaluated.hits,
      evidenceRequests,
      audit: [],
    };

    audit(caseRecord, "report_received", "reporter", "Original-language safety concern received and preserved.");
    if (translatedStatement) {
      audit(caseRecord, "translation_attached", "safevoice", "Translation stored as a derived artefact; original statement remains preserved.");
    }
    audit(
      caseRecord,
      "rules_evaluated",
      "safevoice",
      evaluated.hits.length
        ? `Matched deterministic demo rules: ${evaluated.hits.map((hit) => hit.ruleId).join(", ")}.`
        : "No deterministic demo rule matched; case remains queued for human review.",
    );

    demoCases.set(caseId, caseRecord);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...caseRecord,
              synthetic: true,
              governance: "No consequential action has been taken. Authorised human review is required.",
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "classify_safety_report",
  {
    description:
      "Run transparent MedSafe and FoodSafe demo rules against synthetic safety-report text. Outputs are safety signals only, not clinical, regulatory or enforcement decisions.",
    inputSchema: {
      statement: z.string().min(5),
      sourceLanguage: z.string().min(2),
    },
  },
  async ({ statement, sourceLanguage }) => {
    const evaluated = evaluateSafetyRules(statement);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              sourceLanguage,
              ...evaluated,
              synthetic: true,
              note: "Deterministic rule output is advisory. Human review remains required.",
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "get_case_status",
  {
    description: "Return the current state, risk card, evidence requests and audit timeline of a synthetic SafeVoice demo case.",
    inputSchema: {
      caseId: z.string().min(5),
    },
  },
  async ({ caseId }) => {
    const caseRecord = demoCases.get(caseId);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            caseRecord
              ? { ...caseRecord, found: true, synthetic: true }
              : { caseId, found: false, message: "Synthetic case not found." },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "request_human_review",
  {
    description:
      "Move a synthetic demo case into authorised human review. This tool never approves enforcement, diagnosis, sanctions or automatic closure.",
    inputSchema: {
      caseId: z.string().min(5),
      reason: z.string().min(3),
    },
  },
  async ({ caseId, reason }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, found: false }) }] };
    }
    caseRecord.status = "under_review";
    caseRecord.humanReviewRequired = true;
    audit(caseRecord, "human_review_started", "authorised_human", reason);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              caseId,
              status: caseRecord.status,
              governance: "Authorised human review has started. No high-impact action executed automatically.",
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "record_human_decision",
  {
    description:
      "Record a synthetic authorised human decision and corrective action. The decision text is supplied by the human and is not generated or approved by this tool.",
    inputSchema: {
      caseId: z.string().min(5),
      decision: z.string().min(3),
      correctiveAction: z.string().min(3),
    },
  },
  async ({ caseId, decision, correctiveAction }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, found: false }) }] };
    }
    caseRecord.humanDecision = decision;
    caseRecord.correctiveAction = correctiveAction;
    caseRecord.status = "action_recorded";
    audit(caseRecord, "human_decision_recorded", "authorised_human", decision);
    audit(caseRecord, "corrective_action_recorded", "authorised_human", correctiveAction);
    return {
      content: [{ type: "text", text: JSON.stringify({ caseId, status: caseRecord.status }, null, 2) }],
    };
  },
);

server.registerTool(
  "verify_corrective_action",
  {
    description:
      "Record human verification of a synthetic corrective action. Verification must be provided by an authorised person.",
    inputSchema: {
      caseId: z.string().min(5),
      verification: z.string().min(3),
    },
  },
  async ({ caseId, verification }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, found: false }) }] };
    }
    caseRecord.verification = verification;
    caseRecord.status = "verified";
    audit(caseRecord, "corrective_action_verified", "authorised_human", verification);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              caseId,
              status: caseRecord.status,
              verification,
              note: "Verification is recorded as a human-provided statement in this synthetic demo.",
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);

server.registerTool(
  "get_incident_timeline",
  {
    description: "Return the auditable event timeline for a synthetic SafeVoice demo case.",
    inputSchema: {
      caseId: z.string().min(5),
    },
  },
  async ({ caseId }) => {
    const caseRecord = demoCases.get(caseId);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            caseRecord ? { caseId, timeline: caseRecord.audit, found: true } : { caseId, found: false },
            null,
            2,
          ),
        },
      ],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
