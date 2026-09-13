export const ICTUS_RELEASE_MS = 244;
export const ICTUS_ATTACK_PREVIEW_MS = 1500;

export type IctusAttack = {
  at: number;
  lane: number;
  width: number;
  accent: number;
};

// One conducted phrase: an initial declaration, displaced replies, then a broad
// closing accent. These timings belong to this preview and are not copied from a
// reference boss.
export const ictusAttacks: IctusAttack[] = [
  { at: ICTUS_RELEASE_MS, lane: 2, width: 1, accent: 1 },
  { at: 342, lane: 0, width: 1, accent: 0.72 },
  { at: 407, lane: 4, width: 1, accent: 0.72 },
  { at: 493, lane: 1, width: 2, accent: 0.88 },
  { at: 628, lane: 3, width: 1, accent: 0.68 },
  { at: 702, lane: 0, width: 3, accent: 1 },
];

export function tipEnergy(ms: number) {
  const time = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  if (time < 130) return 0.12 + (time / 130) * 0.2;
  if (time < ICTUS_RELEASE_MS)
    return 0.32 + ((time - 130) / (ICTUS_RELEASE_MS - 130)) * 0.68;
  if (time < ICTUS_RELEASE_MS + 110)
    return 1 - ((time - ICTUS_RELEASE_MS) / 110) * 0.9;
  return 0;
}

export function visibleAttacks(ms: number) {
  const time = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  return ictusAttacks
    .filter(({ at }) => time >= at && time - at < 1250)
    .map((attack) => ({
      ...attack,
      age: time - attack.at,
      progress: (time - attack.at) / 1250,
    }));
}
