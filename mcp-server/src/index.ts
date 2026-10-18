import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { evaluateSafetyRules } from "./rules.js";
import {
  beginDemoHumanReview,
  createDemoCase,
  recordDemoHumanDecision,
  verifyDemoCorrectiveAction,
  type DemoCase,
} from "./workflow.js";

const server = new McpServer({
  name: "safevoice-intelligence",
  version: "0.4.0",
});

const demoCases = new Map<string, DemoCase>();

server.registerTool(
  "submit_safety_report",
  {
    description:
      "Create a synthetic SafeVoice safety report. Demo data is held in memory only. Every report is immediately visible for human review even when evidence is incomplete. This demo does not authenticate reviewer identity or contact regulators, clinicians, employers or emergency services.",
    inputSchema: {
      sourceLanguage: z.string().min(2),
      originalStatement: z.string().min(5),
      translatedStatement: z.string().optional(),
    },
  },
  async ({ sourceLanguage, originalStatement, translatedStatement }) => {
    const caseRecord = createDemoCase({ sourceLanguage, originalStatement, translatedStatement });
    const caseId = caseRecord.caseId;
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
      "Move a synthetic demo case into review. This prototype does not authenticate reviewer identity. It never approves enforcement, diagnosis, sanctions or automatic closure.",
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
    try {
      beginDemoHumanReview(caseRecord, reason);
    } catch (error) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, error: String(error) }) }] };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              caseId,
              status: caseRecord.status,
              governance: "Demo review has started. Reviewer identity is not authenticated. No high-impact action executed automatically.",
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
      "Record a synthetic demo human decision and corrective action after review begins. Reviewer identity is not authenticated. The decision text is supplied by the caller and is not generated or approved by this tool.",
    inputSchema: {
      caseId: z.string().min(5),
      decision: z.string().min(3),
      correctiveAction: z.string().min(3),
      rationale: z.string().min(3),
    },
  },
  async ({ caseId, decision, correctiveAction, rationale }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, found: false }) }] };
    }
    try {
      recordDemoHumanDecision(caseRecord, decision, correctiveAction, rationale);
    } catch (error) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, error: String(error) }) }] };
    }
    return {
      content: [{ type: "text", text: JSON.stringify({ caseId, status: caseRecord.status }, null, 2) }],
    };
  },
);

server.registerTool(
  "verify_corrective_action",
  {
    description:
      "Record caller-provided verification of a synthetic corrective action after an action is recorded. This prototype does not authenticate reviewer identity.",
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
    try {
      verifyDemoCorrectiveAction(caseRecord, verification);
    } catch (error) {
      return { content: [{ type: "text", text: JSON.stringify({ caseId, error: String(error) }) }] };
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              caseId,
              status: caseRecord.status,
              verification,
              note: "Verification is recorded as a caller-provided statement in this synthetic demo; identity is not authenticated.",
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
