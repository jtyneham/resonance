import { describe, expect, it } from 'vitest';
import {
  sampleIctus,
  ICTUS_MS,
  ICTUS_RELEASE_MS,
} from '../src/lab/ictus-score';

describe('complete Ictus timing', () => {
  it('starts and finishes in the same upright idle', () => {
    expect(sampleIctus(0).phase).toBe('Upright idle');
    expect(sampleIctus(ICTUS_MS)).toMatchObject({
      frame: sampleIctus(0).frame,
      phase: 'Upright idle',
    });
  });
  it('prepares and strikes quickly, then gives recovery most of the gesture', () => {
    expect(sampleIctus(50).phase).toBe('Preparation');
    expect(sampleIctus(ICTUS_RELEASE_MS - 1).phase).toBe('Fast downstroke');
    expect(sampleIctus(ICTUS_RELEASE_MS)).toMatchObject({
      frame: 0,
      phase: 'Ictus · attack release',
    });
    expect(sampleIctus(500).phase).toBe('Recovery');
    expect(sampleIctus(999).phase).toBe('Return to upright');
    expect(ICTUS_MS - ICTUS_RELEASE_MS).toBe(800);
  });
  it('samples safely on seek boundaries and non-finite input', () => {
    for (const time of [-100, Number.NaN, Infinity])
      expect(sampleIctus(time)).toEqual(sampleIctus(0));
    expect(sampleIctus(5000)).toEqual(sampleIctus(ICTUS_MS));
  });
});
