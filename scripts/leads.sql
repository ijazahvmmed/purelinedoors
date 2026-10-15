-- Run deliberately against a private PostgreSQL database before enabling enquiries.
-- Do not expose these tables through a public API, CMS or browser database client.
BEGIN;
CREATE SCHEMA IF NOT EXISTS pureline_private;
REVOKE ALL ON SCHEMA pureline_private FROM PUBLIC;
CREATE TABLE IF NOT EXISTS pureline_private.leads (
  id uuid PRIMARY KEY,
  payload jsonb NOT NULL,
  payload_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pureline_private.lead_outbox (
  lead_id uuid PRIMARY KEY REFERENCES pureline_private.leads(id) ON DELETE CASCADE,
  notification jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'manual_review')),
  attempts integer NOT NULL DEFAULT 0,
  first_attempt_at timestamptz,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz,
  lease_token uuid,
  provider_id text,
  last_error text,
  sent_at timestamptz
);
CREATE INDEX IF NOT EXISTS lead_outbox_retry ON pureline_private.lead_outbox(next_attempt_at)
  WHERE status IN ('pending', 'sending');
CREATE TABLE IF NOT EXISTS pureline_private.lead_rate_limits (
  bucket_key text NOT NULL,
  window_start timestamptz NOT NULL,
  attempts integer NOT NULL,
  PRIMARY KEY (bucket_key, window_start)
);
REVOKE ALL ON ALL TABLES IN SCHEMA pureline_private FROM PUBLIC;
COMMIT;
