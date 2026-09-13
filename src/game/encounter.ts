import type { Note } from './chart';

// Encounter content only. Player mechanics remain shared in config.ts.
// Constant tempo for now; no loaders, tempo maps or renderer framework.
// Authored definitions use positive bpm/beats/bossHp and nonnegative count-in.
// Chart hit/travel are seconds, beat is musical position; phrases are beat-sorted.
// Boss hazards and stage opportunities share this prototype timeline, but a
// resonant event is stage-authored—not a boss attack or boss-animation event.
export interface EncounterDefinition {
  readonly id: string;
  readonly name: string;
  // Trusted, repository-authored card copy; may include <br>.
  readonly description: string;
  readonly bpm: number;
  readonly beats: number;
  readonly countInBeats: number;
  readonly bossHp: number;
  readonly chart: readonly Note[];
  readonly phrases: readonly {
    readonly beat: number;
    readonly label: string;
  }[];
}

export const beatSeconds = (encounter: EncounterDefinition) =>
  60 / encounter.bpm;
export const durationSeconds = (encounter: EncounterDefinition) =>
  encounter.beats * beatSeconds(encounter);
export const countInSeconds = (encounter: EncounterDefinition) =>
  encounter.countInBeats * beatSeconds(encounter);
export const trackInfo = (encounter: EncounterDefinition) =>
  `${encounter.bpm} BPM · ${durationSeconds(encounter)} SEC`;
export function phraseAt(encounter: EncounterDefinition, seconds: number) {
  const beat = Math.max(0, seconds) / beatSeconds(encounter);
  for (let i = encounter.phrases.length - 1; i >= 0; i--) {
    if (encounter.phrases[i].beat <= beat) return encounter.phrases[i].label;
  }
  return '';
}
export function remainingTime(encounter: EncounterDefinition, seconds: number) {
  const remaining = Math.min(
    Math.ceil(durationSeconds(encounter)),
    Math.max(0, Math.ceil(durationSeconds(encounter) - seconds)),
  );
  return `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
}
