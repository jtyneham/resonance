import { describe, expect, it } from 'vitest';
import {
  wristMotion,
  WRIST_BEAT,
  WRIST_DURATION,
} from '../src/lab/wrist-motion';
describe('disposable wrist motion', () => {
  it('returns exactly to idle without a hold at the beat', () => {
    expect(wristMotion(0).angle).toBe(0);
    expect(wristMotion(WRIST_DURATION).angle).toBe(0);
    expect(wristMotion(WRIST_BEAT).angle).toBeCloseTo(1.45);
    expect(wristMotion(WRIST_BEAT + 1).angle).toBeLessThan(1.45);
  });
  it('prepares backward and makes a short forward stroke', () => {
    expect(wristMotion(130).angle).toBeCloseTo(-0.16);
    expect(wristMotion(250).angle).toBeGreaterThan(1);
    expect(wristMotion(131).phase).toBe('Wrist flick');
  });
  it('clamps safely and stays continuous at phase boundaries', () => {
    expect(wristMotion(NaN).angle).toBe(0);
    expect(wristMotion(-10).angle).toBe(0);
    expect(wristMotion(99999).angle).toBe(0);
    expect(
      Math.abs(wristMotion(259.999).angle - wristMotion(260).angle),
    ).toBeLessThan(0.001);
  });
});
