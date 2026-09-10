import { describe, expect, it } from 'vitest';
import {
  LAB_BEAT,
  keyframes,
  localBeat,
  samplePose,
  visibleWaves,
} from '../src/lab/score';

describe('Conductor pose timeline', () => {
  it('seeks directly to the same pose after dropped frames or backward scrubbing', () => {
    const expected = samplePose(14.25);
    for (let time = 0; time < 14.25; time += 1 / 120) samplePose(time);
    expect(samplePose(14.25)).toEqual(expected);
    samplePose(20);
    expect(samplePose(14.25)).toEqual(expected);
    expect(samplePose(38.25)).toEqual(expected);
  });
  it('releases each arc on the downbeat and never shows an unborn wave', () => {
    for (const release of [5, 7, 9, 11]) {
      expect(
        visibleWaves(release - 0.0001).some((w) => w.progress < 0.001),
      ).toBe(false);
      expect(visibleWaves(release).some((w) => w.progress === 0)).toBe(true);
      expect(samplePose(release).cue).toBe('Ictus · release');
    }
    expect(visibleWaves(0)).toEqual([]);
    expect(visibleWaves(15)).toEqual([]);
  });
  it('articulates three free fingers independently while keeping the grip unchanged', () => {
    const pose = samplePose(13.2);
    expect(pose.fingers[0]).toEqual([0, 0, 0]);
    expect(pose.fingers[1]).toEqual([0, 0, 0]);
    expect(pose.fingers[2]).not.toEqual(pose.fingers[3]);
    expect(pose.fingers[3]).not.toEqual(pose.fingers[4]);
  });
  it('returns to the resting pose continuously across clip and loop boundaries', () => {
    for (const b of [0, 4, 12, 20, 24]) {
      const a = samplePose(b - 0.00001),
        c = samplePose(b);
      expect(a.wrist).toBeCloseTo(c.wrist, 4);
      expect(a.lift).toBeCloseTo(c.lift, 4);
      a.fingers
        .flat()
        .forEach((v, i) => expect(v).toBeCloseTo(c.fingers.flat()[i], 4));
    }
  });
  it('maps isolated clips and holds keyframe endpoints without overshoot', () => {
    expect(localBeat(8 * LAB_BEAT, 'ictus')).toBe(4);
    expect(localBeat(0, 'fingers')).toBe(12);
    expect(
      keyframes(-1, [
        [0, 2],
        [1, 4],
      ]),
    ).toBe(2);
    expect(
      keyframes(5, [
        [0, 2],
        [1, 4],
      ]),
    ).toBe(4);
  });
});
