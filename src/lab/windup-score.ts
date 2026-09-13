export const WINDUP_MS = 130;
export const STROKE_MS = 130;
export const RECOVERY_MS = 940;
export const STRIKE_END_MS = WINDUP_MS + STROKE_MS;
export const ICTUS_MS = STRIKE_END_MS + RECOVERY_MS;

export function windupFrame(ms: number) {
  const t = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  return Math.min(7, Math.floor((t / WINDUP_MS) * 8));
}

export type IctusPose = {
  phase: 'windup' | 'stroke' | 'recovery' | 'idle';
  sheet: 'windup' | 'stroke';
  frame: number;
};

const recoveryFrames: Pick<IctusPose, 'sheet' | 'frame'>[] = [
  { sheet: 'stroke', frame: 6 },
  { sheet: 'stroke', frame: 5 },
  { sheet: 'stroke', frame: 4 },
  { sheet: 'stroke', frame: 3 },
  { sheet: 'stroke', frame: 2 },
  { sheet: 'stroke', frame: 1 },
  { sheet: 'stroke', frame: 0 },
  { sheet: 'windup', frame: 7 },
  { sheet: 'windup', frame: 6 },
  { sheet: 'windup', frame: 5 },
  { sheet: 'windup', frame: 4 },
  { sheet: 'windup', frame: 3 },
  { sheet: 'windup', frame: 2 },
  { sheet: 'windup', frame: 1 },
  { sheet: 'windup', frame: 0 },
];

export function ictusPose(ms: number): IctusPose {
  const time = Number.isFinite(ms) ? Math.max(0, ms) : 0;
  if (time < WINDUP_MS)
    return { phase: 'windup', sheet: 'windup', frame: windupFrame(time) };
  if (time < STRIKE_END_MS)
    return {
      phase: 'stroke',
      sheet: 'stroke',
      frame: windupFrame(time - WINDUP_MS),
    };
  if (time >= ICTUS_MS) return { phase: 'idle', sheet: 'windup', frame: 0 };
  const progress = (time - STRIKE_END_MS) / RECOVERY_MS;
  const pose =
    recoveryFrames[
      Math.min(
        recoveryFrames.length - 1,
        Math.floor(progress * recoveryFrames.length),
      )
    ];
  return { phase: 'recovery', ...pose };
}
