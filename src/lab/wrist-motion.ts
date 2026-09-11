export const WRIST_DURATION = 1200;
export const WRIST_BEAT = 260;
const smooth = (t: number) => t * t * (3 - 2 * t);

// Disposable movement study only: one wrist axis, a rigid grip, fixed cuff.
// No production character rig or animation-system dependency.
export function wristMotion(ms: number) {
  const t = Number.isFinite(ms) ? Math.max(0, Math.min(WRIST_DURATION, ms)) : 0;
  if (t === 0) return { angle: 0, phase: 'Upright idle' };
  if (t < 130) return { angle: -0.16 * smooth(t / 130), phase: 'Preparation' };
  if (t < WRIST_BEAT)
    return {
      angle: -0.16 + 1.61 * Math.pow((t - 130) / 130, 2),
      phase: 'Wrist flick',
    };
  // Immediate rebound: no dwell at the pointing pose. Ease out of the beat.
  const recovery = (t - WRIST_BEAT) / (WRIST_DURATION - WRIST_BEAT);
  return {
    angle: 1.45 * Math.pow(1 - recovery, 2),
    phase: t === WRIST_DURATION ? 'Upright idle' : 'Rebound',
  };
}
