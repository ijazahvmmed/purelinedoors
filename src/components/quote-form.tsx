"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { track } from "./consent";
export function QuoteForm({
  productId,
  initialType = "homeowner",
  enabled,
}: {
  productId?: string;
  initialType?: string;
  enabled: boolean;
}) {
  const [type, setType] = useState(
    ["homeowner", "trade", "specification"].includes(initialType)
      ? initialType
      : "homeowner",
  );
  const [status, setStatus] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  const submission = useRef<{ body: string; id: string } | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setStatus(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const attribution: Record<string, string> = {};
    const params = new URLSearchParams(window.location.search);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
    ].forEach((k) => {
      const v = params.get(k);
      if (v) attribution[k] = v;
    });
    const body = {
      leadType: type,
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone") || undefined,
      postcode: data.get("postcode"),
      company: type === "trade" ? data.get("company") : undefined,
      quantity: type === "trade" ? Number(data.get("quantity")) : undefined,
      message: data.get("message"),
      timeline: data.get("timeline") || undefined,
      productId,
      privacyConsent: data.get("privacyConsent") === "on",
      sourcePage: window.location.pathname,
      attribution,
      website: data.get("website") || "",
    };
    const key = JSON.stringify(body);
    if (!submission.current || submission.current.body !== key)
      submission.current = { body: key, id: crypto.randomUUID() };
    setBusy(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, submissionId: submission.current.id }),
      });
      const result = await response.json();
      if (!response.ok || !result.received) {
        if (result.fields) {
          for (const [name, messages] of Object.entries(result.fields)) {
            const field = form.elements.namedItem(name);
            if (
              field instanceof HTMLInputElement ||
              field instanceof HTMLTextAreaElement ||
              field instanceof HTMLSelectElement
            ) {
              field.setCustomValidity(
                Array.isArray(messages) ? messages.join(" ") : String(messages),
              );
              field.setAttribute("aria-invalid", "true");
            }
          }
          form.reportValidity();
        }
        setStatus({
          type: "error",
          message:
            result.error ||
            "Your enquiry could not be submitted. Your details remain in this form so you can try again.",
        });
        return;
      }
      setStatus({
        type: "success",
        message: `Your enquiry has been received. Reference: ${result.reference}.${result.notification === "pending" ? " The team notification is queued for delivery." : ""}`,
      });
      track("quote_submit_success", {
        lead_type: type,
        product_id: productId || "general",
      });
      form.reset();
      submission.current = null;
    } catch {
      setStatus({
        type: "error",
        message:
          "We could not confirm receipt. Please retry with the same details; your submission reference prevents a duplicate.",
      });
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      className="quote-form"
      onSubmit={submit}
      onInput={(e) => {
        const field = e.target;
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLTextAreaElement ||
          field instanceof HTMLSelectElement
        ) {
          field.setCustomValidity("");
          field.removeAttribute("aria-invalid");
        }
      }}
      onFocus={() => {
        if (!started.current) {
          track("start_quote", { product_id: productId || "general" });
          started.current = true;
        }
      }}
    >
      {!enabled && (
        <div className="form-alert" role="note">
          This is a design preview. Live enquiries are not connected yet. You
          can explore the form; submitting will report that the service is
          unavailable.
        </div>
      )}
      <fieldset>
        <legend>I’m enquiring about</legend>
        <div className="lead-types">
          {[
            ["homeowner", "My home"],
            ["trade", "A trade / building project"],
            ["specification", "A specification"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                name="leadType"
                type="radio"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid">
        <label className="form-field">
          Full name *
          <input
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
          />
        </label>
        <label className="form-field">
          Email address *
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label className="form-field">
          Phone number <span className="sr-only">optional</span>
          <input
            name="phone"
            type="tel"
            maxLength={30}
            autoComplete="tel"
            placeholder="Optional"
          />
        </label>
        <label className="form-field">
          UK postcode *
          <input
            name="postcode"
            required
            maxLength={12}
            autoComplete="postal-code"
            pattern="[A-Za-z]{1,2}[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa][Aa]"
            title="Enter a complete UK postcode, for example SW1A 1AA"
          />
        </label>
        {type === "trade" && (
          <>
            <label className="form-field">
              Company *
              <input
                name="company"
                required
                maxLength={150}
                autoComplete="organization"
              />
            </label>
            <label className="form-field">
              Approximate quantity *
              <input
                name="quantity"
                type="number"
                required
                min={1}
                max={10000}
                inputMode="numeric"
              />
            </label>
          </>
        )}
        <label className="form-field wide">
          Project timing
          <select name="timeline" defaultValue="">
            <option value="">Please select (optional)</option>
            <option>Exploring ideas</option>
            <option>Within 3 months</option>
            <option>3–6 months</option>
            <option>More than 6 months</option>
          </select>
        </label>
        <label className="form-field wide">
          Tell us about your project *
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={3000}
            placeholder="Your preferred design, approximate dimensions, quantities or any specification questions…"
          />
          <span className="form-hint">
            Include each model and quantity for a multiple-door enquiry.
            Measurements will need confirmation.
          </span>
        </label>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="privacy-checkbox">
        <input name="privacyConsent" type="checkbox" required />
        <span>
          I have read the <Link href="/privacy">privacy information</Link> and
          agree that my details may be used to respond to this enquiry. This
          does not subscribe me to marketing.
        </span>
      </label>
      {status && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          className={`form-alert form-${status.type}`}
        >
          {status.message}
        </div>
      )}
      <button className="button" type="submit" disabled={busy}>
        {busy ? "Submitting your enquiry…" : "Send your enquiry"}
        <ArrowUpRight size={18} />
      </button>
      <p className="small muted" style={{ marginTop: 15 }}>
        A quote request is not an order. Final specification, availability and
        commercial terms are confirmed separately.
      </p>
    </form>
  );
}
