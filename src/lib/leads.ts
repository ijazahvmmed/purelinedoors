import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { Pool, type PoolClient } from "pg";
import { Resend } from "resend";
import { z } from "zod";

const plainText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (value) => !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value),
      "Unsupported characters",
    );
const optionalText = (max: number) => plainText(max).optional();
const postcode = z
  .string()
  .trim()
  .transform((value) => value.toUpperCase().replace(/\s/g, ""))
  .refine(
    (value) =>
      /^(?:GIR0AA|(?:[A-PR-UWYZ][0-9]{1,2}|[A-PR-UWYZ][A-HK-Y][0-9]{1,2}|[A-PR-UWYZ][0-9][A-HJKPSTUW]|[A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY])[0-9][ABD-HJLNP-UW-Z]{2})$/.test(
        value,
      ),
    "Enter a valid UK postcode",
  )
  .transform((value) => `${value.slice(0, -3)} ${value.slice(-3)}`);

export const leadSchema = z
  .object({
    submissionId: z.uuid().optional(),
    leadType: z.enum(["homeowner", "trade", "specification"]),
    name: plainText(100).refine(
      (value) => value.length >= 2,
      "Enter your name",
    ),
    email: z
      .string()
      .trim()
      .email()
      .max(254)
      .transform((value) => value.toLowerCase()),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (value) => !value || /^[+()\d\s.-]{7,30}$/.test(value),
        "Enter a valid telephone number",
      )
      .optional(),
    postcode,
    productId: z.string().trim().min(1).max(100).optional(),
    // Accepted for compatibility only; authoritative product text comes from the catalogue.
    productTitle: optionalText(200),
    configuration: z
      .record(
        z.string().regex(/^[a-zA-Z][a-zA-Z0-9 _-]{0,39}$/),
        plainText(150),
      )
      .refine(
        (value) => Object.keys(value).length <= 20,
        "Too many preferences",
      )
      .optional(),
    quantity: z.number().int().min(1).max(10000).optional(),
    company: optionalText(150),
    timeline: optionalText(150),
    message: plainText(3000).refine(
      (value) => value.length >= 10,
      "Please provide at least 10 characters about your enquiry",
    ),
    privacyConsent: z.literal(true, {
      error: "Please acknowledge the privacy notice",
    }),
    sourcePage: z
      .string()
      .max(200)
      .regex(/^\/[a-zA-Z0-9/_-]*$/, "Invalid source page"),
    attribution: z
      .object({
        utm_source: optionalText(100),
        utm_medium: optionalText(100),
        utm_campaign: optionalText(100),
        utm_content: optionalText(100),
        utm_term: optionalText(100),
      })
      .strict()
      .optional(),
    website: z.string().max(200).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.leadType === "trade") {
      if (!value.company?.trim())
        context.addIssue({
          code: "custom",
          path: ["company"],
          message: "Enter your company name",
        });
      if (!value.quantity)
        context.addIssue({
          code: "custom",
          path: ["quantity"],
          message: "Enter the approximate number of doors",
        });
    }
    if (
      value.configuration &&
      Object.keys(value.configuration).length &&
      !value.productId
    ) {
      context.addIssue({
        code: "custom",
        path: ["productId"],
        message: "Select a product for these preferences",
      });
    }
  });

export type LeadInput = z.infer<typeof leadSchema>;
export type ProductContext = {
  id: string;
  name: string;
  slug: string;
  family: string;
};
export type StoredLead = Omit<
  LeadInput,
  "submissionId" | "website" | "productTitle"
> & {
  product?: ProductContext;
  privacyAcknowledgedAt: string;
  privacyNoticeVersion: string;
};

export type DeliveryConfig = {
  databaseUrl: string;
  apiKey: string;
  from: string;
  to: string;
  origin: string;
  rateSecret: string;
  ipHeader: string;
  privacyVersion: string;
};

