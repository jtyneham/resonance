import { describe, expect, it } from 'vitest';
import {
  ATTACK_RELEASE_BEAT,
  FRAME_COUNT,
  LOOP_BEATS,
  samplePose,
  visibleWaves,
} from '../src/lab/score';

describe('Conductor whole-hand timeline', () => {
  it('selects all 24 authored drawings directly from absolute score time', () => {
    const frames = Array.from(
      { length: 24 },
      (_, frame) => samplePose(frame / 12 + 0.0001).frame,
    );
    expect(frames).toEqual(Array.from({ length: FRAME_COUNT }, (_, i) => i));
    expect(samplePose(LOOP_BEATS).frame).toBe(0);
  });

  it('does not hold the frontal vertical rebound', () => {
    expect(samplePose(13 / 12).section).toBe('Ictus');
    expect(samplePose(15 / 12).section).toBe('Rebound');
    expect(samplePose(20 / 12).section).toBe('Return');
  });

  it('creates no visible attack before the camera-facing release', () => {
    expect(visibleWaves(ATTACK_RELEASE_BEAT - 0.0001)).toEqual([]);
    expect(visibleWaves(ATTACK_RELEASE_BEAT)).toEqual([
      expect.objectContaining({ startLane: 0, width: 2, progress: 0 }),
    ]);
  });

  it('builds the accented Ictus into a varied three-part formation', () => {
    const phrase = visibleWaves(ATTACK_RELEASE_BEAT + 0.51);
    expect(phrase.map(({ startLane, width }) => [startLane, width])).toEqual([
      [0, 2],
      [4, 1],
      [1, 3],
    ]);
    expect(new Set(phrase.map((wave) => wave.progress)).size).toBe(3);
  });

  it('is deterministic after dropped frames and backward scrubbing', () => {
    const expected = samplePose(1.42);
    for (let beat = 0; beat < 1.42; beat += 1 / 120) samplePose(beat);
    samplePose(3.9);
    expect(samplePose(1.42)).toEqual(expected);
  });
});
