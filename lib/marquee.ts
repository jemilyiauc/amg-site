// Today's marquee runs 12 logos in 60s; keep that per-logo speed for any count.
const SECONDS_PER_LOGO = 5;
const DEFAULT_SECONDS = 60;

export function marqueeDurationSeconds(count: number): number {
  return count < 1 ? DEFAULT_SECONDS : count * SECONDS_PER_LOGO;
}
