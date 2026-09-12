import { describe, expect, it } from 'vitest';
import {
  sampleStyled,
  WRIST_DURATION,
  WRIST_BEAT,
} from '../src/lab/styled-score';
import { wristMotion } from '../src/lab/wrist-motion';

describe('styled pose blocking', () => {
  it('uses the approved motion unchanged throughout the gesture', () => {
    for (let time = 0; time <= WRIST_DURATION; time++) {
      expect(sampleStyled(time).angle).toBe(wristMotion(time).angle);
      expect(sampleStyled(time).phase).toBe(wristMotion(time).phase);
    }
  });
  it('selects idle, extension and strike without old rejected poses', () => {
    expect(sampleStyled(0).frame).toBe(0);
    expect(sampleStyled(130).frame).toBe(1);
    expect(sampleStyled(WRIST_BEAT)).toMatchObject({ frame: 2, release: true });
    expect(sampleStyled(WRIST_BEAT + 1).angle).toBeLessThan(
      sampleStyled(WRIST_BEAT).angle,
    );
    expect(sampleStyled(WRIST_DURATION).frame).toBe(0);
  });
  it('clamps inspection safely', () => {
    for (const time of [NaN, Infinity, -1])
      expect(sampleStyled(time)).toEqual(sampleStyled(0));
    expect(sampleStyled(9999)).toEqual(sampleStyled(WRIST_DURATION));
  });
});
