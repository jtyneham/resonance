import { expect, it } from 'vitest';
import {
  CONTINUITY_ATTACK_START_MS,
  CONTINUITY_DURATION_MS,
  CONTINUITY_SETTLE_START_MS,
  continuityMoment,
  continuityTime,
} from '../src/lab/continuity-score';

it('runs idle, one complete Ictus, then returns to idle', () => {
  expect(continuityMoment(0)).toMatchObject({
    phase: 'lead-idle',
    frame: 0,
  });
  expect(continuityMoment(CONTINUITY_ATTACK_START_MS)).toMatchObject({
    phase: 'windup',
    frame: 0,
  });
  expect(continuityMoment(CONTINUITY_ATTACK_START_MS + 259)).toMatchObject({
    phase: 'stroke',
    frame: 7,
  });
  expect(continuityMoment(CONTINUITY_ATTACK_START_MS + 260)).toMatchObject({
    phase: 'recovery',
    frame: 6,
  });
  expect(continuityMoment(CONTINUITY_SETTLE_START_MS)).toMatchObject({
    phase: 'settle-idle',
    frame: 0,
  });
});

it('clamps invalid and completed continuity time', () => {
  expect(continuityTime(-1)).toBe(0);
  expect(continuityTime(Number.NaN)).toBe(0);
  expect(continuityTime(CONTINUITY_DURATION_MS + 1)).toBe(
    CONTINUITY_DURATION_MS,
  );
});
