import { afterEach, describe, expect, it, vi } from 'vitest';
import { Battle } from '../src/game/battle';
import { Transport } from '../src/audio/transport';
import { RULES } from '../src/game/config';
import { loadRecord, saveClear } from '../src/game/storage';
import { DUMMY_ENCOUNTER } from '../src/game/encounters/dummy';
import {
  beatSeconds,
  countInSeconds,
  durationSeconds,
  phraseAt,
  remainingTime,
  trackInfo,
  type EncounterDefinition,
} from '../src/game/encounter';

// Test-only, not a second selectable boss. Deliberately differs from Dummy.
const alternate: EncounterDefinition = {
  id: 'test-score',
  name: 'Test score',
  description: 'Test only',
  bpm: 90,
  beats: 96,
  countInBeats: 3,
  bossHp: 2,
  chart: [
    {
      id: 0,
      beat: 1,
      hit: 2 / 3,
      lane: 2,
      width: 1,
      kind: 'resonant',
      travel: 0.5,
    },
    {
      id: 1,
      beat: 3,
      hit: 2,
      lane: 2,
      width: 1,
      kind: 'resonant',
      travel: 0.5,
    },
  ],
  phrases: [
    { beat: 0, label: 'OPEN' },
    { beat: 9, label: 'CHANGE' },
  ],
};

describe('encounter isolation', () => {
  it('preserves existing Dummy records and isolates another encounter', () => {
    const records = new Map([
      ['resonance.dummy.record.v1', JSON.stringify({ score: 1200, clears: 2 })],
    ]);
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => records.get(key) ?? null,
      setItem: (key: string, value: string) => records.set(key, value),
    });
    expect(loadRecord('dummy')).toEqual({ score: 1200, clears: 2 });
    expect(loadRecord(alternate.id)).toEqual({ score: 0, clears: 0 });
    saveClear(alternate.id, 500);
    expect(loadRecord(alternate.id)).toEqual({ score: 500, clears: 1 });
    expect(loadRecord('dummy')).toEqual({ score: 1200, clears: 2 });
    saveClear('dummy', 1000);
    expect(loadRecord('dummy')).toEqual({ score: 1200, clears: 3 });
  });
  it('retains the original Dummy settings', () => {
    expect([
      DUMMY_ENCOUNTER.bpm,
      DUMMY_ENCOUNTER.beats,
      DUMMY_ENCOUNTER.bossHp,
      countInSeconds(DUMMY_ENCOUNTER),
    ]).toEqual([160, 120, 5, 0.75]);
    expect(durationSeconds(DUMMY_ENCOUNTER)).toBe(45);
    expect(trackInfo(DUMMY_ENCOUNTER)).toBe('160 BPM · 45 SEC');
    expect(remainingTime(DUMMY_ENCOUNTER, -0.81)).toBe('0:45');
  });

  it('uses a different tempo, count-in, duration and phrase boundaries', () => {
    expect(beatSeconds(alternate)).toBe(2 / 3);
    expect(countInSeconds(alternate)).toBe(2);
    expect(durationSeconds(alternate)).toBe(64);
    expect(trackInfo(alternate)).toBe('90 BPM · 64 SEC');
    expect(remainingTime(alternate, -2)).toBe('1:04');
    expect(remainingTime(alternate, 5)).toBe('0:59');
    expect(remainingTime(alternate, 65)).toBe('0:00');
    expect(phraseAt(alternate, -2)).toBe('OPEN');
    expect(phraseAt(alternate, 5.99)).toBe('OPEN');
    expect(phraseAt(alternate, 6)).toBe('CHANGE');
    expect(phraseAt({ ...alternate, phrases: [] }, 6)).toBe('');
  });

  it('uses its own chart and health without changing shared player rules', () => {
    const battle = new Battle(alternate);
    expect(battle.time).toBe(-2);
    expect(battle.hp).toBe(RULES.playerHp);
    expect(battle.bossHp).toBe(2);
    battle.update(2);
    expect(battle.charge).toBe(2);
    battle.act('resonate', 2);
    battle.update(2 + RULES.shotDuration);
    expect(battle.bossHp).toBe(1);
    expect(battle.outcome).toBe('playing');
    const retry = new Battle(alternate);
    expect(retry.bossHp).toBe(2);
    expect(retry.resolved.size).toBe(0);
    expect(new Battle(DUMMY_ENCOUNTER).bossHp).toBe(5);
  });

  it('does not time out at the old 45-second boundary', () => {
    const battle = new Battle(alternate);
    battle.update(45);
    expect(battle.outcome).toBe('playing');
    battle.update(64);
    expect(battle.outcome).toBe('timeout');
  });

  it.each([true, false])(
    'resolves shots against its own track ending: before=%s',
    (before) => {
      const battle = new Battle(alternate);
      battle.bossHp = 1;
      battle.charge = 2;
      battle.act('resonate', 64 - (before ? RULES.shotDuration + 0.1 : 0.1));
      battle.update(65);
      expect(battle.outcome).toBe(before ? 'victory' : 'timeout');
    },
  );
});

// Minimal clock/audio-node doubles; synthesized voices are spied separately.
class TestAudioContext {
  currentTime = 100;
  state = 'running';
  sampleRate = 100;
  destination = {};
  createGain() {
    return {
      gain: { value: 0 },
      connect: () => ({ connect: () => undefined }),
    };
  }
  createDynamicsCompressor() {
    return { threshold: { value: 0 }, ratio: { value: 0 } };
  }
  createBuffer() {
    return { getChannelData: () => new Float32Array(15) };
  }
  async resume() {
    this.state = 'running';
  }
  async suspend() {
    this.state = 'suspended';
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('encounter audio clock', () => {
  it.each([DUMMY_ENCOUNTER, alternate])(
    'uses $id count-in and score, including after seek',
    async (encounter) => {
      vi.stubGlobal('AudioContext', TestAudioContext);
      const audio = new Transport(encounter);
      const voices = audio as unknown as {
        tone: (...args: unknown[]) => void;
        hat: (...args: unknown[]) => void;
      };
      const tone = vi.spyOn(voices, 'tone').mockImplementation(() => undefined);
      vi.spyOn(voices, 'hat').mockImplementation(() => undefined);
      expect(audio.time).toBe(-countInSeconds(encounter));
      await audio.start();
      expect(audio.time).toBeCloseTo(-countInSeconds(encounter) - 0.06);
      const first = encounter.chart.find((note) => note.kind === 'resonant')!;
      tone.mockClear();
      audio.seek(first.hit);
      expect(audio.time).toBeCloseTo(first.hit);
      expect(
        tone.mock.calls.some(
          ([frequency, at]) =>
            frequency === 784 && Math.abs(Number(at) - 100) < 0.001,
        ),
      ).toBe(true);
      await audio.pause();
      expect(audio.state).toBe('suspended');
      tone.mockClear();
      audio.schedule();
      expect(tone).not.toHaveBeenCalled();
      await audio.resume();
      expect(audio.state).toBe('running');
      audio.seek(durationSeconds(encounter) + 1);
      expect(tone).not.toHaveBeenCalled();
    },
  );
});
