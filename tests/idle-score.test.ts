import { expect, it } from 'vitest';
import {
  IDLE_CELL_BOTTOM_GUTTER_PX,
  IDLE_CYCLE_MS,
  IDLE_FLOAT_DISTANCE_PX,
  IDLE_FRAME_COUNT,
  idleCellBounds,
  idleFloatOffset,
  idleFrame,
  idleTime,
  idleTipEnergy,
  isBrightEdgeFringe,
  isInsideIdleGripVoid,
  isNeutralMatteArtifact,
  isPaintedMatteCandidate,
  isPaintedMatteSeed,
} from '../src/lab/idle-score';

it('uses integer non-overlapping sheet rows so neighboring frames cannot bleed', () => {
  const thirdRow = idleCellBounds(8, 1261, 1247);
  const fourthRow = idleCellBounds(12, 1261, 1247);

  expect(thirdRow).toEqual({ left: 0, top: 623, width: 315, height: 312 });
  expect(fourthRow.top).toBe(thirdRow.top + thirdRow.height);
  expect(Number.isInteger(thirdRow.top)).toBe(true);
  expect(Number.isInteger(thirdRow.height)).toBe(true);
  expect(IDLE_CELL_BOTTOM_GUTTER_PX).toBe(4);
});

it('loops sixteen bounded drawings over two seconds', () => {
  expect(idleTime(-1)).toBe(0);
  expect(idleTime(NaN)).toBe(0);
  expect(idleFrame(0)).toBe(0);
  expect(idleFrame(IDLE_CYCLE_MS / 2)).toBe(IDLE_FRAME_COUNT - 1);
  expect(idleFrame(IDLE_CYCLE_MS - 1)).toBe(1);
  expect(idleFrame(IDLE_CYCLE_MS)).toBe(0);
  expect(
    new Set(Array.from({ length: IDLE_CYCLE_MS }, (_, time) => idleFrame(time)))
      .size,
  ).toBe(IDLE_FRAME_COUNT);
});

it('floats upward and returns to the exact Ictus anchor without a reset', () => {
  expect(idleFloatOffset(0)).toBeCloseTo(0, 8);
  expect(idleFloatOffset(IDLE_CYCLE_MS / 4)).toBeCloseTo(
    -IDLE_FLOAT_DISTANCE_PX / 2,
    8,
  );
  expect(idleFloatOffset(IDLE_CYCLE_MS / 2)).toBeCloseTo(
    -IDLE_FLOAT_DISTANCE_PX,
    8,
  );
  expect(idleFloatOffset((IDLE_CYCLE_MS * 3) / 4)).toBeCloseTo(
    -IDLE_FLOAT_DISTANCE_PX / 2,
    8,
  );
  expect(idleFloatOffset(IDLE_CYCLE_MS)).toBeCloseTo(0, 8);
});

it('keeps the independent tip light within a restrained range', () => {
  const energies = Array.from({ length: 101 }, (_, index) =>
    idleTipEnergy((index / 100) * IDLE_CYCLE_MS),
  );
  expect(Math.min(...energies)).toBeGreaterThanOrEqual(0.28);
  expect(Math.max(...energies)).toBeLessThanOrEqual(0.83);
});

it('floods neutral matte edges but stops at the warm character palette', () => {
  expect(isPaintedMatteSeed(255, 255, 255)).toBe(true);
  expect(isPaintedMatteSeed(205, 205, 205)).toBe(true);
  expect(isPaintedMatteSeed(208, 190, 184)).toBe(false);
  expect(isPaintedMatteCandidate(208, 190, 184)).toBe(true);
  expect(isPaintedMatteCandidate(238, 209, 164)).toBe(false);
  expect(isPaintedMatteCandidate(10, 10, 10)).toBe(false);
  expect(isNeutralMatteArtifact(138, 138, 138)).toBe(true);
  expect(isNeutralMatteArtifact(208, 190, 184)).toBe(false);
  expect(isNeutralMatteArtifact(238, 209, 164)).toBe(false);
  expect(isInsideIdleGripVoid(141, 130, 313, 313)).toBe(true);
  expect(isInsideIdleGripVoid(141, 80, 313, 313)).toBe(false);
  expect(isInsideIdleGripVoid(190, 130, 313, 313)).toBe(false);
  expect(isBrightEdgeFringe(215, 208, 205)).toBe(true);
  expect(isBrightEdgeFringe(238, 209, 164)).toBe(true);
  expect(isBrightEdgeFringe(238, 150, 60)).toBe(false);
  expect(isBrightEdgeFringe(47, 38, 35)).toBe(false);
});
