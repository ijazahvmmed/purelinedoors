import "server-only";
import { createClient } from "next-sanity";

export function getCmsClient() {
  const projectId =
    process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId && !dataset) return null;
  if (!projectId || !dataset)
    throw new Error(
      "Set both SANITY_PROJECT_ID and SANITY_DATASET to enable the catalogue CMS.",
    );
  return createClient({
    projectId,
    dataset,
    apiVersion: "2026-10-01",
    perspective: "published",
    // Approval withdrawals and certificate expiry must take effect without a CDN cache delay.
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
  });
}
