"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, motion } from "@/lib/motion";

export function MotionLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1001px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const button = ref.current!;
          const label = button.querySelector(".button-label");
          const icon = button.querySelector(".button-arrow");
          const x = gsap.quickTo(label, "x", {
            duration: 0.4,
            ease: motion.ease,
          });
          const y = gsap.quickTo(label, "y", {
            duration: 0.4,
            ease: motion.ease,
          });
          const ix = gsap.quickTo(icon, "x", {
            duration: 0.35,
            ease: motion.ease,
          });
          const move = (event: PointerEvent) => {
            const rect = button.getBoundingClientRect();
            x(
              gsap.utils.clamp(
                -4,
                4,
                (event.clientX - rect.left - rect.width / 2) * 0.06,
              ),
            );
            y(
              gsap.utils.clamp(
                -2,
                2,
                (event.clientY - rect.top - rect.height / 2) * 0.08,
              ),
            );
            ix(3);
          };
          const leave = () => {
            x(0);
            y(0);
            ix(0);
          };
          button.addEventListener("pointermove", move);
          button.addEventListener("pointerleave", leave);
          button.addEventListener("blur", leave);
          return () => {
            button.removeEventListener("pointermove", move);
            button.removeEventListener("pointerleave", leave);
            button.removeEventListener("blur", leave);
          };
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );
  return (
    <Link ref={ref} href={href} className={className} data-magnetic>
      <span className="button-label">{children}</span>
      <span className="button-arrow">
        <ArrowUpRight size={17} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function MotionCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 1001px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const card = ref.current!;
          const hover = gsap
            .timeline({
              paused: true,
              defaults: { duration: 0.55, ease: motion.ease },
            })
            .to(
              card.querySelector(".product-hover-media"),
              { y: -5, scale: 1.025 },
              0,
            )
            .to(card.querySelector(".image-link"), { x: 3, y: -3 }, 0);
          const enter = () => hover.play();
          const leave = () => hover.reverse();
          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
          card.addEventListener("focusin", enter);
          card.addEventListener("focusout", leave);
          return () => {
            card.removeEventListener("pointerenter", enter);
            card.removeEventListener("pointerleave", leave);
            card.removeEventListener("focusin", enter);
            card.removeEventListener("focusout", leave);
          };
        },
      );
      return () => media.revert();
    },
    { scope: ref },
  );
  return (
    <article ref={ref} className="product-card">
      {children}
    </article>
  );
}

export function MotionGrid({
  children,
  itemsKey,
  className = "product-grid",
}: {
  children: React.ReactNode;
  itemsKey: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const grid = ref.current!;
        if (!grid.children.length) return;
        gsap.from(grid.children, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: Math.min(0.065, 0.45 / grid.children.length),
          ease: motion.ease,
          scrollTrigger: { trigger: grid, start: "top 94%", once: true },
          onComplete: () => {
            grid.dataset.revealed = "true";
          },
        });
        const focus = contextSafe!(() =>
          gsap.to(grid.children, {
            opacity: 1,
            y: 0,
            duration: 0.12,
            overwrite: true,
          }),
        );
        grid.addEventListener("focusin", focus);
        return () => grid.removeEventListener("focusin", focus);
      });
      return () => media.revert();
    },
    { scope: ref, dependencies: [itemsKey], revertOnUpdate: true },
  );
  return (
    <div ref={ref} className={className} data-motion-grid>
      {children}
    </div>
  );
}
