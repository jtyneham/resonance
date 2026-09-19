export const METER_PHRASE_MS = 2_500;
export const METER_PHRASE_FRAMES = 20;
export const METER_BEAT_MS = 500;
export const METER_ATTACK_TRAVEL_MS = 1_450;

const PHRASE_FRAME_TIMES = [
  0, 65, 130, 195, 250, 380, 520, 680, 750, 880, 1_020, 1_180, 1_250, 1_390,
  1_530, 1_680, 1_750, 1_870, 2_000, 2_180,
] as const;

export type MeterPhrasePose =
  | { readonly sheet: 'phrase'; readonly frame: number }
  | { readonly sheet: 'bridge'; readonly frame: 2 | 3 };

export type PhraseAttackKind = 'arc' | 'pipes';

export interface PhraseBeat {
  readonly beat: number;
  readonly at: number;
  readonly accent: 'strong' | 'weak';
  readonly attack?: {
    readonly kind: PhraseAttackKind;
    readonly lane: number;
    readonly width: number;
  };
}

export const phraseBeats: readonly PhraseBeat[] = [
  {
    beat: 1,
    at: 250,
    accent: 'strong',
    attack: { kind: 'arc', lane: 0, width: 1 },
  },
  { beat: 2, at: 750, accent: 'weak' },
  {
    beat: 3,
    at: 1_250,
    accent: 'weak',
    attack: { kind: 'arc', lane: 2, width: 2 },
  },
  {
    beat: 4,
    at: 1_750,
    accent: 'strong',
    attack: { kind: 'pipes', lane: 0, width: 2 },
  },
  {
    beat: 5,
    at: 2_250,
    accent: 'weak',
    attack: { kind: 'arc', lane: 4, width: 1 },
  },
];

export function meterPhraseTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return ms % METER_PHRASE_MS;
}

export function meterPhraseFrame(ms: number) {
  const time = meterPhraseTime(ms);
  for (let frame = PHRASE_FRAME_TIMES.length - 1; frame >= 0; frame--) {
    if (time >= PHRASE_FRAME_TIMES[frame]) return frame;
  }
  return 0;
}

export function meterPhrasePose(ms: number): MeterPhrasePose {
  const time = meterPhraseTime(ms);
  if (time >= 2_450) return { sheet: 'phrase', frame: 0 };
  if (time >= 2_375) return { sheet: 'bridge', frame: 3 };
  if (time >= 2_300) return { sheet: 'bridge', frame: 2 };
  return { sheet: 'phrase', frame: meterPhraseFrame(time) };
}

export function phraseBeatAt(ms: number) {
  const time = meterPhraseTime(ms);
  for (let index = phraseBeats.length - 1; index >= 0; index--) {
    if (phraseBeats[index].at <= time) return phraseBeats[index];
  }
  return phraseBeats[phraseBeats.length - 1];
}

export function visiblePhraseAttacks(ms: number) {
  const time = meterPhraseTime(ms);
  return phraseBeats
    .filter((beat) => {
      if (!beat.attack) return false;
      const age = (time - beat.at + METER_PHRASE_MS) % METER_PHRASE_MS;
      return age < METER_ATTACK_TRAVEL_MS;
    })
    .map((beat) => ({
      ...beat,
      attack: beat.attack!,
      age: (time - beat.at + METER_PHRASE_MS) % METER_PHRASE_MS,
      progress:
        ((time - beat.at + METER_PHRASE_MS) % METER_PHRASE_MS) /
        METER_ATTACK_TRAVEL_MS,
    }));
}
