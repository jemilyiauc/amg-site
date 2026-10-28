"use client";

import { useEffect } from "react";

// Hide the navbar while scrolling down past 80px, show it on any scroll up.
export const useNavbarScroll = () => {
  useEffect(() => {
    const navbar = document.querySelector<HTMLElement>("#navbar");
    if (!navbar) return;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      navbar.classList.toggle("nav-hidden", currentScrollY > lastScrollY && currentScrollY > 80);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};
