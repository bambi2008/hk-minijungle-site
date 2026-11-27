import test from "node:test";
import assert from "node:assert/strict";
import nodemailer from "nodemailer";
import { createContactHandler, createLimiter } from "../server/contact.js";

const env = { VERCEL_ENV: "production", CONTACT_ENABLED: "true", CONTACT_SMTP_PASSWORD: "fictional-test-credential" };
const data = { name: "Example Person", email: "visitor@example.test", company: "", message: "A fictional test enquiry", privacy: "on", intent: "quotation", product: "canviva-one", locale: "en", website: "" };
function request(body = data, headers = {}, method = "POST") {
  return new Request("https://hkminijungle.com/api/contact", { method, headers: { origin: "https://hkminijungle.com", "content-type": "application/json", ...headers }, ...(method === "GET" ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }) });
}
function fixture(extra = {}) {
  const mails = [], logs = [];
  return { mails, logs, handle: createContactHandler({ env, allow: () => true, sendMail: async message => { mails.push(message); return { accepted: ["hello@hkminijungle.com"] }; }, log: entry => logs.push(entry), ...extra }) };
}

test("availability is false without production opt-in and a server-only credential", async () => {
  for (const config of [{}, { ...env, VERCEL_ENV: "preview" }, { ...env, CONTACT_ENABLED: "false" }, { ...env, CONTACT_SMTP_PASSWORD: "" }]) {
    const f = fixture({ env: config });
    assert.deepEqual(await (await f.handle(request(undefined, {}, "GET"))).json(), { available: false });
    assert.equal((await f.handle(request())).status, 503);
    assert.equal(f.mails.length, 0);
  }
});
test("health reveals only availability, is uncacheable, and sends nothing", async () => {
  const f = fixture();
  const response = await f.handle(request(undefined, {}, "GET"));
  assert.deepEqual(await response.json(), { available: true });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(f.mails.length, 0);
});
test("mail is addressed only to the owner; client cannot control recipients or headers", async () => {
  const f = fixture();
  const response = await f.handle(request({ ...data, to: "other@example.test", cc: "other@example.test", html: "<script>bad</script>", subject: "forged", source: "https://attacker.test/?email=secret" }));
  assert.equal(response.status, 200);
  const message = f.mails[0];
  assert.equal(message.to, "hello@hkminijungle.com");
  assert.equal(message.from.address, "hello@hkminijungle.com");
  assert.equal(message.replyTo.address, data.email);
  assert.equal(message.subject, "[Website enquiry] CANVIVA 項目查詢");
  for (const field of ["cc", "bcc", "html", "attachments"]) assert.equal(message[field], undefined);
  assert.doesNotMatch(message.text, /attacker|script|forged|fictional-test-credential/);
  assert.equal((await response.json()).ok, true);
});
test("success awaits SMTP acceptance and never means an empty accepted list", async () => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const f = fixture({ sendMail: async () => pending });
  let finished = false;
  const result = f.handle(request()).then(value => { finished = true; return value; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  release({ accepted: [] });
  assert.equal((await result).status, 502);
});
test("authorized test uses a fixed TEST label without recipient or subject selection", async () => {
  const f = fixture();
  assert.equal((await f.handle(request({ ...data, test: true, subject: "forged", to: "other@example.test" }))).status, 200);
  assert.equal(f.mails[0].subject, "[TEST] CANVIVA 網站詢盤測試");
  assert.equal(f.mails[0].to, "hello@hkminijungle.com");
  assert.equal((await f.handle(request({ ...data, test: "true" }))).status, 400);
});
test("SMTP failures do not expose errors, credentials or enquiry content", async () => {
  const f = fixture({ sendMail: async () => { throw new Error(`secret ${env.CONTACT_SMTP_PASSWORD} ${data.email}`); } });
  const response = await f.handle(request());
  assert.equal(response.status, 502);
  const evidence = JSON.stringify([await response.json(), f.logs]);
  assert.doesNotMatch(evidence, /fictional-test-credential|visitor@example|Example Person/);
  assert.match(evidence, /contact_delivery_failed/);
});
test("cross-origin, null origin and wrong methods never send mail", async () => {
  const f = fixture();
  for (const origin of ["https://attacker.test", "null", "https://hkminijungle.com.attacker.test"]) assert.equal((await f.handle(request(data, { origin }))).status, 403);
  assert.equal((await f.handle(request(data, { "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await f.handle(request(data, {}, "PUT"))).status, 405);
  assert.equal(f.mails.length, 0);
});
test("server enforces consent, email, types, enums and field sizes", async () => {
  const f = fixture();
  for (const body of [null, [], { ...data, name: "  " }, { ...data, email: "x\r\nBcc: other@example.test" }, { ...data, email: "wrong" }, { ...data, name: {} }, { ...data, name: "x".repeat(101) }, { ...data, message: "x".repeat(4001) }, { ...data, message: "" }, { ...data, privacy: "false" }, { ...data, website: "bot.test" }, { ...data, intent: "forged" }, { ...data, product: "forged" }, { ...data, locale: "forged" }, { ...data, message: "abc\u0000" }]) assert.equal((await f.handle(request(body))).status, 400);
  assert.equal(f.mails.length, 0);
});
test("JSON-only, malformed and oversized inputs fail before SMTP", async () => {
  const f = fixture();
  assert.equal((await f.handle(request(data, { "content-type": "application/x-www-form-urlencoded" }))).status, 415);
  assert.equal((await f.handle(request("{"))).status, 400);
  assert.equal((await f.handle(request(" ".repeat(16385)))).status, 413);
  assert.equal((await f.handle(request(data, { "content-length": "16385" }))).status, 413);
  assert.equal(f.mails.length, 0);
});
test("limiter blocks repeated attempts and recovers after its interval", async () => {
  let time = 0;
  const allow = createLimiter(() => time);
  assert.deepEqual([allow("a"), allow("a"), allow("a"), allow("a")], [true, true, true, false]);
  assert.equal(allow("b"), true);
  time = 600001;
  assert.equal(allow("a"), true);
  const f = fixture({ allow: () => false });
  assert.equal((await f.handle(request())).status, 429);
  assert.equal(f.mails.length, 0);
});
test("composed enquiry can be encoded by real Nodemailer without any network delivery", async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: "unix" });
  let encoded;
  const f = fixture({ sendMail: async message => {
    encoded = await transport.sendMail(message);
    return { accepted: ["hello@hkminijungle.com"] };
  } });
  assert.equal((await f.handle(request({ ...data, name: "測試姓名", message: "中英文 fictional enquiry" }))).status, 200);
  assert.deepEqual(encoded.envelope.to, ["hello@hkminijungle.com"]);
  const raw = encoded.message.toString();
  assert.match(raw, /Reply-To: visitor@example.test/);
  assert.match(raw, /Content-Type: text\/plain/);
  assert.doesNotMatch(raw, /fictional-test-credential/);
});
