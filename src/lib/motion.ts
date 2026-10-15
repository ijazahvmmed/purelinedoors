"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// One timing vocabulary; separate timelines give each composition its own cadence.
export const motion = {
  ease: "power3.out",
  imageEase: "power2.inOut",
  enter: 0.85,
  image: 1.05,
  interaction: 0.32,
  stagger: 0.075,
};
export { gsap, ScrollTrigger, SplitText, useGSAP };
