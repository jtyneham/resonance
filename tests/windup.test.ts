import { expect, it } from 'vitest';
import {
  ICTUS_MS,
  STRIKE_END_MS,
  ictusPose,
  windupFrame,
} from '../src/lab/windup-score';
it('plays eight bounded drawings over the 130 ms preparation', () => {
  expect(windupFrame(-1)).toBe(0);
  expect(windupFrame(NaN)).toBe(0);
  expect(windupFrame(130)).toBe(7);
  expect(windupFrame(500)).toBe(7);
  expect(
    new Set(Array.from({ length: 131 }, (_, t) => windupFrame(t))).size,
  ).toBe(8);
});

it('rebounds immediately and returns through the approved drawings to idle', () => {
  expect(ictusPose(0)).toMatchObject({ phase: 'windup', frame: 0 });
  expect(ictusPose(130)).toMatchObject({ phase: 'stroke', frame: 0 });
  expect(ictusPose(259)).toMatchObject({ phase: 'stroke', frame: 7 });
  expect(ictusPose(STRIKE_END_MS)).toEqual({
    phase: 'recovery',
    sheet: 'stroke',
    frame: 6,
  });
  expect(ictusPose(ICTUS_MS)).toEqual({
    phase: 'idle',
    sheet: 'windup',
    frame: 0,
  });
});
