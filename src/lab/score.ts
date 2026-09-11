export const LAB_BPM = 120;
export const LAB_BEAT = 60 / LAB_BPM;
export const LOOP_BEATS = 4;
export const FRAME_RATE = 30;
export const FRAME_COUNT = 30;
export const ATTACK_RELEASE_BEAT = 16 / 15;

export type Clip = 'ictus';
export const CLIP_RANGES: Record<Clip, [number, number]> = {
  ictus: [0, LOOP_BEATS],
};

export type Pose = {
  beat: number;
  section: string;
  cue: string;
  frame: number;
  release: number;
};

export function samplePose(beat: number): Pose {
  const b = ((beat % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS;
  const seconds = b * LAB_BEAT;
  const frame =
    seconds < 1
      ? Math.min(FRAME_COUNT - 1, Math.floor(seconds * FRAME_RATE + 1e-7))
      : 0;
  let section = 'Ready',
    cue = 'Measured stillness.';
  if (frame >= 6 && frame < 12)
    [section, cue] = ['Preparation', 'Lift · gather the phrase'];
  else if (frame >= 12 && frame < 16)
    [section, cue] = ['Downstroke', 'Accelerate toward the player'];
  else if (frame >= 16 && frame < 18)
    [section, cue] = ['Ictus', 'Release · broken red chord'];
  else if (frame >= 18 && frame < 23)
    [section, cue] = ['Rebound', 'Pass through vertical · no hold'];
  else if (frame >= 23) [section, cue] = ['Return', 'Rotate back to ready'];
  return {
    beat: b,
    section,
    cue,
    frame,
    release:
      b >= ATTACK_RELEASE_BEAT - 1e-9 && b < ATTACK_RELEASE_BEAT + 0.18
        ? Math.max(0, 1 - (b - ATTACK_RELEASE_BEAT) / 0.18)
        : 0,
  };
}

type Wave = { startLane: number; width: number; progress: number };

// One emphatic gesture authors a short, deliberately uneven phrase. Nothing
// exists at the spawn line before the camera-facing Ictus frame.
export function visibleWaves(beat: number): Wave[] {
  const b = ((beat % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS;
  const notes = [
    { offset: 0, startLane: 0, width: 2, travel: 1.7 },
    { offset: 0.22, startLane: 4, width: 1, travel: 1.45 },
    { offset: 0.5, startLane: 1, width: 3, travel: 1.8 },
  ];
  return notes.flatMap((note) => {
    const age = b - ATTACK_RELEASE_BEAT - note.offset;
    return age >= -1e-9 && age < note.travel
      ? [{ ...note, progress: Math.max(0, age) / note.travel }]
      : [];
  });
}