export function getDeliveryConfig(
  env: NodeJS.ProcessEnv = process.env,
): DeliveryConfig | null {
  if (env.LEADS_ENABLED !== "true" || env.LEADS_PRIVACY_APPROVED !== "true")
    return null;
  const {
    DATABASE_URL,
    RESEND_API_KEY,
    LEADS_FROM_EMAIL,
    LEADS_TO_EMAIL,
    NEXT_PUBLIC_SITE_URL,
    LEADS_RATE_LIMIT_SECRET,
    LEADS_TRUSTED_IP_HEADER,
    LEADS_PRIVACY_NOTICE_VERSION,
  } = env;
  if (
    !DATABASE_URL ||
    !RESEND_API_KEY ||
    !LEADS_FROM_EMAIL ||
    !LEADS_TO_EMAIL ||
    !NEXT_PUBLIC_SITE_URL ||
    !LEADS_RATE_LIMIT_SECRET ||
    LEADS_RATE_LIMIT_SECRET.length < 32 ||
    !LEADS_TRUSTED_IP_HEADER ||
    !LEADS_PRIVACY_NOTICE_VERSION
  )
    return null;
  if (
    !z.email().safeParse(LEADS_FROM_EMAIL).success ||
    !z.email().safeParse(LEADS_TO_EMAIL).success ||
    !/^[a-z0-9-]+$/.test(LEADS_TRUSTED_IP_HEADER)
  )
    return null;
  try {
    const site = new URL(NEXT_PUBLIC_SITE_URL);
    const database = new URL(DATABASE_URL);
    if (!["postgres:", "postgresql:"].includes(database.protocol)) return null;
    if (
      site.protocol !== "https:" &&
      !(
        env.NODE_ENV !== "production" &&
        site.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(site.hostname)
      )
    )
      return null;
    if (site.username || site.password) return null;
    return {
      databaseUrl: DATABASE_URL,
      apiKey: RESEND_API_KEY,
      from: LEADS_FROM_EMAIL,
      to: LEADS_TO_EMAIL,
      origin: site.origin,
      rateSecret: LEADS_RATE_LIMIT_SECRET,
      ipHeader: LEADS_TRUSTED_IP_HEADER,
      privacyVersion: LEADS_PRIVACY_NOTICE_VERSION,
    };
  } catch {
    return null;
  }
}

export function isSameOrigin(headers: Headers, origin: string): boolean {
  // Origin is mandatory for this browser-only endpoint; do not trust Host or forwarded host.
  return (
    headers.get("origin") === origin &&
    headers.get("sec-fetch-site") !== "cross-site"
  );
}

export function trustedClientIp(
  headers: Headers,
  header: string,
): string | null {
  const ip = headers.get(header)?.split(",")[0]?.trim();
  return ip && isIP(ip) ? ip : null;
}

export const MAX_LEAD_BYTES = 16_384;
export async function readBoundedJson(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (
    contentLength &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_LEAD_BYTES)
  )
    throw new LeadError(413, "Enquiry is too large");
  const reader = request.body?.getReader();
  if (!reader) throw new LeadError(400, "Missing enquiry");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > MAX_LEAD_BYTES) {
        await reader.cancel();
        throw new LeadError(413, "Enquiry is too large");
      }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (error) {
    if (error instanceof LeadError) throw error;
    throw new LeadError(400, "Invalid JSON enquiry");
  } finally {
    reader.releaseLock();
  }
}

export class LeadError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "LeadError";
  }
}

let pool: Pool | undefined;
export function getLeadPool(config: DeliveryConfig): Pool {
  // This module is server-only by its Node/pg imports; never import it into client components.
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      statement_timeout: 10000,
    });
    pool.on("error", () =>
      console.error("Private enquiry database connection error."),
    );
  }
  return pool;
}

export function prepareStoredLead(
  input: LeadInput,
  product: ProductContext | undefined,
  privacyVersion: string,
): StoredLead {
  const {
    submissionId: _submissionId,
    website: _website,
    productTitle: _untrustedTitle,
    ...fields
  } = input;
  void _submissionId;
  void _website;
  void _untrustedTitle;
  return {
    ...fields,
    product,
    privacyAcknowledgedAt: new Date().toISOString(),
    privacyNoticeVersion: privacyVersion,
  };
}

function fingerprint(value: unknown, secret: string): string {
  return createHmac("sha256", secret)
    .update(JSON.stringify(value))
    .digest("hex");
}

async function rateLimit(
  client: PoolClient,
  key: string,
  seconds: number,
  maximum: number,
): Promise<void> {
  const result = await client.query<{ attempts: number }>(
    `
    INSERT INTO pureline_private.lead_rate_limits AS buckets (bucket_key, window_start, attempts)
    VALUES ($1, to_timestamp(floor(extract(epoch FROM now()) / $2) * $2), 1)
    ON CONFLICT (bucket_key, window_start) DO UPDATE SET attempts = buckets.attempts + 1
    RETURNING attempts`,
    [key, seconds],
  );
  if (result.rows[0].attempts > maximum)
    throw new LeadError(429, "Too many enquiries. Please try again later.");
}

