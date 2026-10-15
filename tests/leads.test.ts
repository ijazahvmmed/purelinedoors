import assert from "node:assert/strict";
import test from "node:test";
import {
  getDeliveryConfig,
  isSameOrigin,
  LeadError,
  leadSchema,
  MAX_LEAD_BYTES,
  notificationText,
  prepareStoredLead,
  readBoundedJson,
  trustedClientIp,
} from "../src/lib/leads";

const validLead = {
  leadType: "homeowner",
  name: "Alex Example",
  email: "alex@example.com",
  postcode: "sw1a1aa",
  message: "Please discuss a door for our renovation.",
  privacyConsent: true,
  sourcePage: "/request-quote",
};

test("homeowner requires neither trade fields nor a phone; UK postcode is canonicalised", () => {
  const lead = leadSchema.parse({ ...validLead, email: " Alex@Example.com " });
  assert.equal(lead.postcode, "SW1A 1AA");
  assert.equal(lead.email, "alex@example.com");
  assert.equal(lead.phone, undefined);
});

test("rejects missing acknowledgement, fake postcodes, unknown attribution and excess fields", () => {
  for (const overrides of [
    { privacyConsent: false },
    { privacyConsent: "true" },
    { postcode: "12345" },
    { postcode: "ZZ1 1ZZ" },
    { attribution: { email: "alex@example.com" } },
    { marketingConsent: true },
    { sourcePage: "https://another.example/path" },
    { sourcePage: "/request-quote?email=alex@example.com" },
    { message: "A".repeat(3001) },
    { phone: "<script>" },
    { quantity: -1 },
  ])
    assert.equal(
      leadSchema.safeParse({ ...validLead, ...overrides }).success,
      false,
      JSON.stringify(overrides),
    );
});

test("recognises representative UK postcode shapes and the GIR exception", () => {
  for (const value of [
    "M1 1AE",
    "B33 8TH",
    "CR2 6XH",
    "DN55 1PT",
    "W1A 0AX",
    "EC1A 1BB",
    "GIR 0AA",
    "BT1 5GS",
  ]) {
    assert.equal(
      leadSchema.safeParse({ ...validLead, postcode: value }).success,
      true,
      value,
    );
  }
});

test("trade requires company and integer quantity while specification remains lightweight", () => {
  assert.equal(
    leadSchema.safeParse({ ...validLead, leadType: "trade" }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...validLead,
      leadType: "trade",
      company: "  ",
      quantity: 5,
    }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...validLead,
      leadType: "trade",
      company: "Example Ltd",
      quantity: 1.5,
    }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...validLead,
      leadType: "trade",
      company: "Example Ltd",
      quantity: 12,
    }).success,
    true,
  );
  assert.equal(
    leadSchema.safeParse({ ...validLead, leadType: "specification" }).success,
    true,
  );
});

test("configuration must identify a product and cannot contain nested or unbounded values", () => {
  assert.equal(
    leadSchema.safeParse({ ...validLead, configuration: { finish: "White" } })
      .success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...validLead,
      productId: "smooth",
      configuration: { finish: { bad: true } },
    }).success,
    false,
  );
  assert.equal(
    leadSchema.safeParse({
      ...validLead,
      productId: "smooth",
      configuration: { finish: "White" },
    }).success,
    true,
  );
});

test("stored product context ignores submitted title and excludes honeypot/submission fields", () => {
  const input = leadSchema.parse({
    ...validLead,
    productId: "smooth",
    productTitle: "Forged certified fire door",
    website: "",
  });
  const product = {
    id: "smooth",
    name: "Smooth",
    family: "smooth",
    slug: "smooth",
  };
  const lead = prepareStoredLead(input, product, "2026-10-14");
  assert.equal(lead.product?.name, "Smooth");
  assert.equal("productTitle" in lead, false);
  assert.equal("website" in lead, false);
  assert.equal("submissionId" in lead, false);
  assert.equal(Number.isNaN(Date.parse(lead.privacyAcknowledgedAt)), false);
  const email = notificationText("reference", lead);
  assert.ok(email.includes("not marketing consent"));
  assert.ok(!email.includes("Forged certified fire door"));
});

