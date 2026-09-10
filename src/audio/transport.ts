import { CHART } from '../game/chart';
import { BEAT, DURATION, RULES } from '../game/config';
import type { EventKind } from '../game/battle';

export class Transport {
  // The isolated rig study uses this same clock/lifecycle with a simple click
  // score. Default construction retains the prototype's original score.
  constructor(private readonly previewBpm?: number) {}

  private context?: AudioContext;
  private master?: GainNode;
  private origin = 0;
  private nextTick = -8;
  private voices = new Set<AudioScheduledSourceNode>();
  private noise?: AudioBuffer;
  private volume = 0.65;

  get time() {
    return this.context
      ? this.context.currentTime - this.origin
      : -RULES.countInBeats * BEAT;
  }
  get state() {
    return this.context?.state;
  }

  async unlock() {
    if (!this.context || this.context.state === 'closed') {
      this.context = new AudioContext({ latencyHint: 'interactive' });
      this.master = this.context.createGain();
      const limiter = this.context.createDynamicsCompressor();
      limiter.threshold.value = -10;
      limiter.ratio.value = 8;
      this.master.connect(limiter).connect(this.context.destination);
      this.master.gain.value = this.volume * 0.65;
      this.noise = this.context.createBuffer(
        1,
        this.context.sampleRate * 0.15,
        this.context.sampleRate,
      );
      const data = this.noise.getChannelData(0);
      let seed = 93;
      for (let i = 0; i < data.length; i++) {
        seed = (seed * 16807) % 2147483647;
        data[i] = (seed / 2147483647) * 2 - 1;
      }
    }
    await this.context.resume();
  }

  async start() {
    await this.unlock();
    this.stopVoices();
    this.origin = this.context!.currentTime + RULES.countInBeats * BEAT + 0.06;
    this.nextTick = -8;
    this.schedule();
  }

  seek(seconds: number) {
    if (!this.context) return;
    this.stopVoices();
    this.origin = this.context.currentTime - Math.max(0, seconds);
    const beat = this.previewBpm ? 60 / this.previewBpm : BEAT;
    this.nextTick = Math.ceil(
      (Math.max(0, seconds) / beat) * (this.previewBpm ? 1 : 4),
    );
    this.schedule();
  }

  setVolume(value: number) {
    this.volume = value;
    if (this.master && this.context)
      this.master.gain.setTargetAtTime(
        value * 0.65,
        this.context.currentTime,
        0.015,
      );
  }
  async pause() {
    if (this.context?.state === 'running') await this.context.suspend();
  }
  async resume() {
    await this.context?.resume();
  }
  stopVoices() {
    for (const voice of this.voices) {
      try {
        voice.stop();
      } catch {
        /* Already ended. */
      }
    }
    this.voices.clear();
  }
  async stop() {
    this.stopVoices();
    await this.pause();
  }

  private tone(
    frequency: number,
    at: number,
    duration: number,
    gain: number,
    type: OscillatorType = 'sine',
    endFrequency = frequency,
  ) {
    const ctx = this.context;
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, at);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, endFrequency),
      at + duration,
    );
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(gain, at + 0.006);
    envelope.gain.exponentialRampToValueAtTime(0.001, at + duration);
    osc.connect(envelope).connect(this.master);
    this.voices.add(osc);
    osc.onended = () => {
      this.voices.delete(osc);
      osc.disconnect();
      envelope.disconnect();
    };
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  private hat(at: number, accent: boolean) {
    const ctx = this.context;
    if (!ctx || !this.master || !this.noise) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noise;
    filter.type = 'highpass';
    filter.frequency.value = accent ? 1800 : 6500;
    gain.gain.setValueAtTime(accent ? 0.12 : 0.045, at);
    gain.gain.exponentialRampToValueAtTime(0.001, at + (accent ? 0.12 : 0.045));
    source.connect(filter).connect(gain).connect(this.master);
    this.voices.add(source);
    source.onended = () => {
      this.voices.delete(source);
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
    source.start(at);
    source.stop(at + 0.15);
  }

  schedule() {
    const ctx = this.context;
    if (!ctx || ctx.state !== 'running') return;
    if (this.previewBpm) {
      const beat = 60 / this.previewBpm;
      // Skip missed ticks after a main-thread stall rather than playing a burst.
      this.nextTick = Math.max(this.nextTick, Math.ceil(this.time / beat));
      while (this.origin + this.nextTick * beat < ctx.currentTime + 0.15) {
        const tick = this.nextTick++;
        const at = this.origin + tick * beat;
        const local = ((tick % 24) + 24) % 24;
        const ictus = [5, 7, 9, 11].includes(local);
        this.tone(
          ictus ? 330 : local % 4 === 0 ? 880 : 660,
          at,
          0.065,
          ictus ? 0.25 : 0.1,
          'triangle',
        );
      }
      return;
    }
    const ahead = ctx.currentTime + 0.12;
    while (
      this.origin + (this.nextTick * BEAT) / 4 < ahead &&
      this.nextTick < RULES.beats * 4
    ) {
      const tick = this.nextTick++;
      const beat = tick / 4;
      const at = this.origin + beat * BEAT;
      if (at < ctx.currentTime) continue;
      if (beat < 0) {
        if (tick % 4 === 0) this.tone(660, at, 0.06, 0.16);
        continue;
      }
      const phrase = Math.floor(beat / 16);
      const offbeat = tick % 8 === 4;
      if (tick % 4 === 0) this.tone(130, at, 0.16, 0.35, 'sine', 42);
      if (tick % 2 === 0 || (phrase >= 3 && tick % 16 >= 12))
        this.hat(at, offbeat);
      if (tick % 4 === 0) {
        const root = [49, 58.27, 43.65, 65.41][Math.floor(beat / 8) % 4];
        this.tone(root, at, BEAT * 0.85, 0.095, 'triangle');
      }
      if (tick % 2 === 0) {
        const semitones = [0, 7, 12, 10, 3, 7, 15, 10];
        this.tone(
          196 * 2 ** (semitones[(tick / 2 + phrase) % 8] / 12),
          at,
          0.1,
          0.035,
          'triangle',
        );
      }
      // Chart impact sounds belong to the same clock and score as the music.
      const attacks = CHART.filter((n) => Math.abs(n.beat - beat) < 0.001);
      if (attacks.length) {
        const n = attacks[0];
        this.tone(
          n.kind === 'resonant'
            ? 784
            : n.kind === 'barrier'
              ? 98
              : 220 + n.lane * 55,
          at,
          0.09,
          n.kind === 'resonant' ? 0.13 : 0.065,
          'triangle',
        );
      }
    }
  }

  effect(kind: EventKind) {
    if (!this.context || this.context.state !== 'running') return;
    const at = this.context.currentTime;
    const sounds: Partial<
      Record<EventKind, [number, number, number, OscillatorType, number]>
    > = {
      absorb: [880, 0.12, 0.18, 'sine', 1320],
      fire: [520, 0.18, 0.15, 'triangle', 180],
      'boss-hit': [196, 0.25, 0.3, 'triangle', 784],
      damage: [110, 0.16, 0.22, 'sawtooth', 38],
      blocked: [160, 0.08, 0.12, 'square', 75],
      jump: [260, 0.1, 0.035, 'sine', 520],
      miss: [120, 0.05, 0.04, 'sine', 110],
    };
    const s = sounds[kind];
    if (s) this.tone(s[0], at, s[1], s[2], s[3], s[4]);
  }
}

export const TRACK_INFO = `${RULES.bpm} BPM · ${DURATION} SEC`;
