"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
type Preference = "essential" | "analytics";
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
export function track(event: string, properties: Record<string, string> = {}) {
  try {
    if (localStorage.getItem("pureline-consent") !== "analytics") return false;
  } catch {
    return false;
  }
  if (!window.gtag) return false;
  window.gtag("event", event, properties);
  return true;
}
export function ConsentControls({ analyticsId }: { analyticsId?: string }) {
  const [open, setOpen] = useState(false);
  const [preference, setPreference] = useState<Preference>("essential");
  useEffect(() => {
    try {
      const value = localStorage.getItem("pureline-consent");
      setOpen(!value);
      setPreference(value === "analytics" ? "analytics" : "essential");
    } catch {
      setOpen(true);
    }
  }, []);
  useEffect(() => {
    if (
      preference !== "analytics" ||
      !analyticsId ||
      !/^[A-Z0-9-]+$/.test(analyticsId)
    )
      return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, { send_page_view: false });
    const script = document.createElement("script");
    script.id = "pureline-analytics";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
    script.async = true;
    document.head.appendChild(script);
    window.dispatchEvent(new Event("pureline-analytics-ready"));
    return () => script.remove();
  }, [preference, analyticsId]);
  function save(value: Preference) {
    try {
      localStorage.setItem("pureline-consent", value);
    } catch {}
    if (value === "essential" && preference === "analytics") {
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      document.cookie.split(";").forEach((c) => {
        const name = c.trim().split("=")[0];
        if (name.startsWith("_ga")) {
          document.cookie = `${name}=; Max-Age=0; Path=/`;
          document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${location.hostname}`;
        }
      });
    }
    setPreference(value);
    setOpen(false);
  }
  return (
    <>
      <button className="cookie-settings" onClick={() => setOpen(true)}>
        Cookie settings
      </button>
      {open && (
        <section className="cookie-panel" aria-label="Cookie preferences">
          <div>
            <h2>A little about cookies.</h2>
            <p>
              Essential storage remembers your preferences. Optional analytics
              helps us understand how the website is used.{" "}
              <Link href="/cookies">Read our cookie notice</Link>.
            </p>
            {!analyticsId && (
              <p className="small">
                Optional analytics is not active in this preview.
              </p>
            )}
          </div>
          <div className="cookie-actions">
            <button onClick={() => save("essential")}>Essential only</button>
            <button onClick={() => save("analytics")}>Allow analytics</button>
            <button
              className="cookie-close"
              aria-label="Close cookie preferences, keep essential only"
              onClick={() => save(preference)}
            >
              ×
            </button>
          </div>
        </section>
      )}
    </>
  );
}
