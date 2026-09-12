import { expect, it } from 'vitest';
import {
  fingerAngle,
  completeFingerAngles,
  FINGER_CYCLE,
} from '../src/lab/finger-model';

it('coordinates three joints with a gentler fingertip onset and closed cycle', () => {
  expect(completeFingerAngles(0)).toEqual([0, 0, 0]);
  expect(completeFingerAngles(FINGER_CYCLE)).toEqual([0, 0, 0]);
  expect(completeFingerAngles(1200)).toEqual([0.28, 0.85, 0.55]);
  expect(completeFingerAngles(NaN)).toEqual([0, 0, 0]);
  for (let ms = 1; ms <= FINGER_CYCLE; ms++) {
    completeFingerAngles(ms).forEach((angle, i) => {
      expect(Math.abs(angle - completeFingerAngles(ms - 1)[i])).toBeLessThan(
        0.002,
      );
    });
  }
});

it('bends continuously with a closed cycle and no pose-frame steps', () => {
  expect(fingerAngle(0)).toBe(0);
  expect(fingerAngle(FINGER_CYCLE)).toBe(0);
  expect(fingerAngle(FINGER_CYCLE / 2)).toBeCloseTo(1.26);
  for (let time = 1; time < FINGER_CYCLE; time++) {
    expect(Math.abs(fingerAngle(time) - fingerAngle(time - 1))).toBeLessThan(
      0.002,
    );
  }
  expect(fingerAngle(NaN)).toBe(0);
});
