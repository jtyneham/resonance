export const METER_PHRASE_MS = 2_500;
export const METER_PHRASE_FRAMES = 20;
export const METER_BEAT_MS = 500;
export const METER_ATTACK_TRAVEL_MS = 1_450;

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
    at: 0,
    accent: 'strong',
    attack: { kind: 'arc', lane: 0, width: 1 },
  },
  { beat: 2, at: 500, accent: 'weak' },
  {
    beat: 3,
    at: 1_000,
    accent: 'weak',
    attack: { kind: 'arc', lane: 2, width: 2 },
  },
  {
    beat: 4,
    at: 1_500,
    accent: 'strong',
    attack: { kind: 'pipes', lane: 0, width: 2 },
  },
  {
    beat: 5,
    at: 2_000,
    accent: 'weak',
    attack: { kind: 'arc', lane: 4, width: 1 },
  },
];

export function meterPhraseTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return ms % METER_PHRASE_MS;
}

export function meterPhraseFrame(ms: number) {
  return Math.min(
    METER_PHRASE_FRAMES - 1,
    Math.floor((meterPhraseTime(ms) / METER_PHRASE_MS) * METER_PHRASE_FRAMES),
  );
}

export function phraseBeatAt(ms: number) {
  const time = meterPhraseTime(ms);
  for (let index = phraseBeats.length - 1; index >= 0; index--) {
    if (phraseBeats[index].at <= time) return phraseBeats[index];
  }
  return phraseBeats[0];
}

export function visiblePhraseAttacks(ms: number) {
  const time = meterPhraseTime(ms);
  return phraseBeats
    .filter((beat) => {
      if (!beat.attack) return false;
      const age = time - beat.at;
      return age >= 0 && age < METER_ATTACK_TRAVEL_MS;
    })
    .map((beat) => ({
      ...beat,
      attack: beat.attack!,
      age: time - beat.at,
      progress: (time - beat.at) / METER_ATTACK_TRAVEL_MS,
    }));
}
