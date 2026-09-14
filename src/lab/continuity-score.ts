import { IDLE_CYCLE_MS, idleFrame, idleTime } from './idle-score';
import { ICTUS_MS, ictusPose, type IctusPose } from './windup-score';

export const CONTINUITY_LEAD_IN_MS = IDLE_CYCLE_MS;
export const CONTINUITY_ATTACK_START_MS = CONTINUITY_LEAD_IN_MS;
export const CONTINUITY_SETTLE_START_MS = CONTINUITY_ATTACK_START_MS + ICTUS_MS;
export const CONTINUITY_DURATION_MS =
  CONTINUITY_SETTLE_START_MS + IDLE_CYCLE_MS;

export type ContinuityMoment =
  | {
      phase: 'lead-idle' | 'settle-idle';
      localTime: number;
      frame: number;
    }
  | ({ phase: IctusPose['phase']; localTime: number } & Pick<
      IctusPose,
      'sheet' | 'frame'
    >);

export function continuityTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.min(CONTINUITY_DURATION_MS, ms);
}

export function continuityMoment(ms: number): ContinuityMoment {
  const time = continuityTime(ms);
  if (time < CONTINUITY_ATTACK_START_MS) {
    return {
      phase: 'lead-idle',
      localTime: idleTime(time),
      frame: idleFrame(time),
    };
  }
  if (time < CONTINUITY_SETTLE_START_MS) {
    const localTime = time - CONTINUITY_ATTACK_START_MS;
    return { ...ictusPose(localTime), localTime };
  }
  const localTime = idleTime(time - CONTINUITY_SETTLE_START_MS);
  return {
    phase: 'settle-idle',
    localTime,
    frame: idleFrame(localTime),
  };
}
