"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, SplitText, useGSAP, motion } from "@/lib/motion";

export function MotionRoot({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (_, contextSafe) => {
      const root = scope.current!;
      let cancelled = false;
      const media = gsap.matchMedia();
      const splits: SplitText[] = [];
      const prepare = contextSafe!(() => {
        if (cancelled) return;
        media.add(
          {
            reduced: "(prefers-reduced-motion: reduce)",
            normal: "(prefers-reduced-motion: no-preference)",
          },
          (context) => {
            const { reduced } = context.conditions!;
            root.dataset.motion = reduced ? "reduced" : "active";
            if (reduced) return;

            const heading = root.querySelector<HTMLElement>("h1");
            const hero = root.querySelector<HTMLElement>(".hero");
            const entry = gsap.timeline({ defaults: { ease: motion.ease } });
            if (heading) {
              // Mask actual typeset lines, including the existing emphasis markup.
              const split = SplitText.create(heading, {
                type: "lines",
                mask: "lines",
                linesClass: "motion-line",
                autoSplit: true,
                onSplit(self) {
                  return gsap.from(self.lines, {
                    yPercent: 105,
                    duration: hero ? 0.95 : 0.7,
                    stagger: 0.095,
                    ease: motion.ease,
                    delay: hero ? 0.08 : 0,
                    onComplete: () => {
                      heading.dataset.revealed = "true";
                    },
                  });
                },
              });
              splits.push(split);
            }
            if (hero) {
              entry
                .from(
                  ".hero-visual",
                  {
                    clipPath: "inset(0 0 12% 0)",
                    duration: 0.95,
                    ease: "power3.inOut",
                  },
                  0,
                )
                .from(
                  ".hero-parallax img",
                  { scale: 1.045, duration: 1.4 },
                  0.05,
                )
                .from(
                  ".hero-copy > p",
                  { opacity: 0, y: 12, duration: 0.6 },
                  hero.matches(".atmospheric-hero") ? 0.62 : 0.38,
                )
                .from(
                  ".hero-actions",
                  { opacity: 0, y: 8, duration: 0.55 },
                  hero.matches(".atmospheric-hero") ? 1.12 : 0.48,
                )
                .from(".hero-foot", { opacity: 0, duration: 0.5 }, 0.7);
              const brand = root.querySelector(".hero-brand");
              if (brand)
                entry.from(
                  brand,
                  {
                    clipPath: "inset(0 0 100% 0)",
                    y: 10,
                    duration: 0.9,
                    ease: motion.ease,
                  },
                  0.06,
                );
              const model = root.querySelectorAll(".hero-model, .hero-context");
              if (model.length)
                entry.from(
                  model,
                  { opacity: 0, y: 8, duration: 0.55, stagger: 0.09, clearProps: "transform" },
                  0.55,
                );
              entry.eventCallback("onComplete", () => {
                hero.dataset.revealed = "true";
              });
            } else {
              const introduction = root.querySelectorAll(
                ".page-intro > .eyebrow, .intro-row > p, .breadcrumb",
              );
              const productDetails = root.querySelectorAll(
                ".pdp-copy > p, .pdp-context",
              );
              if (introduction.length)
                entry.from(
                  introduction,
                  { opacity: 0, y: 6, stagger: 0.045, duration: 0.5 },
                  0,
                );
              if (productDetails.length)
                entry.from(
                  productDetails,
                  { opacity: 0, y: 10, duration: 0.55, stagger: 0.07 },
                  0.15,
                );
            }

            root
              .querySelectorAll<HTMLElement>("h2")
              .forEach((heading, index) => {
                if (heading.closest(".empty-state")) return;
                const words =
                  heading.closest(".manufacturing-teaser, .enquiry-banner") !==
                  null;
                const split = SplitText.create(heading, {
                  type: words ? "lines,words" : "lines",
                  mask: "lines",
                  autoSplit: true,
                  linesClass: "motion-line",
                  wordsClass: "motion-word",
                  onSplit(self) {
                    return gsap.from(words ? self.words : self.lines, {
                      yPercent: 102,
                      duration: words ? 0.7 : 0.85,
                      stagger: words ? 0.025 : 0.09,
                      ease: motion.ease,
                      scrollTrigger: {
                        id: `type-${index}`,
                        trigger: heading,
                        start: "top 91%",
                        once: true,
                      },
                      onComplete: () => {
                        heading.dataset.revealed = "true";
                      },
                    });
                  },
                });
                splits.push(split);
              });

            // A directional aperture for large imagery; hover lives on a different layer.
            root
              .querySelectorAll<HTMLElement>(
                ".story-art:not(.architecture-photo), .gallery-main, .editorial-photo, .managed-image, .family-image, .architecture-aperture, .engineering-image, .material-image",
              )
              .forEach((frame, index) => {
                if (frame.closest("[data-feature-story]")) return;
                const inset = frame.matches(".family-image")
                  ? "inset(0 0 14% 0)"
                  : "inset(0 100% 0 0)";
                gsap.from(frame, {
                  clipPath: inset,
                  duration: frame.matches(".family-image") ? 0.85 : 1.05,
                  ease: motion.imageEase,
                  scrollTrigger: {
                    id: `image-${index}`,
                    trigger: frame,
                    start: "top 92%",
                    once: true,
                  },
                  onComplete: () => {
                    frame.dataset.revealed = "true";
                  },
                });
              });

            // Feature compositions share a cue: aperture, typeset lines, then supporting copy.
            root
              .querySelectorAll<HTMLElement>("[data-feature-story]")
              .forEach((story, index) => {
                const photo = story.querySelector<HTMLElement>(
                  ".architecture-aperture, .feature-detail-image, .acoustic-media, .engineering-image",
                );
                const title = story.querySelector<HTMLElement>("h3");
                const copy = story.querySelectorAll(
                  ".feature-copy > p:not(.eyebrow), .feature-copy > .text-link, .acoustic-panel > p:not(.eyebrow), .acoustic-panel > .text-link",
                );
                const sequence = gsap.timeline({
                  defaults: { ease: motion.ease },
                  scrollTrigger: {
                    trigger: story,
                    start: "top 88%",
                    once: true,
                  },
                  onComplete: () => {
                    story.dataset.revealed = "true";
                    if (photo) photo.dataset.revealed = "true";
                  },
                });
                if (photo) {
                  sequence.from(
                    photo,
                    {
                      clipPath:
                        index % 2 ? "inset(0 0 18% 0)" : "inset(0 18% 0 0)",
                      duration: 0.95,
                      ease: motion.imageEase,
                    },
                    0,
                  );
                  const image = photo.querySelector("img");
                  if (image)
                    sequence.from(image, { scale: 1.035, duration: 1.2 }, 0);
                }
                if (copy.length)
                  gsap.from(copy, {
                    opacity: 0,
                    y: 9,
                    duration: 0.55,
                    stagger: 0.065,
                    delay: 0.2,
                    scrollTrigger: {
                      trigger: title || story,
                      start: "top 91%",
                      once: true,
                    },
                  });
                if (title) {
                  const split = SplitText.create(title, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "motion-line",
                    autoSplit: true,
                    onSplit(self) {
                      return gsap.from(self.lines, {
                        yPercent: 105,
                        duration: 0.75,
                        stagger: 0.075,
                        delay: 0.1,
                        ease: motion.ease,
                        scrollTrigger: {
                          trigger: title,
                          start: "top 91%",
                          once: true,
                        },
                        onComplete: () => {
                          title.dataset.revealed = "true";
                        },
                      });
                    },
                  });
                  splits.push(split);
                }
              });

            // Editorial beats: rows, rules and the dark manufacturing chapter have distinct paths.
            root
              .querySelectorAll<HTMLElement>(
                ".story-point, .editorial-body > section, .resource-card, .steps-strip > div:not(.steps-intro)",
              )
              .forEach((row, i) => {
                gsap.from(row, {
                  x: row.matches(".story-point") ? 16 : 0,
                  y: row.matches(".steps-strip > div") ? 12 : 0,
                  opacity: 0,
                  duration: 0.65,
                  delay: row.matches(".steps-strip > div")
                    ? (i % 3) * 0.065
                    : 0,
                  ease: motion.ease,
                  scrollTrigger: { trigger: row, start: "top 94%", once: true },
                  onComplete: () => {
                    row.dataset.revealed = "true";
                  },
                });
              });
            root
              .querySelectorAll<HTMLElement>(".journey-grid")
              .forEach((grid) => {
                gsap.from(grid.children, {
                  y: 22,
                  opacity: 0,
                  duration: 0.7,
                  stagger: 0.14,
                  ease: motion.ease,
                  scrollTrigger: {
                    trigger: grid,
                    start: "top 92%",
                    once: true,
                  },
                });
              });
            const parallax = gsap.matchMedia();
            parallax.add("(min-width: 1001px)", () => {
              root
                .querySelectorAll<HTMLElement>("[data-parallax]")
                .forEach((image) => {
                  gsap.fromTo(
                    image,
                    { y: -14 },
                    {
                      y: 18,
                      ease: "none",
                      scrollTrigger: {
                        trigger: image.parentElement,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.65,
                      },
                    },
                  );
                });
            });

            // Keyboard focus must never wait for a scroll reveal.
            const focus = contextSafe!((event: FocusEvent) => {
              const target = event.target as HTMLElement;
              const card = target.closest<HTMLElement>(
                ".product-card, .journey-card, .resource-card, .hero-actions, .hero-model",
              );
              if (card)
                gsap.to(card, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  duration: 0.12,
                  overwrite: true,
                });
              const feature = target.closest<HTMLElement>(
                "[data-feature-story]",
              );
              if (feature)
                gsap.to(
                  feature.querySelectorAll(
                    ".feature-copy > p, .feature-copy > a:not(.button), .acoustic-panel > p, .acoustic-panel > a",
                  ),
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.12,
                    overwrite: true,
                    clearProps: "transform",
                  },
                );
            });
            root.addEventListener("focusin", focus);
            // Native disclosure changes move later chapters; refresh after their layout settles.
            let disclosureFrame = 0;
            const disclosure = (event: Event) => {
              if (!(event.target instanceof HTMLDetailsElement)) return;
              cancelAnimationFrame(disclosureFrame);
              disclosureFrame = requestAnimationFrame(() =>
                ScrollTrigger.refresh(),
              );
            };
            root.addEventListener("toggle", disclosure, true);
            ScrollTrigger.refresh();
            return () => {
              root.removeEventListener("focusin", focus);
              root.removeEventListener("toggle", disclosure, true);
              cancelAnimationFrame(disclosureFrame);
              splits.splice(0).forEach((split) => split.revert());
              parallax.revert();
            };
          },
          root,
        );
      });
      // SplitText's autoSplit also handles later font and width changes.
      document.fonts.ready.then(prepare);
      return () => {
        cancelled = true;
        media.revert();
        splits.splice(0).forEach((split) => split.revert());
        delete root.dataset.motion;
      };
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div
      key={pathname}
      ref={scope}
      className="motion-root"
      data-route={pathname}
    >
      {children}
    </div>
  );
}
