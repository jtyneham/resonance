// Renderer-independent pose sampling. No accumulated deltas or callback-driven
// pose changes: a seek and an uninterrupted run evaluate to the same pose.
export const LAB_BPM = 120;
export const LAB_BEAT = 60 / LAB_BPM;
export const LOOP_BEATS = 24;
export type Clip = 'sequence' | 'idle' | 'ictus' | 'fingers';
export const CLIP_RANGES: Record<Clip, [number, number]> = {
  sequence: [0, 24],
  idle: [0, 4],
  ictus: [4, 12],
  fingers: [12, 20],
};
export type Pose = {
  beat: number;
  section: string;
  cue: string;
  wrist: number;
  lift: number;
  fingers: number[][];
  glow: number;
  release: number;
  lane: number;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
export function keyframes(
  t: number,
  keys: readonly (readonly [number, number])[],
) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [end, v] = keys[i],
      [start, u] = keys[i - 1];
    if (t <= end) return lerp(u, v, smooth((t - start) / (end - start)));
  }
  return keys[keys.length - 1][1];
}
export function localBeat(seconds: number, clip: Clip = 'sequence') {
  const [start, end] = CLIP_RANGES[clip];
  return start + ((Math.max(0, seconds) / LAB_BEAT) % (end - start));
}
export function samplePose(beat: number): Pose {
  const b = ((beat % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS;
  const fingers = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const pose: Pose = {
    beat: b,
    section: 'Idle',
    cue: 'Small corrections. Absolute control.',
    wrist: 0,
    lift: 0,
    fingers,
    glow: 0,
    release: -1,
    lane: 2,
  };
  if (b < 4) {
    const f = b % 2;
    fingers[4][0] = keyframes(f, [
      [0, 0],
      [0.3, 0.07],
      [0.5, 0.07],
      [0.8, 0],
      [2, 0],
    ]);
    fingers[3][1] = fingers[4][0] * 0.6;
    pose.wrist = keyframes(f, [
      [0, 0],
      [0.8, -0.014],
      [1.1, 0],
      [2, 0],
    ]);
  } else if (b < 12) {
    const f = (b - 4) % 2;
    pose.section = 'Ictus';
    pose.cue =
      f < 0.78
        ? 'Prepare · lift'
        : f < 1
          ? 'Downstroke'
          : f < 1.18
            ? 'Ictus · release'
            : 'Rebound · settle';
    pose.wrist = keyframes(f, [
      [0, 0],
      [0.7, -0.17],
      [0.78, -0.17],
      [1, 0.24],
      [1.18, 0.12],
      [1.8, 0],
      [2, 0],
    ]);
    pose.lift = keyframes(f, [
      [0, 0],
      [0.78, -20],
      [1, 19],
      [1.18, -2],
      [1.8, 0],
      [2, 0],
    ]);
    fingers[0][0] = pose.wrist * -0.35;
    fingers[1][1] = pose.wrist * 0.25;
    fingers[2][0] = pose.wrist * 0.16;
    pose.glow = f >= 1 ? Math.max(0, 1 - (f - 1) / 0.3) : 0;
    pose.release = f >= 1 ? f - 1 : -1;
    pose.lane = [0, 2, 4, 1][Math.floor((b - 4) / 2)];
  } else if (b < 20) {
    const t = b - 12;
    pose.section = 'Finger articulation';
    pose.cue =
      t < 4.3
        ? 'Individual curl · distal joints follow'
        : t < 6.8
          ? 'Reverse release · fingertips lead'
          : 'Lock · settle';
    // Middle, ring and pinky curl independently, preserving the thumb/index grip.
    for (let i = 2; i < 5; i++)
      for (let joint = 0; joint < 3; joint++) {
        const delay = (i - 2) * 0.65 + joint * 0.15;
        const release = 4.6 + (4 - i) * 0.45 + (2 - joint) * 0.12;
        fingers[i][joint] = keyframes(t, [
          [0, 0],
          [0.4 + delay, 0],
          [1.1 + delay, joint === 0 ? -0.28 : 0.5],
          [release, joint === 0 ? -0.28 : 0.5],
          [release + 0.7, 0],
          [8, 0],
        ]);
      }
    pose.wrist = keyframes(t, [
      [0, 0],
      [2.7, -0.035],
      [4, -0.035],
      [7.3, 0],
      [8, 0],
    ]);
  } else {
    pose.section = 'Cutoff';
    pose.cue = 'The phrase ends. Hold the silence.';
  }
  return pose;
}

export function visibleWaves(beat: number) {
  const b = ((beat % LOOP_BEATS) + LOOP_BEATS) % LOOP_BEATS;
  return [5, 7, 9, 11].flatMap((release, i) => {
    const age = b - release;
    return age >= 0 && age < 2.4
      ? [{ lane: [0, 2, 4, 1][i], progress: age / 2.4 }]
      : [];
  });
}
