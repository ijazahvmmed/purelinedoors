"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent, type KeyboardEvent, type MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import { gsap, useGSAP } from "@/lib/motion";
import { ButtonLink, Eyebrow } from "./ui";

const closedCopy = "Every great space begins with an entrance.";
const openCopy = "Step into something better.";
const clamp = (value: number) => Math.max(0, Math.min(1, value));
type Drag = { id: number; x: number; y: number; value: number; lastX: number; lastTime: number; velocity: number; moved: boolean };

export function EntranceExperience() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const transition = useRef<gsap.core.Tween | null>(null);
  const progress = useRef({ value: 0 });
  const target = useRef(0);
  const drag = useRef<Drag | null>(null);
  const activePointer = useRef(-1);
  const ignoreClick = useRef(false);
  const range = useRef<HTMLInputElement>(null);
  const hitArea = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const reduced = useRef(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const { contextSafe } = useGSAP({ scope: root });

  // Only this paused timeline owns the leaf, light, photograph and changing copy.
  // It is scrubbed directly while dragging; release animates one scalar to a stop.
  const render = () => {
    const value = clamp(progress.current.value);
    timeline.current?.progress(value);
    if (range.current) {
      range.current.value = String(Math.round(value * 100));
      range.current.style.setProperty("--entrance-position", `${value * 100}%`);
      range.current.setAttribute("aria-valuetext", value === 0 ? "Closed" : value === 1 ? "Fully open" : `${Math.round(value * 100)}% open`);
    }
    if (root.current) root.current.dataset.progress = value.toFixed(3);
    const nextOpen = value >= .5;
    if (openRef.current !== nextOpen) { openRef.current = nextOpen; setOpen(nextOpen); }
  };
  const announce = () => setStatus(progress.current.value >= .5 ? `Door open. ${openCopy}` : `Door closed. ${closedCopy}`);

  const animateTo = contextSafe((value: number) => {
    target.current = clamp(value);
    transition.current?.kill();
    transition.current = gsap.to(progress.current, {
      value: target.current,
      duration: reduced.current ? .18 : .18 + .95 * Math.sqrt(Math.abs(target.current - progress.current.value)),
      ease: "power3.inOut", onUpdate: render, onComplete: announce,
    });
  });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ reduced: "(prefers-reduced-motion: reduce)", normal: "(prefers-reduced-motion: no-preference)" }, context => {
      reduced.current = !!context.conditions?.reduced;
      transition.current?.kill();
      // A changed system preference settles the current intent, including mid-drag.
      ignoreClick.current = !!drag.current;
      drag.current = null;
      root.current!.dataset.dragging = "false";
      if (hitArea.current?.hasPointerCapture(activePointer.current)) hitArea.current.releasePointerCapture(activePointer.current);
      progress.current.value = target.current;
      root.current!.dataset.reduced = String(reduced.current);
      const find = (selector: string) => root.current!.querySelector<HTMLElement>(selector)!;
      const tl = gsap.timeline({ paused: true, defaults: { duration: 1, ease: "none" } });
      tl.fromTo(find(".entrance-leaf"), { rotationY: 0, opacity: 1 }, { rotationY: reduced.current ? 0 : -82, opacity: reduced.current ? 0 : 1 }, 0)
        .fromTo(find(".entrance-interior img"), { scale: reduced.current ? 1 : 1.045, xPercent: reduced.current ? 0 : -2 }, { scale: 1, xPercent: 0 }, 0)
        .fromTo(find(".entrance-interior-shade"), { opacity: .55 }, { opacity: .04 }, 0)
        .fromTo(find(".entrance-leaf-light"), { opacity: 0 }, { opacity: reduced.current ? 0 : .18 }, 0)
        .fromTo(find(".entrance-cast-shadow"), { scaleX: 1, skewX: -12, opacity: .12 }, { scaleX: reduced.current ? 1 : .32, skewX: reduced.current ? -12 : -38, opacity: reduced.current ? .12 : .04 }, 0)
        .fromTo(find(".entrance-spill"), { opacity: 0 }, { opacity: .65 }, 0)
        .fromTo(find(".entrance-copy-closed"), { opacity: 1, y: 0 }, { opacity: 0, y: reduced.current ? 0 : -14, duration: .32 }, .12)
        .fromTo(find(".entrance-copy-open"), { opacity: 0, y: reduced.current ? 0 : 18 }, { opacity: 1, y: 0, duration: .42 }, .42);
      timeline.current = tl;
      render();
      setReady(true);
      return () => { transition.current?.kill(); tl.kill(); timeline.current = null; };
    });
    return () => { media.revert(); transition.current?.kill(); drag.current = null; };
  }, { scope: root });

  const down = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    activePointer.current = event.pointerId;
    transition.current?.kill();
    ignoreClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, value: progress.current.value, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x, dy = event.clientY - current.y;
    if (!current.moved && (Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy) * 1.15)) return;
    current.moved = true;
    transition.current?.kill();
    const elapsed = event.timeStamp - current.lastTime;
    current.velocity = elapsed > 0 ? (event.clientX - current.lastX) / elapsed : 0;
    current.lastX = event.clientX; current.lastTime = event.timeStamp;
    progress.current.value = clamp(current.value + dx / (event.currentTarget.clientWidth * .8));
    target.current = progress.current.value >= .5 ? 1 : 0;
    root.current!.dataset.dragging = "true";
    render();
  };
  const finish = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    root.current!.dataset.dragging = "false";
    ignoreClick.current = cancelled || current.moved || Math.abs(event.clientY - current.y) > 10;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (cancelled) animateTo(current.value >= .5 ? 1 : 0);
    else if (current.moved) {
      const recent = event.timeStamp - current.lastTime < 100;
      animateTo(recent && Math.abs(current.velocity) > .35 ? (current.velocity > 0 ? 1 : 0) : (progress.current.value >= .5 ? 1 : 0));
    }
  };
  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (ignoreClick.current && event.detail !== 0) { ignoreClick.current = false; return; }
    ignoreClick.current = false;
    animateTo(target.current >= .5 ? 0 : 1);
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    animateTo(event.key === "Home" ? 0 : event.key === "End" ? 1 : progress.current.value + (event.key === "ArrowRight" ? .125 : -.125));
  };

  return (
    <section ref={root} className="section entrance-experience" id="art-of-an-entrance" aria-labelledby="entrance-heading" data-progress="0" data-ready={ready}>
      <div className="entrance-editorial">
        <Eyebrow>The art of an entrance</Eyebrow>
        <h2 id="entrance-heading" data-entrance-heading aria-label={open ? openCopy : closedCopy}>
          <span className="entrance-copy-closed" aria-hidden="true">{closedCopy}</span>
          <span className="entrance-copy-open" aria-hidden="true">{openCopy}</span>
        </h2>
        <p className="entrance-introduction">A moment on the threshold. An invitation to what lies beyond. Take a closer look at Arch, an original Pureline catalogue design.</p>
        <ButtonLink href="/doors/exterior-grp">Explore the door collection</ButtonLink>
        <div className="entrance-design-note"><span>In focus / 01</span><Link href="/products/arch">Arch<ArrowUpRight size={18}/></Link><p>Arched glazing. Deep blue finish.<br/>The original catalogue artwork.</p></div>
      </div>
      <div className="entrance-demonstration">
        <div className="entrance-setting">
          <span className="entrance-setting-label" aria-hidden="true">Pureline / An entrance study</span>
          <div className="entrance-wall-return" aria-hidden="true"/>
          <div className="entrance-floor" aria-hidden="true"/>
          <div className="entrance-cast-shadow" aria-hidden="true"/>
          <div className="entrance-spill" aria-hidden="true"/>
          <div className="entrance-portal">
            <div className="entrance-interior" id="entrance-interior" role="img" aria-hidden={!open} aria-label="Sunlight crossing a quiet timber-lined architectural hall, revealed behind the opening door">
              <Image src="/images/architecture/public-interior.webp" alt="" fill sizes="(max-width:760px) 230px, 300px"/>
              <span className="entrance-interior-shade"/>
            </div>
            <div className="entrance-jamb" aria-hidden="true"/>
            <div className="entrance-perspective" aria-hidden="true">
              <div className="entrance-leaf">
                <Image className="entrance-door-art" src="/images/entrance/arch-leaf.webp" alt="" width={596} height={1214} draggable={false} sizes="(max-width:760px) 230px, 300px"/>
                <span className="entrance-leaf-light"/>
                <span className="entrance-leaf-edge"/>
              </div>
            </div>
            <button ref={hitArea} type="button" className="entrance-hit-area" disabled={!ready} aria-label={open ? "Close the Arch door" : "Open the Arch door"} aria-expanded={open} aria-controls="entrance-interior" aria-describedby="entrance-instruction entrance-keyboard" onPointerDown={down} onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)} onLostPointerCapture={event => finish(event, true)} onClick={toggle} onKeyDown={key}/>
          </div>
          <span className="entrance-threshold" aria-hidden="true"/>
          <span className="entrance-scene-index" aria-hidden="true">01 — Arch</span>
        </div>
        <div className="entrance-controls">
          <button type="button" disabled={!ready} onClick={() => animateTo(target.current >= .5 ? 0 : 1)} className="entrance-action"><span>{open ? "Close the door" : "Open the door"}</span><ArrowRight size={17} aria-hidden="true"/></button>
          <label className="entrance-range"><span className="sr-only">Door opening</span><input ref={range} type="range" min="0" max="100" step="1" defaultValue="0" disabled={!ready} aria-valuetext="Closed" onChange={event => { transition.current?.kill(); progress.current.value = Number(event.currentTarget.value) / 100; target.current = progress.current.value; render(); }} onPointerUp={announce} onKeyUp={announce}/></label>
          <p id="entrance-instruction"><MoveHorizontal size={15} aria-hidden="true"/><span className="entrance-instruction-desktop">Drag to explore</span><span className="entrance-instruction-touch">Swipe or tap to explore</span></p>
        </div>
        <p id="entrance-keyboard" className="sr-only">Press Enter or Space to open or close. Arrow keys adjust the opening. Home closes; End opens. A door opening slider is also available.</p>
        <p className="entrance-source">Arch · Original catalogue, p.10. Illustrative setting and opening motion.<br/>Interior: ready made / Pexels · Architectural inspiration.</p>
        <p role="status" aria-live="polite" className="sr-only">{status}</p>
        <noscript><details className="entrance-fallback"><summary>Open the door — view the space beyond</summary><p>{openCopy} Select again to close the view.</p></details><style>{`.entrance-hit-area,.entrance-controls{display:none!important}.entrance-experience:has(.entrance-fallback[open]) .entrance-leaf{opacity:0}.entrance-experience:has(.entrance-fallback[open]) .entrance-interior-shade{opacity:0}.entrance-experience:has(.entrance-fallback[open]) .entrance-copy-closed{opacity:0}.entrance-experience:has(.entrance-fallback[open]) .entrance-copy-open{opacity:1}`}</style></noscript>
      </div>
    </section>
  );
}
