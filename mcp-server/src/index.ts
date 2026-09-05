import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "safevoice-intelligence",
  version: "0.1.0",
});

type DemoCase = {
  caseId: string;
  sourceLanguage: string;
  originalStatement: string;
  domain: string;
  issueType: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "received" | "awaiting_human_review" | "under_review" | "resolved";
  humanReviewRequired: boolean;
};

const demoCases = new Map<string, DemoCase>();

function newCaseId() {
  return `SV-DEMO-${Date.now()}`;
}

server.registerTool(
  "submit_safety_report",
  {
    description:
      "Create a synthetic SafeVoice safety report. This reference tool stores demo data in memory only and does not contact regulators, clinicians, employers or emergency services.",
    inputSchema: {
      sourceLanguage: z.string().min(2),
      originalStatement: z.string().min(5),
      domain: z.enum([
        "food_safety",
        "medicine_safety",
        "health_safety",
        "care_safety",
        "product_safety",
        "workplace_safety",
        "hospitality_safety",
        "community_safety",
      ]),
    },
  },
  async ({ sourceLanguage, originalStatement, domain }) => {
    const caseId = newCaseId();
    const medicineSignal = /expiry|expired|medicine|drug|òògùn/i.test(originalStatement);
    const caseRecord: DemoCase = {
      caseId,
      sourceLanguage,
      originalStatement,
      domain,
      issueType: medicineSignal ? "suspected_medicine_issue" : "unclassified_safety_concern",
      priority: medicineSignal ? "high" : "medium",
      status: "awaiting_human_review",
      humanReviewRequired: true,
    };

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
  "get_case_status",
  {
    description: "Return the status of a synthetic SafeVoice demo case.",
    inputSchema: {
      caseId: z.string().min(5),
    },
  },
  async ({ caseId }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ caseId, found: false, message: "Synthetic case not found." }),
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify({ ...caseRecord, found: true }, null, 2) }],
    };
  },
);

server.registerTool(
  "classify_safety_report",
  {
    description:
      "Provide a bounded, non-clinical classification suggestion for synthetic safety-report text. It does not make a regulatory, clinical or enforcement decision.",
    inputSchema: {
      statement: z.string().min(5),
      sourceLanguage: z.string().min(2),
    },
  },
  async ({ statement, sourceLanguage }) => {
    const medicineSignal = /expiry|expired|medicine|drug|òògùn/i.test(statement);
    const foodSignal = /food|allergen|peanut|temperature|chicken|ounjẹ/i.test(statement);

    const classification = medicineSignal
      ? { domain: "medicine_safety", priority: "high", humanReviewRequired: true }
      : foodSignal
        ? { domain: "food_safety", priority: "high", humanReviewRequired: true }
        : { domain: "unclassified", priority: "medium", humanReviewRequired: true };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              sourceLanguage,
              classification,
              confidence: medicineSignal || foodSignal ? 0.8 : 0.4,
              synthetic: true,
              note: "Classification is a recommendation only. Human review is required before consequential action.",
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
  "request_human_review",
  {
    description:
      "Mark a synthetic demo case as requiring authorised human review. This tool never approves enforcement, diagnosis, sanctions or case closure.",
    inputSchema: {
      caseId: z.string().min(5),
      reason: z.string().min(3),
    },
  },
  async ({ caseId, reason }) => {
    const caseRecord = demoCases.get(caseId);
    if (!caseRecord) {
      return {
        content: [{ type: "text", text: JSON.stringify({ caseId, found: false }) }],
      };
    }

    caseRecord.status = "awaiting_human_review";
    caseRecord.humanReviewRequired = true;
    demoCases.set(caseId, caseRecord);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              caseId,
              status: caseRecord.status,
              reason,
              governance: "Queued for authorised human review. No high-impact action executed.",
            },
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
