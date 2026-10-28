// The page is prerendered: a thrown error fails the build (the previous deploy
// stays live) or the ISR regeneration (the last good page keeps being served).
// Rendering a blank page instead would get cached and shipped.
export function requireDocument<T>(name: string, data: T | null): T {
  if (data === null) throw new Error(`Sanity document "${name}" is missing`);
  return data;
}
