"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";

/** Native disclosure semantics and no-JS behaviour, with interruptible enhancement. */
export function HomeDisclosure({
  className,
  summary,
  children,
  active,
  onActivate,
}: {
  className: string;
  summary: ReactNode;
  children: ReactNode;
  active?: boolean;
  onActivate?: () => void;
}) {
  const root = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const desired = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const settle = () => {
    tween.current?.kill();
    tween.current = null;
    root.current!.open = desired.current;
    root.current!.dataset.phase = "idle";
    gsap.set(body.current, { clearProps: "height,opacity,overflow" });
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (query.matches && tween.current) settle();
    };
    query.addEventListener("change", change);
    return () => {
      query.removeEventListener("change", change);
      tween.current?.kill();
    };
  }, []);

  const toggle = contextSafe((event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const details = root.current!;
    const content = body.current!;
    desired.current = details.dataset.phase === "closing" || !details.open;
    onActivate?.();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }
    tween.current?.kill();
    const start = details.open ? content.getBoundingClientRect().height : 0;
    details.open = true;
    details.dataset.phase = desired.current ? "opening" : "closing";
    gsap.set(content, { height: "auto", overflow: "hidden" });
    const end = desired.current ? content.getBoundingClientRect().height : 0;
    tween.current = gsap.fromTo(content, { height: start }, {
      height: end,
      duration: desired.current ? .48 : .32,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: settle,
    });
  });

  return (
    <details ref={root} className={className} data-active={active}>
      <summary onClick={toggle} onPointerEnter={onActivate} onFocus={onActivate}>
        {summary}
      </summary>
      <div ref={body} className="home-disclosure-body">{children}</div>
    </details>
  );
}
