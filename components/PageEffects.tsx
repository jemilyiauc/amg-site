"use client";

import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useUnlockFade } from "@/hooks/useUnlockFade";

export const PageEffects = () => {
  useScrollReveal();
  useNavbarScroll();
  useUnlockFade();
  return null;
};
