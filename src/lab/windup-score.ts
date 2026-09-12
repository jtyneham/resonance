export const WINDUP_MS = 130;
export function windupFrame(ms: number) {
  const t = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  return Math.min(7, Math.floor((t / WINDUP_MS) * 8));
}
