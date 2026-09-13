import { expect, it } from 'vitest';
import {
  ICTUS_RELEASE_MS,
  ictusAttacks,
  tipEnergy,
  visibleAttacks,
} from '../src/lab/ictus-effects';

it('charges into the pointing beat and releases a varied five-lane phrase', () => {
  expect(tipEnergy(0)).toBeGreaterThan(0);
  expect(tipEnergy(ICTUS_RELEASE_MS - 1)).toBeGreaterThan(0.99);
  expect(tipEnergy(ICTUS_RELEASE_MS + 110)).toBe(0);
  expect(visibleAttacks(ICTUS_RELEASE_MS - 1)).toHaveLength(0);
  expect(visibleAttacks(ICTUS_RELEASE_MS)[0]).toMatchObject({
    lane: 2,
    width: 1,
    age: 0,
  });
  expect(new Set(ictusAttacks.map(({ width }) => width))).toEqual(
    new Set([1, 2, 3]),
  );
  expect(ictusAttacks.every(({ lane, width }) => lane + width <= 5)).toBe(true);
});
