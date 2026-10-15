"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { families } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/motion";

export function CollectionMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useGSAP(
    () => {
      const element = panel.current!;
      timeline.current?.kill();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (open) {
        element.dataset.phase = "entering";
        gsap.set(element, { visibility: "visible", opacity: 1, y: 0 });
        timeline.current = gsap
          .timeline({
            onComplete: () => {
              element.dataset.phase = "open";
            },
          })
          .fromTo(
            element,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: reduced ? 0 : 0.4,
              ease: "power3.inOut",
            },
          )
          .fromTo(
            element.querySelectorAll(".collection-dropdown-grid a"),
            { opacity: 0, y: 7 },
            {
              opacity: 1,
              y: 0,
              duration: reduced ? 0 : 0.35,
              stagger: reduced ? 0 : 0.025,
              ease: "power3.out",
            },
            reduced ? 0 : 0.1,
          );
      } else if (element.dataset.phase !== "closed") {
        gsap.set(element, { visibility: "visible" });
        element.dataset.phase = "leaving";
        timeline.current = gsap
          .timeline({
            onComplete: () => {
              gsap.set(element, { visibility: "hidden" });
              element.dataset.phase = "closed";
            },
          })
          .fromTo(
            element,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -4,
              duration: reduced ? 0 : 0.18,
              ease: "power2.in",
            },
          );
      }
      return () => {
        timeline.current?.kill();
      };
    },
    { scope: root, dependencies: [open], revertOnUpdate: true },
  );
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const resized = () => {
      if (innerWidth <= 1000) setOpen(false);
    };
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (preference.matches) timeline.current?.progress(1).pause();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keys);
    window.addEventListener("resize", resized);
    preference.addEventListener("change", settle);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keys);
      window.removeEventListener("resize", resized);
      preference.removeEventListener("change", settle);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className="nav-collections"
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          setOpen(false);
      }}
    >
      <Link
        href="/doors"
        aria-current={pathname === "/doors" ? "page" : undefined}
      >
        {label}
      </Link>
      <button
        ref={toggle}
        className="collection-menu-toggle"
        aria-label="Show door collections"
        aria-controls="door-collection-menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              panel.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
            );
          }
        }}
      >
        <ChevronDown size={13} />
      </button>
      <div
        ref={panel}
        id="door-collection-menu"
        className="collection-dropdown"
        data-phase="closed"
        inert={!open}
      >
        <span className="dropdown-label">Door collections</span>
        <nav aria-label="Door collections" className="collection-dropdown-grid">
          {families.map((family) => (
            <Link
              key={family.slug}
              href={`/doors/${family.slug}`}
              onClick={() => setOpen(false)}
            >
              <span>{family.shortName}</span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </nav>
        <Link
          href="/doors"
          className="dropdown-all"
          onClick={() => setOpen(false)}
        >
          View the complete catalogue <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
