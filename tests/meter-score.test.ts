import { describe, expect, it } from 'vitest';
import {
  ATTACK_TRAVEL_MS,
  FIRST_PULSE_MS,
  METER_SKETCH_MS,
  PULSE_MS,
  meterPulses,
  pulseAt,
  visibleMeterAttacks,
} from '../src/lab/meter-score';

describe('Changing Meter timing sketch', () => {
  it('contains four five-pulse bars on an even half-second grid', () => {
    expect(meterPulses).toHaveLength(20);
    expect(meterPulses[0].at).toBe(FIRST_PULSE_MS);
    expect(meterPulses.at(-1)?.at).toBe(10_500);
    for (let index = 1; index < meterPulses.length; index++) {
      expect(meterPulses[index].at - meterPulses[index - 1].at).toBe(PULSE_MS);
    }
    expect(METER_SKETCH_MS).toBe(12_000);
  });

  it('moves strong emphasis from 3+2 to 2+3', () => {
    for (const bar of [0, 1]) {
      const pulses = meterPulses.filter((pulse) => pulse.bar === bar);
      expect(pulses.map((pulse) => pulse.grouping)).toEqual(
        Array(5).fill('3+2'),
      );
      expect(
        pulses.filter((pulse) => pulse.accent === 'strong').map((p) => p.pulse),
      ).toEqual([1, 4]);
    }
    for (const bar of [2, 3]) {
      const pulses = meterPulses.filter((pulse) => pulse.bar === bar);
      expect(pulses.map((pulse) => pulse.grouping)).toEqual(
        Array(5).fill('2+3'),
      );
      expect(
        pulses.filter((pulse) => pulse.accent === 'strong').map((p) => p.pulse),
      ).toEqual([1, 3]);
    }
  });

  it('keeps rests and all placeholder attacks within five lanes', () => {
    expect(meterPulses.filter((pulse) => !pulse.attack)).toHaveLength(4);
    for (const pulse of meterPulses) {
      if (!pulse.attack) continue;
      expect(pulse.attack.width).toBeGreaterThanOrEqual(1);
      expect(pulse.attack.width).toBeLessThanOrEqual(3);
      expect(pulse.attack.lane).toBeGreaterThanOrEqual(0);
      expect(pulse.attack.lane + pulse.attack.width).toBeLessThanOrEqual(5);
    }
  });

  it('derives pulse and visible attacks from absolute sketch time', () => {
    expect(pulseAt(999)).toBeUndefined();
    expect(pulseAt(1_000)?.pulse).toBe(1);
    expect(pulseAt(2_000)?.attack).toBeUndefined();
    expect(visibleMeterAttacks(999)).toHaveLength(0);
    expect(visibleMeterAttacks(1_000)).toHaveLength(1);
    expect(visibleMeterAttacks(1_000 + ATTACK_TRAVEL_MS)).toHaveLength(2);
  });
});
