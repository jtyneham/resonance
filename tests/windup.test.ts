import { expect, it } from 'vitest';
import { windupFrame } from '../src/lab/windup-score';
it('plays eight bounded drawings over the 130 ms preparation', () => {
  expect(windupFrame(-1)).toBe(0);
  expect(windupFrame(NaN)).toBe(0);
  expect(windupFrame(130)).toBe(7);
  expect(windupFrame(500)).toBe(7);
  expect(
    new Set(Array.from({ length: 131 }, (_, t) => windupFrame(t))).size,
  ).toBe(8);
});
