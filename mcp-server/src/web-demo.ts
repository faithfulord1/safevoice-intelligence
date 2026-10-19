import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { createDemoCase, beginDemoHumanReview, recordDemoHumanDecision, verifyDemoCorrectiveAction, type DemoCase } from "./workflow.js";

const MAX_BODY_BYTES = 12_000;
const cases = new Map<string, DemoCase>();
const htmlUrl = new URL("../../demo/index.html", import.meta.url);

function sendJson(response: ServerResponse, status: number, value: unknown) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(JSON.stringify(value));
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > MAX_BODY_BYTES) throw new Error("Request body is too large.");
    chunks.push(buffer);
  }
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected a JSON object.");
  return parsed as Record<string, unknown>;
}

function requiredText(body: Record<string, unknown>, key: string, min = 3, max = 4_000) {
  const value = body[key];
  if (typeof value !== "string" || value.trim().length < min || value.length > max) {
    throw new Error(`${key} must contain ${min} to ${max} characters.`);
  }
  return value.trim();
}

function caseFromUrl(pathname: string) {
  const match = pathname.match(/^\/api\/cases\/([^/]+)(?:\/(review|decision|verification))?$/);
  if (!match) return undefined;
  let caseId: string;
  try { caseId = decodeURIComponent(match[1]); } catch { return undefined; }
  return { record: cases.get(caseId), action: match[2] };
}

export function createDemoWebServer() {
  return createServer(async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    try {
      if (request.method === "POST") {
        const host = request.headers.host;
        let localOrigin = false;
        try {
          const hostUrl = new URL(`http://${host}`);
          localOrigin = hostUrl.hostname === "127.0.0.1" || hostUrl.hostname === "localhost";
          const origin = request.headers.origin;
          if (origin && new URL(origin).origin !== hostUrl.origin) localOrigin = false;
        } catch {
          localOrigin = false;
        }
        if (!localOrigin) {
          sendJson(response, 403, { error: "ORIGIN_REJECTED", message: "Only requests from this local demo origin are accepted." });
          return;
        }
        if (!/^application\/json(?:\s*;|$)/i.test(request.headers["content-type"] ?? "")) {
          sendJson(response, 415, { error: "JSON_REQUIRED", message: "POST requests must use application/json." });
          return;
        }
      }
      if (request.method === "GET" && pathname === "/") {
        const html = await readFile(htmlUrl);
        response.writeHead(200, {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
          "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:",
          "x-content-type-options": "nosniff",
          "referrer-policy": "no-referrer",
        });
        response.end(html);
        return;
      }
      if (request.method === "GET" && pathname === "/healthz") {
        sendJson(response, 200, { ok: true, product: "SafeVoice synthetic demo", persistence: "memory-only" });
        return;
      }
      if (request.method === "GET" && pathname === "/api/cases") {
        sendJson(response, 200, { cases: [...cases.values()].map((record) => ({ ...record, synthetic: true })) });
        return;
      }
      if (request.method === "POST" && pathname === "/api/cases") {
        const body = await readJson(request);
        const sourceLanguage = requiredText(body, "sourceLanguage", 2, 8);
        if (!["en", "yo"].includes(sourceLanguage)) throw new Error("This demo accepts English (en) and Yoruba (yo) examples only.");
        const originalStatement = requiredText(body, "originalStatement", 5, 4_000);
        const translatedStatement = body.translatedStatement === undefined || body.translatedStatement === ""
          ? undefined
          : requiredText(body, "translatedStatement", 5, 4_000);
        const record = createDemoCase({ sourceLanguage, originalStatement, translatedStatement });
        cases.set(record.caseId, record);
        sendJson(response, 201, { case: { ...record, synthetic: true } });
        return;
      }
      if (request.method === "GET" && pathname.startsWith("/api/cases/")) {
        const found = caseFromUrl(pathname);
        if (!found?.record || found.action) {
          sendJson(response, 404, { error: "CASE_NOT_FOUND", message: "Synthetic demo case not found." });
          return;
        }
        sendJson(response, 200, { case: { ...found.record, synthetic: true } });
        return;
      }
      if (request.method === "POST" && pathname.startsWith("/api/cases/")) {
        const found = caseFromUrl(pathname);
        if (!found?.record || !found.action) {
          sendJson(response, 404, { error: "CASE_NOT_FOUND", message: "Synthetic demo case not found." });
          return;
        }
        const body = await readJson(request);
        if (found.action === "review") {
          beginDemoHumanReview(found.record, requiredText(body, "reason"));
        } else if (found.action === "decision") {
          recordDemoHumanDecision(
            found.record,
            requiredText(body, "decision"),
            requiredText(body, "correctiveAction"),
            requiredText(body, "rationale"),
          );
        } else {
          verifyDemoCorrectiveAction(found.record, requiredText(body, "verification"));
        }
        sendJson(response, 200, { case: { ...found.record, synthetic: true } });
        return;
      }
      sendJson(response, 404, { error: "NOT_FOUND", message: "Route not found." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Request could not be completed.";
      const status = /Cannot start review|must start before|must be recorded before/.test(message) ? 409 : 400;
      sendJson(response, status, { error: status === 409 ? "INVALID_STATE" : "INVALID_REQUEST", message });
    }
  });
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const port = Number(process.env.PORT ?? 4173);
  const server = createDemoWebServer();
  server.listen(port, "127.0.0.1", () => {
    process.stdout.write(`SafeVoice synthetic demo: http://127.0.0.1:${port}\n`);
    process.stdout.write("Localhost only. Do not enter real incident or personal data.\n");
  });
}
