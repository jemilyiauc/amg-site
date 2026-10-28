// Today's marquee runs 12 logos in 60s; keep that per-logo speed for any count.
const SECONDS_PER_LOGO = 5;
const DEFAULT_SECONDS = 60;

export function marqueeDurationSeconds(count: number): number {
  return count < 1 ? DEFAULT_SECONDS : count * SECONDS_PER_LOGO;
}

// Each half of the track must be at least as wide as the screen or a gap shows
// before the loop restarts. A .logo-box is 200px + 20px margin.
const LOGO_BOX_PX = 220;
const MIN_HALF_WIDTH_PX = 2560;

export function marqueeRepeat(count: number): number {
  return count < 1 ? 1 : Math.ceil(MIN_HALF_WIDTH_PX / (count * LOGO_BOX_PX));
}
