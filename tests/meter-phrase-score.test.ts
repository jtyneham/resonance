import { describe, expect, it } from 'vitest';
import {
  METER_PHRASE_MS,
  meterPhraseFrame,
  meterPhrasePose,
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
    expect(meterPhrasePose(2_325)).toEqual({ sheet: 'bridge', frame: 2 });
    expect(meterPhrasePose(2_400)).toEqual({ sheet: 'bridge', frame: 3 });
    expect(meterPhrasePose(2_450)).toEqual({ sheet: 'phrase', frame: 0 });
    expect(meterPhrasePose(METER_PHRASE_MS - 1)).toEqual({
      sheet: 'phrase',
      frame: 0,
    });
  });

  it('places strong accents on beats one and four', () => {
    expect(phraseBeatAt(0)).toMatchObject({ beat: 5, accent: 'weak' });
    expect(phraseBeatAt(250)).toMatchObject({ beat: 1, accent: 'strong' });
    expect(phraseBeatAt(750)).toMatchObject({ beat: 2, accent: 'weak' });
    expect(phraseBeatAt(1_750)).toMatchObject({ beat: 4, accent: 'strong' });
  });

  it('keeps beat two as a rest and releases pipes on beat four', () => {
    expect(phraseBeatAt(750).attack).toBeUndefined();
    expect(phraseBeatAt(1_750).attack).toMatchObject({
      kind: 'pipes',
      width: 2,
    });
    expect(visiblePhraseAttacks(750).every(({ beat }) => beat !== 2)).toBe(
      true,
    );
    expect(visiblePhraseAttacks(0).some(({ beat }) => beat === 5)).toBe(true);
  });
});
