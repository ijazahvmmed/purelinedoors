"use client";
import { useEffect, useRef } from "react";
import { track } from "./consent";
export function ProductEvents({ id }: { id: string }) {
  const sent = useRef("");
  useEffect(() => {
    const record = () => {
      if (sent.current !== id && track("view_product", { item_id: id }))
        sent.current = id;
    };
    record();
    window.addEventListener("pureline-analytics-ready", record);
    return () => window.removeEventListener("pureline-analytics-ready", record);
  }, [id]);
  return null;
}
