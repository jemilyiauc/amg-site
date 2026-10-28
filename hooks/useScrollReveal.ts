"use client";

import { useEffect } from "react";

// Ported from the original main.ts; selectors and delays are unchanged.
const REVEAL_TARGETS = [
  "#hero h1",
  ".hero-sub",
  "#hero .btn-primary",
  "#portfolio h2",
  ".marquee-wrapper",
  "#curated h2",
  ".card",
  ".section-label",
  "#approach p",
  "#unlock h2",
  "#explore h2",
  "#explore p",
  "#explore .btn-primary",
  ".stat",
];

const getDelay = (el: HTMLElement): number => {
  if (el.matches("#unlock li")) {
    return Array.from(el.parentElement?.children ?? []).indexOf(el) * 300;
  }
  if (el.matches(".card, .stat")) {
    return Array.from(el.parentElement?.children ?? []).indexOf(el) * 70;
  }
  if (el.closest("#hero")) {
    return ["H1", "P", "A"].indexOf(el.tagName) * 90;
  }
  return 0;
};

export const useScrollReveal = () => {
  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>(REVEAL_TARGETS.join(", "));
    revealEls.forEach((el) => el.classList.add("scroll-hidden"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.transitionDelay = `${getDelay(el)}ms`;
            el.classList.replace("scroll-hidden", "scroll-visible");
          } else {
            el.style.transitionDelay = "0ms";
            el.classList.replace("scroll-visible", "scroll-hidden");
          }
        });
      },
      { threshold: 0.1 },
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};
