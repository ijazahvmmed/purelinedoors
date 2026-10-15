"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "./consent";
export function AnalyticsEvents() {
  const pathname = usePathname();
  const previous = useRef("");
  useEffect(() => {
    const record = () => {
      if (
        previous.current !== pathname &&
        track("page_view", { page_path: pathname })
      )
        previous.current = pathname;
    };
    record();
    window.addEventListener("pureline-analytics-ready", record);
    return () => window.removeEventListener("pureline-analytics-ready", record);
  }, [pathname]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("/products/"))
        track("select_item", { item_id: href.split("/").pop() || "" });
      else if (href.startsWith("/api/downloads/"))
        track("brochure_download", {
          document_id: href.split("/").pop() || "",
        });
      else if (href.startsWith("mailto:") || href.startsWith("tel:"))
        track("contact_click", { contact_type: href.split(":")[0] });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
