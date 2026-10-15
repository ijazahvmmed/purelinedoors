"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { homepageBenefits } from "@/lib/homepage-benefits";
import { HomeDisclosure } from "./home-disclosure";

export function HomeBenefits() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const previous = useRef(-1);
  const desktop = useRef(false);
  const reduced = useRef(false);
  const move = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const positionPreview = contextSafe(() => {
    if (!desktop.current) return;
    const container = root.current!;
    const row = container.querySelectorAll<HTMLElement>(".benefit-row")[activeRef.current];
    const y = row.offsetTop + row.querySelector("summary")!.offsetHeight / 2 - preview.current!.offsetHeight / 2;
    if (reduced.current) {
      move.current?.tween.pause();
      gsap.set(preview.current, { y });
    } else move.current?.(y);
  });

  const selectPreview = contextSafe(() => {
    if (!desktop.current) return;
    const frames = preview.current!.querySelectorAll<HTMLElement>(".benefit-preview-frame");
    const next = frames[activeRef.current];
    const old = frames[previous.current];
    if (old !== next || Number(gsap.getProperty(next, "opacity")) < 1) {
      gsap.killTweensOf(frames);
      frames.forEach(frame => {
        if (frame !== old && frame !== next) gsap.set(frame, { opacity: 0 });
      });
      if (old && old !== next) gsap.to(old, { opacity: 0, y: -7, duration: reduced.current ? 0 : .22 });
      gsap.fromTo(next, { opacity: 0, y: 10, clipPath: "inset(8% 0 0 0)" }, {
        opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: reduced.current ? 0 : .45, ease: "power3.out",
      });
      previous.current = activeRef.current;
    }
    positionPreview();
  });

  useGSAP(() => {
    move.current = gsap.quickTo(preview.current, "y", {duration:.52, ease:"power3.out"});
    const media = gsap.matchMedia();
    media.add({ desktop: "(min-width: 1001px) and (hover: hover) and (pointer: fine)", reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
      desktop.current = !!context.conditions!.desktop;
      reduced.current = !!context.conditions!.reduced;
      if (!context.conditions!.desktop) return;
      root.current!.dataset.ready = "true";
      selectPreview();
      return () => {
        desktop.current = false;
        move.current?.tween.pause();
        delete root.current?.dataset.ready;
        if (preview.current) {
          const frames = preview.current.querySelectorAll(".benefit-preview-frame");
          gsap.killTweensOf(frames);
          gsap.set(frames, { opacity: 0 });
        }
      };
    });
    const resize = new ResizeObserver(positionPreview);
    resize.observe(root.current!);
    root.current!.querySelectorAll(".benefit-row").forEach(row => resize.observe(row));
    return () => {
      resize.disconnect();
      media.revert();
    };
  }, { scope: root });

  useGSAP(() => {
    const rows = root.current!.querySelectorAll(".benefit-row");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      let entrance: gsap.core.Tween | undefined;
      const trigger = ScrollTrigger.create({
        trigger: root.current, start: "top 96%", once: true,
        onEnter: () => {
          const entering = [...rows].filter(row => !row.contains(document.activeElement));
          entrance = gsap.from(entering, {
            clipPath: "inset(0 0 100% 0)", duration: .7, stagger: .055, ease: "power3.out",
            onComplete: () => { if (root.current) root.current.dataset.revealed = "true"; },
          });
        },
      });
      return () => { trigger.kill(); entrance?.revert(); };
    });
    return () => media.revert();
  }, { scope: root });

  function activate(index: number) {
    const row = root.current!.querySelectorAll(".benefit-row")[index];
    if (row.contains(document.activeElement)) {
      gsap.killTweensOf(row, "clipPath");
      gsap.set(row, { clearProps: "clipPath" });
    }
    activeRef.current = index;
    setActive(index);
    selectPreview();
  }

  return (
    <div ref={root} className="benefits-browser" data-selected={active}>
      <div className="benefit-list">
        {homepageBenefits.map((benefit, index) => (
          <HomeDisclosure key={benefit.title} className="benefit-row" active={active === index} onActivate={() => activate(index)} summary={
            <>
              <span className="benefit-index">{String(index + 1).padStart(2, "0")}<ArrowUpRight size={18}/></span>
              <span className="benefit-title">{benefit.title}</span>
              <span className="benefit-notes">{benefit.notes.map(note => <span key={note}>{note}</span>)}</span>
              <span className="benefit-toggle" aria-hidden="true">+</span>
            </>
          }>
            <div className="benefit-expanded">
              <div><p>{benefit.description}</p><Link href={benefit.href} className="text-link">{benefit.link}<ArrowUpRight size={17}/></Link></div>
              <figure className={`benefit-inline-image ${benefit.kind}`}>
                <Image src={benefit.image} alt={benefit.alt} width={460} height={460} sizes="(max-width:760px) 84vw, 300px"/>
                <figcaption>{benefit.caption}</figcaption>
              </figure>
            </div>
          </HomeDisclosure>
        ))}
      </div>
      <div ref={preview} className="benefit-floating-preview" aria-hidden="true">
        {homepageBenefits.map((benefit, index) => (
          <figure key={benefit.title} className={`benefit-preview-frame ${benefit.kind}`} data-preview={index}>
            <Image src={benefit.image} alt="" fill sizes="210px"/>
            <figcaption>{benefit.caption}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
