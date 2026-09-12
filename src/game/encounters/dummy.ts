import type { Note, AttackKind } from '../chart';
import type { EncounterDefinition } from '../encounter';

const BPM = 160;
const DUMMY_BEAT = 60 / BPM;

// Every number is a musical impact time. No random gameplay spawns.
export function makeDummyChart(): Note[] {
  const notes: Omit<Note, 'id'>[] = [];
  const add = (
    beat: number,
    lane: number,
    width = 1,
    kind: AttackKind = 'dark',
    travel = 2.5,
  ) => {
    notes.push({
      beat,
      hit: beat * DUMMY_BEAT,
      lane,
      width,
      kind,
      travel: travel * DUMMY_BEAT,
    });
  };
  for (let phrase = 0; phrase < 7; phrase++) {
    const b = phrase * 16;
    const mirror = phrase % 2 === 1;
    const lane = (n: number, width = 1) => (mirror ? 5 - n - width : n);
    // A legible pair inside flanking pressure; then an actual firing opening.
    add(b + 4, 2, 1, 'resonant');
    add(b + 5, 2, 1, 'resonant');
    add(b + 4, lane(0), 1, 'barrier');
    add(b + 5, lane(4), 1, 'barrier');
    // Uneven outer-lane bursts: 1, then 2, then 3. Later reprises accelerate.
    const subdivision = phrase >= 3 ? 0.25 : 0.5;
    add(b + 7.5, lane(0));
    add(b + 8, lane(1));
    add(b + 8 + subdivision, lane(1));
    add(b + 9, lane(2));
    add(b + 9 + subdivision, lane(2));
    add(b + 9 + subdivision * 2, lane(2));
    // Tall two-lane wall: jump cannot solve it. Sideways escape is required.
    add(b + 11.5, lane(1, 2), 2, 'barrier');
    // Wide low sweep, then an offbeat return. Faster notes get extra warnings.
    add(b + 13.5, lane(2, 3), 3, 'dark', phrase >= 4 ? 2 : 2.5);
    add(b + 14.25, lane(0, 2), 2);
    if (phrase >= 2) add(b + 15, lane(4), 1, 'dark', 1.75);
  }
  // Final phrase closes the arena in staggered, jumpable chords.
  add(113, 0, 2, 'barrier');
  add(113, 3, 2, 'barrier');
  add(114, 2, 1, 'resonant');
  add(115, 2, 1, 'resonant');
  add(117, 0, 3);
  add(117.75, 3, 2);
  add(118.5, 1, 3);
  return notes
    .sort((a, b) => a.hit - b.hit)
    .map((note, id) => ({ ...note, id }));
}

const PHRASES = [
  '01 / SIGNAL',
  '02 / CROSS TALK',
  '03 / FRACTURE',
  '04 / DOUBLE TIME',
  '05 / OVERDRIVE',
  '06 / INVERSION',
  '07 / FEEDBACK',
  '08 / LAST SIGNAL',
];

export const DUMMY_ENCOUNTER: EncounterDefinition = {
  id: 'dummy',
  name: 'DUMMY BOSS',
  description:
    'Absorb two notes. Find an opening.<br>Land five counterattacks before time runs out.',
  bpm: BPM,
  beats: 120,
  countInBeats: 2,
  bossHp: 5,
  chart: makeDummyChart(),
  phrases: PHRASES.map((label, index) => ({ beat: index * 16, label })),
};
