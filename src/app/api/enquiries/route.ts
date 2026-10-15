import { getProducts } from "@/lib/catalogue";
import {
  deliverEnquiry,
  getDeliveryConfig,
  isSameOrigin,
  LeadError,
  leadSchema,
  readBoundedJson,
  storeEnquiry,
  trustedClientIp,
} from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>,
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extraHeaders },
  });
}

export async function POST(request: Request) {
  const config = getDeliveryConfig();
  if (!config)
    return json(
      {
        received: false,
        error:
          "Online enquiries are not yet available. Your details have not been sent or saved.",
      },
      503,
    );
  if (!isSameOrigin(request.headers, config.origin))
    return json(
      {
        received: false,
        error: "Enquiries must be submitted from this website.",
      },
      403,
    );
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return json({ received: false, error: "JSON is required." }, 415);
  }
  const ip = trustedClientIp(request.headers, config.ipHeader);
  if (!ip)
    return json(
      {
        received: false,
        error:
          "Enquiries are temporarily unavailable. Your details have not been saved.",
      },
      503,
    );
  let reference: string | undefined;
  try {
    const result = leadSchema.safeParse(await readBoundedJson(request));
    if (!result.success) {
      return json(
        {
          received: false,
          error: "Please check the highlighted fields.",
          fields: result.error.flatten().fieldErrors,
        },
        422,
      );
    }
    if (result.data.website)
      return json(
        { received: false, error: "Unable to accept this enquiry." },
        422,
      );
    const product = result.data.productId
      ? (await getProducts()).find(
          (item) =>
            item.id === result.data.productId &&
            item.isPublished &&
            item.status === "verified",
        )
      : undefined;
    if (result.data.productId && !product)
      return json(
        {
          received: false,
          error:
            "That product is no longer available. Please select a current model.",
          fields: { productId: ["Select a current product"] },
        },
        422,
      );
    const productContext = product
      ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          family: product.family,
        }
      : undefined;
    reference = await storeEnquiry(result.data, productContext, ip, config);
    const notification = await deliverEnquiry(reference, config);
    return json(
      {
        received: true,
        reference,
        notification,
        message:
          notification === "sent"
            ? "Your enquiry has been received and a notification has been sent to our team."
            : "Your enquiry has been saved. Team notification is pending; please keep your reference.",
      },
      notification === "sent" ? 201 : 202,
    );
  } catch (error) {
    // A notification/database-status error after COMMIT must never encourage a duplicate submission.
    if (reference)
      return json(
        {
          received: true,
          reference,
          notification: "pending",
          message:
            "Your enquiry has been saved. Team notification is pending; please keep your reference.",
        },
        202,
      );
    if (error instanceof LeadError)
      return json(
        { received: false, error: error.message },
        error.status,
        error.status === 429 ? { "Retry-After": "3600" } : undefined,
      );
    console.error(
      "Enquiry persistence unavailable; no success response issued.",
    );
    return json(
      {
        received: false,
        error:
          "We could not confirm that your enquiry was saved. Please retry using the same enquiry reference.",
      },
      503,
    );
  }
}
