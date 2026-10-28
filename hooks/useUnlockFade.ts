"use client";

import { useEffect } from "react";

// Each "Unlock" item fades in over the bottom 45% of the viewport as it scrolls up.
export const useUnlockFade = () => {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("#unlock li"));
    items.forEach((li) => {
      li.style.opacity = "0";
    });

    const update = () => {
      const viewH = window.innerHeight;
      items.forEach((li) => {
        const top = li.getBoundingClientRect().top;
        const progress = (viewH - top) / (viewH * 0.45);
        li.style.opacity = String(Math.min(1, Math.max(0, progress)));
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
};
