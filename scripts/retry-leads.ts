import {
  deliverEnquiry,
  getDeliveryConfig,
  getLeadPool,
} from "../src/lib/leads";

async function main() {
  const config = getDeliveryConfig();
  if (!config)
    throw new Error(
      "Enquiries are disabled or incompletely configured. No notifications sent.",
    );
  const pool = getLeadPool(config);
  try {
    const pending = await pool.query<{
      lead_id: string;
    }>(`SELECT lead_id FROM pureline_private.lead_outbox
      WHERE status IN ('pending', 'sending') AND next_attempt_at <= now()
      AND (locked_until IS NULL OR locked_until < now()) ORDER BY next_attempt_at LIMIT 100`);
    let sent = 0;
    for (const job of pending.rows) {
      if ((await deliverEnquiry(job.lead_id, config)) === "sent") sent++;
    }
    await pool.query(
      "DELETE FROM pureline_private.lead_rate_limits WHERE window_start < now() - interval '2 days'",
    );
    const summary = await pool.query<{ status: string; count: string }>(
      "SELECT status, count(*) FROM pureline_private.lead_outbox GROUP BY status",
    );
    console.log(
      JSON.stringify({
        attempted: pending.rows.length,
        sent,
        queue: summary.rows,
      }),
    );
    if (
      summary.rows.some(
        (row) => row.status === "manual_review" && Number(row.count) > 0,
      )
    ) {
      console.error(
        "Enquiries require manual delivery review. Inspect the private database and provider dashboard.",
      );
      process.exitCode = 2;
    }
  } finally {
    await pool.end();
  }
}

main().catch(() => {
  console.error(
    "Enquiry retry failed. Check configuration, private database and provider availability.",
  );
  process.exitCode = 1;
});
