export const ICTUS_MS = 1000;
export const ICTUS_RELEASE_MS = 200;

// Non-uniform exposure: a compact preparation/strike and measured recovery.
// Index 6 is the approved upright pose, now also the resting idle.
const poses = [
  { at: 0, frame: 6, phase: 'Upright idle' },
  { at: 40, frame: 7, phase: 'Preparation' },
  { at: 110, frame: 8, phase: 'Fast downstroke' },
  { at: ICTUS_RELEASE_MS, frame: 0, phase: 'Ictus · attack release' },
  { at: 260, frame: 1, phase: 'Recovery' },
  { at: 380, frame: 2, phase: 'Recovery' },
  { at: 500, frame: 3, phase: 'Recovery' },
  { at: 650, frame: 4, phase: 'Recovery' },
  { at: 820, frame: 5, phase: 'Return to upright' },
  { at: ICTUS_MS, frame: 6, phase: 'Upright idle' },
];

export function sampleIctus(time: number) {
  const clamped = Number.isFinite(time)
    ? Math.max(0, Math.min(ICTUS_MS, time))
    : 0;
  let pose = poses[0];
  for (const candidate of poses) {
    if (candidate.at > clamped) break;
    pose = candidate;
  }
  return pose;
}