/** Atomically persists the private enquiry and its notification job. No success before COMMIT. */
export async function storeEnquiry(
  input: LeadInput,
  product: ProductContext | undefined,
  ip: string,
  config: DeliveryConfig,
): Promise<string> {
  const reference = input.submissionId ?? randomUUID();
  const payload = prepareStoredLead(input, product, config.privacyVersion);
  // A timestamp or a subsequently updated catalogue title must not break a client retry.
  const {
    submissionId: _id,
    productTitle: _title,
    website: _trap,
    ...identity
  } = input;
  void _id;
  void _title;
  void _trap;
  const payloadHash = fingerprint(identity, config.rateSecret);
  const client = await getLeadPool(config).connect();
  try {
    await client.query("BEGIN");
    // Serialize matching submission IDs, including when no row exists yet.
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
      [reference],
    );
    const existing = await client.query<{ payload_hash: string }>(
      "SELECT payload_hash FROM pureline_private.leads WHERE id = $1",
      [reference],
    );
    if (existing.rows.length) {
      if (existing.rows[0].payload_hash !== payloadHash)
        throw new LeadError(
          409,
          "This enquiry reference has already been used. Start a new enquiry.",
        );
      await client.query("COMMIT");
      return reference;
    }
    await rateLimit(client, `ip:${fingerprint(ip, config.rateSecret)}`, 900, 5);
    await rateLimit(
      client,
      `email:${fingerprint(input.email, config.rateSecret)}`,
      3600,
      3,
    );
    await client.query(
      "INSERT INTO pureline_private.leads (id, payload, payload_hash) VALUES ($1, $2::jsonb, $3)",
      [reference, JSON.stringify(payload), payloadHash],
    );
    const notification = {
      from: config.from,
      to: config.to,
      replyTo: payload.email,
      subject: `Pureline ${payload.leadType} enquiry — ${reference}`,
      text: notificationText(reference, payload),
    };
    // Freeze the provider payload so code/configuration changes cannot alter an idempotent retry.
    await client.query(
      "INSERT INTO pureline_private.lead_outbox (lead_id, notification) VALUES ($1, $2::jsonb)",
      [reference, JSON.stringify(notification)],
    );
    await client.query("COMMIT");
    return reference;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function notificationText(reference: string, lead: StoredLead): string {
  return [
    `New Pureline ${lead.leadType} enquiry`,
    `Reference: ${reference}`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "Not supplied"}`,
    `UK postcode: ${lead.postcode}`,
    `Company: ${lead.company || "Not supplied"}`,
    `Quantity: ${lead.quantity ?? "Not supplied"}`,
    `Timeline: ${lead.timeline || "Not supplied"}`,
    `Product: ${lead.product ? `${lead.product.name} (${lead.product.id})` : "General enquiry"}`,
    `Requested preferences (subject to confirmation): ${JSON.stringify(lead.configuration ?? {})}`,
    "",
    "Message:",
    lead.message,
    "",
    `Source: ${lead.sourcePage}`,
    `Attribution: ${JSON.stringify(lead.attribution ?? {})}`,
    `Privacy notice acknowledged: ${lead.privacyAcknowledgedAt} (${lead.privacyNoticeVersion})`,
    "This acknowledgement is not marketing consent.",
  ].join("\n");
}

type OutboxJob = {
  lead_id: string;
  notification: {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  };
  lease_token: string;
};

/** Provider acceptance is recorded as sent; it does not assert inbox delivery. */
export async function deliverEnquiry(
  reference: string,
  config: DeliveryConfig,
): Promise<"sent" | "pending"> {
  const database = getLeadPool(config);
  // Provider keys expire after 24h. Stop automatic attempts after 23h to avoid uncertain duplicate sends.
  await database.query(
    `UPDATE pureline_private.lead_outbox SET status = 'manual_review', locked_until = NULL
    WHERE lead_id = $1 AND status IN ('pending', 'sending') AND first_attempt_at < now() - interval '23 hours'
    AND (locked_until IS NULL OR locked_until < now())`,
    [reference],
  );
  const token = randomUUID();
  const claimed = await database.query<OutboxJob>(
    `
    WITH job AS (
      UPDATE pureline_private.lead_outbox SET status = 'sending', lease_token = $2,
        locked_until = now() + interval '2 minutes', first_attempt_at = COALESCE(first_attempt_at, now()),
        attempts = attempts + 1
      WHERE lead_id = $1 AND status IN ('pending', 'sending')
        AND next_attempt_at <= now() AND (locked_until IS NULL OR locked_until < now())
      RETURNING *
    ) SELECT job.lead_id, job.notification, job.lease_token FROM job`,
    [reference, token],
  );
  if (!claimed.rows.length) {
    const state = await database.query<{ status: string }>(
      "SELECT status FROM pureline_private.lead_outbox WHERE lead_id = $1",
      [reference],
    );
    return state.rows[0]?.status === "sent" ? "sent" : "pending";
  }
  const job = claimed.rows[0];
  try {
    const result = await new Resend(config.apiKey).emails.send(
      job.notification,
      {
        idempotencyKey: `pureline-enquiry-${reference}`,
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (result.error || !result.data?.id)
      throw new Error("Provider did not acknowledge notification");
    await database.query(
      `UPDATE pureline_private.lead_outbox SET status = 'sent', provider_id = $2, sent_at = now(),
      locked_until = NULL, last_error = NULL WHERE lead_id = $1 AND lease_token = $3`,
      [reference, result.data.id, token],
    );
    return "sent";
  } catch {
    // Do not store provider errors: they may contain contact details or request credentials.
    await database.query(
      `UPDATE pureline_private.lead_outbox SET status = 'pending', locked_until = NULL,
      last_error = 'Notification not confirmed; retry required',
      next_attempt_at = now() + least(attempts * interval '5 minutes', interval '1 hour')
      WHERE lead_id = $1 AND lease_token = $2`,
      [reference, token],
    );
    return "pending";
  }
}