const validEnv: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  LEADS_ENABLED: "true",
  LEADS_PRIVACY_APPROVED: "true",
  DATABASE_URL: "postgresql://user:password@localhost/pureline",
  RESEND_API_KEY: "test-key",
  LEADS_FROM_EMAIL: "forms@example.com",
  LEADS_TO_EMAIL: "sales@example.com",
  NEXT_PUBLIC_SITE_URL: "https://example.com",
  LEADS_RATE_LIMIT_SECRET: "x".repeat(32),
  LEADS_TRUSTED_IP_HEADER: "x-vercel-forwarded-for",
  LEADS_PRIVACY_NOTICE_VERSION: "2026-10-14",
};

test("enquiries fail closed when a deployment or privacy prerequisite is missing", () => {
  assert.ok(getDeliveryConfig(validEnv));
  for (const key of Object.keys(validEnv).filter((key) => key !== "NODE_ENV")) {
    const env = { ...validEnv };
    delete env[key];
    assert.equal(getDeliveryConfig(env), null, key);
  }
  for (const overrides of [
    { NEXT_PUBLIC_SITE_URL: "http://example.com" },
    { LEADS_TO_EMAIL: "placeholder" },
    { LEADS_ENABLED: "false" },
    { LEADS_PRIVACY_APPROVED: "false" },
    { LEADS_RATE_LIMIT_SECRET: "short" },
    { DATABASE_URL: "https://example.com" },
    { NEXT_PUBLIC_SITE_URL: "https://user:password@example.com" },
  ])
    assert.equal(getDeliveryConfig({ ...validEnv, ...overrides }), null);
});

test("origin check rejects missing/cross-site origins and never trusts Host", () => {
  assert.equal(
    isSameOrigin(
      new Headers({ origin: "https://example.com" }),
      "https://example.com",
    ),
    true,
  );
  assert.equal(
    isSameOrigin(new Headers({ host: "example.com" }), "https://example.com"),
    false,
  );
  assert.equal(
    isSameOrigin(
      new Headers({ origin: "https://example.com.evil.test" }),
      "https://example.com",
    ),
    false,
  );
  assert.equal(
    isSameOrigin(
      new Headers({
        origin: "https://example.com",
        "sec-fetch-site": "cross-site",
      }),
      "https://example.com",
    ),
    false,
  );
});

test("only configured IP header is used and it must contain an IP address", () => {
  assert.equal(
    trustedClientIp(
      new Headers({ "x-forwarded-for": "203.0.113.1" }),
      "x-trusted-ip",
    ),
    null,
  );
  assert.equal(
    trustedClientIp(
      new Headers({ "x-trusted-ip": "nonsense" }),
      "x-trusted-ip",
    ),
    null,
  );
  assert.equal(
    trustedClientIp(
      new Headers({ "x-trusted-ip": "203.0.113.1, 10.0.0.1" }),
      "x-trusted-ip",
    ),
    "203.0.113.1",
  );
});

test("bounded parser accepts JSON and rejects malformed, declared and streamed oversized bodies", async () => {
  const request = (body: string, headers?: HeadersInit) =>
    new Request("https://example.com/api/enquiries", {
      method: "POST",
      body,
      headers,
    });
  assert.deepEqual(
    await readBoundedJson(request(JSON.stringify(validLead))),
    validLead,
  );
  await assert.rejects(
    readBoundedJson(request("not-json")),
    (error: unknown) => error instanceof LeadError && error.status === 400,
  );
  await assert.rejects(
    readBoundedJson(
      request("{}", { "content-length": String(MAX_LEAD_BYTES + 1) }),
    ),
    (error: unknown) => error instanceof LeadError && error.status === 413,
  );
  await assert.rejects(
    readBoundedJson(
      request(JSON.stringify({ text: "a".repeat(MAX_LEAD_BYTES) })),
    ),
    (error: unknown) => error instanceof LeadError && error.status === 413,
  );
});

test("disabled API explicitly returns 503 without claiming receipt or storing contact details", async () => {
  const previous = process.env.LEADS_ENABLED;
  process.env.LEADS_ENABLED = "false";
  try {
    const { POST } = await import("../src/app/api/enquiries/route");
    const response = await POST(
      new Request("https://example.com/api/enquiries", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://example.com",
        },
        body: JSON.stringify(validLead),
      }),
    );
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.equal(body.received, false);
    assert.equal(body.reference, undefined);
    assert.match(body.error, /not been sent or saved/);
  } finally {
    if (previous === undefined) delete process.env.LEADS_ENABLED;
    else process.env.LEADS_ENABLED = previous;
  }
});
