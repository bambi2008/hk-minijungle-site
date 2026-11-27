import { createHash, randomBytes, randomUUID } from "node:crypto";
import nodemailer from "nodemailer";

const MAILBOX = "hello@hkminijungle.com";
const MAX_BODY = 16 * 1024;
const origins = new Set(["https://hkminijungle.com", "https://www.hkminijungle.com"]);
const fields = { name: 100, company: 160, email: 254, phone: 60, location: 200, requirement: 800, timeline: 120, message: 4000 };
const intents = new Set(["site-assessment", "proposal", "quotation", "duo-interest", "workplace", "shoppingmall", "brand-store", "other"]);

function json(status, body, extra = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...extra } });
}

// Supplemental, instance-local protection. This is NOT a distributed rate limit.
// Entries contain salted hashes, expire after ten minutes and are bounded.
export function createLimiter(now = Date.now) {
  const salt = randomBytes(32);
  const buckets = new Map();
  let globalStart = now(), globalCount = 0;
  return (identity) => {
    const time = now();
    if (time - globalStart >= 600000) { globalStart = time; globalCount = 0; }
    for (const [key, item] of buckets) if (time - item.start >= 600000) buckets.delete(key);
    const key = createHash("sha256").update(salt).update(identity).digest("hex");
    const bucket = buckets.get(key) || { start: time, count: 0 };
    if (bucket.count >= 3 || globalCount >= 60 || (!buckets.has(key) && buckets.size >= 5000)) return false;
    bucket.count++;
    globalCount++;
    buckets.set(key, bucket);
    return true;
  };
}

async function readJson(request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY) throw new Error("too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid");
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new Error("too_large"); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function validate(body) {
  if (!body || Array.isArray(body) || typeof body !== "object") return null;
  const result = {};
  for (const [key, limit] of Object.entries(fields)) {
    const value = body[key] ?? "";
    if (typeof value !== "string" || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) return null;
    result[key] = value.trim();
  }
  if (!result.name || !result.email || !result.message || body.privacy !== "on") return null;
  if (!/^[^\s<>@,;:"\\]+@[^\s<>@,;:"\\]+\.[^\s<>@,;:"\\]+$/.test(result.email)) return null;
  if (!intents.has(body.intent) || !["", "canviva-one", "canviva-duo"].includes(body.product ?? "")) return null;
  if (!["en", "zh-hk"].includes(body.locale)) return null;
  if (body.website !== "") return null;
  if (body.test !== undefined && typeof body.test !== "boolean") return null;
  return { ...result, intent: body.intent, product: body.product || "", locale: body.locale, test: body.test === true };
}

async function sendSmtp(message, password) {
  const transport = nodemailer.createTransport({
    host: "mail.privateemail.com", port: 465, secure: true,
    auth: { user: MAILBOX, pass: password },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    disableFileAccess: true, disableUrlAccess: true,
    logger: false, debug: false,
  });
  try { return await transport.sendMail(message); }
  finally { transport.close(); }
}

export function createContactHandler({ env = process.env, sendMail = sendSmtp, allow = createLimiter(), log = (entry) => console.error(JSON.stringify(entry)) } = {}) {
  const available = () => env.VERCEL_ENV === "production" && env.CONTACT_ENABLED === "true" && Boolean(env.CONTACT_SMTP_PASSWORD);
  return async (request) => {
    if (request.method === "GET") return json(200, { available: available() });
    if (request.method !== "POST") return json(405, { error: "method" }, { Allow: "GET, POST" });
    // Only the existing public website may post. No user-defined mail recipients,
    // URLs, subjects, headers, attachments or HTML are accepted.
    if (!origins.has(request.headers.get("origin")) || request.headers.get("sec-fetch-site") === "cross-site") return json(403, { error: "origin" });
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") return json(415, { error: "content_type" });
    if (!available()) return json(503, { error: "unavailable" });
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown";
    if (!allow(ip.split(",")[0].trim().slice(0, 100))) return json(429, { error: "rate_limit" }, { "Retry-After": "600" });
    let body;
    try { body = await readJson(request); }
    catch (error) { return json(error.message === "too_large" ? 413 : 400, { error: "invalid_request" }); }
    const data = validate(body);
    if (!data) return json(400, { error: "validation" });
    const reference = randomUUID();
    const message = {
      from: { name: "HK MINIJUNGLE Website", address: MAILBOX },
      to: MAILBOX,
      replyTo: { address: data.email },
      // A test may select only this fixed label, never an arbitrary subject.
      subject: data.test ? "[TEST] CANVIVA 網站詢盤測試" : "[Website enquiry] CANVIVA 項目查詢",
      text: ["New website enquiry / 網站項目查詢", `Reference: ${reference}`, ...Object.entries(data).map(([key, value]) => `${key}: ${value}`), "Consent: enquiry response only"].join("\n\n"),
      disableFileAccess: true, disableUrlAccess: true,
    };
    try {
      const result = await sendMail(message, env.CONTACT_SMTP_PASSWORD);
      if (!result.accepted?.some(address => String(address).toLowerCase() === MAILBOX)) throw new Error("not_accepted");
      // SMTP acceptance is not proof of inbox placement. No PII or SMTP errors
      // are logged, and no automatic email is sent to the visitor.
      return json(200, { ok: true, reference });
    } catch {
      log({ event: "contact_delivery_failed", reference });
      return json(502, { error: "delivery_failed", reference });
    }
  };
}

export const handleContact = createContactHandler();
