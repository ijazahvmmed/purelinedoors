"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ui";
import type { Product } from "@/lib/types";
import { families } from "@/lib/content";
import { useOptimistic, useTransition } from "react";
import { MotionGrid } from "./motion-elements";
export function CatalogueBrowser({
  products,
  lockFamily,
  familyOptions = families,
}: {
  products: Product[];
  lockFamily?: string;
  familyOptions?: { slug: string; shortName: string }[];
}) {
  const query = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const q = query.get("q") || "";
  const [search, setSearch] = useOptimistic(q);
  const [, startTransition] = useTransition();
  const family = lockFamily || query.get("family") || "all";
  const style = query.get("style") || "all";
  function update(key: string, value: string) {
    const params = new URLSearchParams(query.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.replace(`${path}${params.size ? `?${params}` : ""}`, {
      scroll: false,
    });
  }
  const base = lockFamily
    ? products.filter((p) => p.family === lockFamily)
    : products;
  const matches = base.filter(
    (p) =>
      (family === "all" || p.family === family) &&
      (style === "all" || p.style === style) &&
      `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="catalogue-browser">
      <div className="filter-bar">
        <label className="search-field">
          <Search size={19} />
          <span className="sr-only">Search door designs</span>
          <input
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              startTransition(() => {
                setSearch(value);
                update("q", value);
              });
            }}
            placeholder="Find a door design…"
          />
        </label>
        <div className="filter-selects">
          <SlidersHorizontal size={17} aria-hidden="true" />
          {!lockFamily && (
            <label>
              <span className="sr-only">Collection</span>
              <select
                value={family}
                onChange={(e) => update("family", e.target.value)}
              >
                <option value="all">All collections</option>
                {familyOptions.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.shortName}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span className="sr-only">Style</span>
            <select
              value={style}
              onChange={(e) => update("style", e.target.value)}
            >
              <option value="all">All styles</option>
              {[...new Set(base.map((p) => p.style))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="results-meta">
        <p role="status" aria-live="polite">
          {matches.length} {matches.length === 1 ? "design" : "designs"} to
          explore
        </p>
        {(q || style !== "all" || (!lockFamily && family !== "all")) && (
          <button onClick={() => router.replace(path, { scroll: false })}>
            Clear filters <X size={14} />
          </button>
        )}
        <span>Find a design. Make it your starting point.</span>
      </div>
      {matches.length ? (
        <MotionGrid itemsKey={matches.map((p) => p.id).join(",")}>
          {matches.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </MotionGrid>
      ) : (
        <div className="empty-state">
          <h2>
            {base.length
              ? "A different way in."
              : "Let’s start with your requirements."}
          </h2>
          <p>
            {base.length
              ? "No designs match these filters. Try another collection or clear your search."
              : "Individual models for this family are awaiting review. Send a specification enquiry to discuss the application."}
          </p>
          {base.length ? (
            <button
              className="button"
              onClick={() => router.replace(path, { scroll: false })}
            >
              Clear filters
            </button>
          ) : (
            <a className="button" href="/request-quote?type=specification">
              Discuss the specification
            </a>
          )}
        </div>
      )}
    </div>
  );
}
