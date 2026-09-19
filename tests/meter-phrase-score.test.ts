import { describe, expect, it } from 'vitest';
import {
  METER_PHRASE_MS,
  meterPhraseFrame,
  meterPhraseTime,
  phraseBeatAt,
  visiblePhraseAttacks,
} from '../src/lab/meter-phrase-score';

describe('Changing Meter 3+2 phrase', () => {
  it('loops seamlessly over one five-beat bar', () => {
    expect(meterPhraseTime(0)).toBe(0);
    expect(meterPhraseTime(METER_PHRASE_MS)).toBe(0);
    expect(meterPhraseFrame(0)).toBe(0);
    expect(meterPhraseFrame(METER_PHRASE_MS - 1)).toBe(19);
    expect(meterPhraseFrame(METER_PHRASE_MS)).toBe(0);
  });

  it('places strong accents on beats one and four', () => {
    expect(phraseBeatAt(0)).toMatchObject({ beat: 1, accent: 'strong' });
    expect(phraseBeatAt(500)).toMatchObject({ beat: 2, accent: 'weak' });
    expect(phraseBeatAt(1_500)).toMatchObject({ beat: 4, accent: 'strong' });
  });

  it('keeps beat two as a rest and releases pipes on beat four', () => {
    expect(phraseBeatAt(500).attack).toBeUndefined();
    expect(phraseBeatAt(1_500).attack).toMatchObject({
      kind: 'pipes',
      width: 2,
    });
    expect(visiblePhraseAttacks(500).every(({ beat }) => beat !== 2)).toBe(
      true,
    );
  });
});
