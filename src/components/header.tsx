"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import { MotionLink } from "./motion-elements";
import { CollectionMenu } from "./collection-menu";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark">
      <Image
        src="/brand/pureline-symbol.png"
        alt=""
        width={44}
        height={47}
        sizes="44px"
        className="wordmark-symbol"
      />
      <span>
        PURELINE<small>COMPOSITE DOORS</small>
      </span>
    </Link>
  );
}

export function Header({
  preview,
  links = navigation,
}: {
  preview: boolean;
  links?: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const header = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (pathname !== "/") return;
      const hero = document.querySelector(".hero");
      if (!hero) return;
      const setSurface = (paper: boolean) => {
        header.current!.dataset.surface = paper ? "paper" : "photo";
      };
      const trigger = ScrollTrigger.create({
        trigger: hero,
        start: "bottom top+=90",
        end: "max",
        onEnter: () => setSurface(true),
        onLeaveBack: () => setSurface(false),
        onRefresh: (self) => setSurface(self.scroll() >= self.start),
      });
      return () => trigger.kill();
    },
    { scope: header, dependencies: [pathname], revertOnUpdate: true },
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useGSAP(
    () => {
      const modal = dialog.current!;
      const content = panel.current!;
      transition.current?.kill();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const finish = () => {
        modal.close();
        modal.dataset.phase = "closed";
        button.current?.focus({ preventScroll: true });
      };
      if (open) {
        if (!modal.open) modal.showModal();
        modal.dataset.phase = "entering";
        content
          .querySelector<HTMLAnchorElement>("nav a")
          ?.focus({ preventScroll: true });
        gsap.set(content, { opacity: 1 });
        if (reduced) {
          gsap.set(content, { clearProps: "all" });
          modal.dataset.phase = "open";
          return;
        }
        transition.current = gsap
          .timeline({
            onComplete: () => {
              modal.dataset.phase = "open";
            },
          })
          .fromTo(
            content,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.62,
              ease: "power3.inOut",
            },
          )
          .fromTo(
            content.querySelectorAll(".mobile-nav a"),
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              stagger: 0.045,
              ease: "power3.out",
            },
            0.2,
          )
          .fromTo(
            content.querySelector(".menu-foot"),
            { opacity: 0 },
            { opacity: 1, duration: 0.4 },
            0.45,
          );
      } else if (modal.open) {
        modal.dataset.phase = "leaving";
        if (reduced) {
          finish();
          return;
        }
        transition.current = gsap
          .timeline({ onComplete: finish })
          .to(content.querySelectorAll(".mobile-nav a"), {
            y: -9,
            duration: 0.2,
            stagger: 0.015,
            ease: "power2.in",
          })
          .to(
            content,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.38,
              ease: "power3.inOut",
            },
            0.06,
          );
      }
    },
    { scope: panel, dependencies: [open] },
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(
          header.current!.querySelectorAll(".wordmark, .desktop-nav > a"),
          {
            y: 5,
            duration: 0.55,
            stagger: 0.025,
            ease: "power3.out",
          },
        );
      });
      const resize = () => {
        if (window.innerWidth > 1000) setOpen(false);
      };
      window.addEventListener("resize", resize);
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const settle = () => {
        if (preference.matches) transition.current?.progress(1).pause();
      };
      preference.addEventListener("change", settle);
      return () => {
        media.revert();
        transition.current?.kill();
        dialog.current?.close();
        window.removeEventListener("resize", resize);
        preference.removeEventListener("change", settle);
      };
    },
    { scope: header },
  );

  return (
    <>
      <div className={`utility ${pathname === "/" ? "utility-home" : ""}`}>
        <span>Considered design. A welcoming entrance.</span>
        <div>
          <Link href="/trade-projects">
            Trade & project enquiries <ArrowUpRight size={12} />
          </Link>
          <span className="utility-divider" />
          <span>{preview ? "UK catalogue preview" : "United Kingdom"}</span>
        </div>
      </div>
      <header
        ref={header}
        className="site-header"
        data-home={pathname === "/"}
        data-surface={pathname === "/" ? "photo" : "paper"}
      >
        <Wordmark />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) =>
            link.href === "/doors" ? (
              <CollectionMenu key={link.href} label={link.label} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <MotionLink href="/request-quote" className="header-quote">
          Request a quote
        </MotionLink>
        <button
          ref={button}
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          <span>Menu</span>
          <Menu size={19} />
        </button>
      </header>
      <noscript>
        <style>{`
          .site-header[data-home="true"][data-surface] {position:relative;top:auto;left:auto;right:auto;width:100%;background:var(--paper);color:var(--ink);border-color:var(--line)}
          .site-header[data-home="true"][data-surface] .wordmark {color:var(--forest)}
          .site-header[data-home="true"][data-surface] .wordmark-symbol {filter:none}
          .site-header[data-home="true"][data-surface] .header-quote {background:var(--forest);border-color:var(--forest);color:white}
          .menu-button {display:none}
          .fallback-nav {display:flex;flex-wrap:wrap;gap:12px 24px;padding:20px var(--gutter);border-bottom:1px solid var(--line);font-size:13px;background:var(--paper)}
        `}</style>
        <nav aria-label="Full navigation" className="fallback-nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </noscript>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-label="Site navigation"
        onCancel={(event) => {
          event.preventDefault();
          setOpen(false);
        }}
      >
        <div ref={panel} className="menu-panel">
          <div className="menu-masthead">
            <Wordmark />
            <button
              className="menu-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              Close <X size={20} />
            </button>
          </div>
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="mobile-nav"
          >
            {[
              ...links,
              { label: "Applications", href: "/applications" },
              { label: "Contact", href: "/contact" },
            ].map((link, index) => (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                <span className="menu-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{link.label}</span>
                <ArrowUpRight size={23} />
              </Link>
            ))}
          </nav>
          <div className="menu-foot">
            <p>Thoughtful design. Inside and out.</p>
            <Link href="/request-quote" onClick={() => setOpen(false)}>
              Discuss your project <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
