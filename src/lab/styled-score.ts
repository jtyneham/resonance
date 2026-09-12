import { wristMotion, WRIST_BEAT, WRIST_DURATION } from './wrist-motion';

export { WRIST_BEAT, WRIST_DURATION };

// A blocking review of the available drawings, NOT a finished animation.
// Sample the approved angle exactly; choose its nearest existing key drawing.
// Held drawings expose missing in-betweens, not intentional motion holds.
export function sampleStyled(ms: number) {
  const time = Number.isFinite(ms)
    ? Math.max(0, Math.min(WRIST_DURATION, ms))
    : 0;
  const motion = wristMotion(time);
  const frame = motion.angle < -0.08 ? 1 : motion.angle > 0.725 ? 2 : 0;
  return { ...motion, frame, time, release: time === WRIST_BEAT };
}
