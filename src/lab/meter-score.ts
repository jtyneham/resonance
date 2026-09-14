export const METER_SKETCH_MS = 12_000;
export const FIRST_PULSE_MS = 1_000;
export const PULSE_MS = 500;
export const ATTACK_TRAVEL_MS = 1_650;
export const ENCOUNTER_OFFSET_SECONDS = 16;

export type MeterGrouping = '3+2' | '2+3';
export type PulseAccent = 'strong' | 'weak';

export interface MeterAttack {
  readonly lane: number;
  readonly width: number;
}

export interface MeterPulse {
  readonly index: number;
  readonly bar: number;
  readonly pulse: number;
  readonly at: number;
  readonly grouping: MeterGrouping;
  readonly accent: PulseAccent;
  readonly attack?: MeterAttack;
}

const attacks: ReadonlyArray<ReadonlyArray<MeterAttack | null>> = [
  [
    { lane: 1, width: 2 },
    { lane: 4, width: 1 },
    null,
    { lane: 0, width: 1 },
    { lane: 2, width: 2 },
  ],
  [
    { lane: 3, width: 2 },
    { lane: 1, width: 1 },
    { lane: 0, width: 1 },
    null,
    { lane: 2, width: 1 },
  ],
  [
    { lane: 0, width: 3 },
    null,
    { lane: 4, width: 1 },
    { lane: 1, width: 1 },
    { lane: 3, width: 2 },
  ],
  [
    { lane: 2, width: 3 },
    { lane: 0, width: 1 },
    { lane: 1, width: 2 },
    null,
    { lane: 4, width: 1 },
  ],
];

export const meterPulses: readonly MeterPulse[] = attacks.flatMap(
  (barAttacks, bar) => {
    const grouping: MeterGrouping = bar < 2 ? '3+2' : '2+3';
    const strongPulses = grouping === '3+2' ? [1, 4] : [1, 3];
    return barAttacks.map((attack, pulseIndex) => ({
      index: bar * 5 + pulseIndex,
      bar,
      pulse: pulseIndex + 1,
      at: FIRST_PULSE_MS + (bar * 5 + pulseIndex) * PULSE_MS,
      grouping,
      accent: strongPulses.includes(pulseIndex + 1) ? 'strong' : 'weak',
      ...(attack ? { attack } : {}),
    }));
  },
);

export function clampSketchTime(ms: number) {
  return Math.min(METER_SKETCH_MS, Math.max(0, Number.isFinite(ms) ? ms : 0));
}

export function pulseAt(ms: number) {
  const time = clampSketchTime(ms);
  for (let index = meterPulses.length - 1; index >= 0; index--) {
    if (meterPulses[index].at <= time) return meterPulses[index];
  }
  return undefined;
}

export function visibleMeterAttacks(ms: number) {
  const time = clampSketchTime(ms);
  return meterPulses
    .filter(
      (pulse) =>
        pulse.attack && time >= pulse.at && time - pulse.at < ATTACK_TRAVEL_MS,
    )
    .map((pulse) => ({
      ...pulse,
      attack: pulse.attack!,
      age: time - pulse.at,
      progress: (time - pulse.at) / ATTACK_TRAVEL_MS,
    }));
}
