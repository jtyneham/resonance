import { describe, expect, it } from 'vitest';
import { Battle, type Action } from '../src/game/battle';
import { BEAT, DURATION, RULES } from '../src/game/config';
import { CHART, makeChart, type Note } from '../src/game/chart';

const note = (
  id: number,
  hit: number,
  kind: Note['kind'] = 'resonant',
  lane = 2,
  width = 1,
): Note => ({ id, beat: hit / BEAT, hit, lane, width, kind, travel: 0.75 });

describe('movement and collision rules', () => {
  it('has five lanes with clamped movement and one step per action', () => {
    const b = new Battle([]);
    for (let i = 0; i < 10; i++) b.act('left', 0);
    expect(b.lane).toBe(0);
    b.act('right', 0);
    expect(b.lane).toBe(1);
    for (let i = 0; i < 10; i++) b.act('right', 0);
    expect(b.lane).toBe(4);
  });
  it('allows exactly one successful lane change per jump', () => {
    const b = new Battle([]);
    b.act('jump', 0);
    b.act('left', 0.1);
    b.act('right', 0.2);
    expect(b.lane).toBe(1);
    b.act('right', 0.6);
    expect(b.lane).toBe(2);
    b.act('jump', 0.7);
    b.act('right', 0.8);
    expect(b.lane).toBe(3);
  });
  it('an edge input does not consume the airborne movement', () => {
    const b = new Battle([]);
    b.lane = 0;
    b.act('jump', 0);
    b.act('left', 0.1);
    b.act('right', 0.2);
    expect(b.lane).toBe(1);
  });
  it('clears a low wave while airborne, even across a dropped frame', () => {
    const b = new Battle([note(0, 1, 'dark')]);
    b.act('jump', 0.85);
    b.update(1.8);
    expect(b.hp).toBe(3);
  });
  it('cannot jump a tall barrier', () => {
    const b = new Battle([note(0, 1, 'barrier')]);
    b.act('jump', 0.85);
    b.update(1.01);
    expect(b.hp).toBe(2);
  });
  it('wide waves cover each occupied lane, and only those lanes', () => {
    for (let lane = 0; lane < 5; lane++) {
      const b = new Battle([note(0, 1, 'dark', 1, 3)]);
      b.lane = lane;
      b.update(1);
      expect(b.hp).toBe(lane >= 1 && lane <= 3 ? 2 : 3);
    }
  });
  it('clears resonance on damage, with immunity across a dense burst', () => {
    const b = new Battle([
      note(0, 1, 'dark'),
      note(1, 1.1, 'dark'),
      note(2, 2, 'dark'),
    ]);
    b.charge = 2;
    b.update(1.2);
    expect(b.hp).toBe(2);
    expect(b.charge).toBe(0);
    b.update(2.1);
    expect(b.hp).toBe(1);
  });
});

describe('absorb and counterattack', () => {
  it.each([-0.12, 0, 0.12])('absorbs at window offset %s', (offset) => {
    const b = new Battle([note(0, 1)]);
    b.act('resonate', 1 + offset);
    expect(b.charge).toBe(1);
    b.update(1.3);
    expect(b.hp).toBe(3);
  });
  it('rejects an early absorb, dark notes and airborne attempts', () => {
    const early = new Battle([note(0, 1)]);
    early.act('resonate', 0.87);
    expect(early.charge).toBe(0);
    const dark = new Battle([note(0, 1, 'dark')]);
    dark.act('resonate', 0.99);
    expect(dark.charge).toBe(0);
    const air = new Battle([note(0, 1)]);
    air.act('jump', 0.85);
    air.act('resonate', 1);
    expect(air.charge).toBe(0);
  });
  it('prioritizes an in-range absorb over firing a ready shot', () => {
    const b = new Battle([note(0, 1)]);
    b.charge = 2;
    b.act('resonate', 1);
    expect(b.stats.absorbs).toBe(1);
    expect(b.charge).toBe(2);
    expect(b.shots).toHaveLength(0);
    b.act('resonate', 1.2);
    expect(b.shots).toHaveLength(1);
    expect(b.charge).toBe(0);
  });
  it('requires two distinct notes and does not reuse an absorbed note', () => {
    const b = new Battle([note(0, 1), note(1, 2)]);
    b.act('resonate', 1);
    b.act('resonate', 1.1);
    expect(b.charge).toBe(1);
    b.act('resonate', 2);
    b.act('resonate', 2.2);
    b.update(3);
    expect(b.bossHp).toBe(4);
    expect(b.stats.hits).toBe(1);
  });
  it('a tall barrier intercepts a shot in its lane', () => {
    const b = new Battle([note(0, 1.6, 'barrier')]);
    b.charge = 2;
    b.act('resonate', 1);
    expect(b.shots[0].blocked).toBe(true);
    b.act('left', 1.1);
    b.update(1.7);
    expect(b.bossHp).toBe(5);
    expect(b.stats.blocked).toBe(1);
  });
  it('barriers in other lanes or outside the flight window cannot block', () => {
    const b = new Battle([note(0, 1.6, 'barrier', 0), note(1, 4, 'barrier')]);
    b.charge = 2;
    b.act('resonate', 1);
    b.update(1.7);
    expect(b.stats.hits).toBe(1);
  });
});

describe('encounter lifecycle', () => {
  it('loses after three separate hits and ignores later actions', () => {
    const b = new Battle([
      note(0, 1, 'dark'),
      note(1, 2, 'dark'),
      note(2, 3, 'dark'),
    ]);
    b.update(3.1);
    expect(b.outcome).toBe('defeat');
    b.act('left', 4);
    expect(b.lane).toBe(2);
  });
  it('times out, rather than winning by surviving', () => {
    const b = new Battle([]);
    b.update(DURATION);
    expect(b.outcome).toBe('timeout');
  });
  it('cannot win with a shot that arrives after the track ends', () => {
    const b = new Battle([]);
    b.bossHp = 1;
    b.charge = 2;
    b.act('resonate', DURATION - 0.1);
    b.update(DURATION + 1);
    expect(b.outcome).toBe('timeout');
  });
  it('wins with a shot arriving before timeout even across a delayed frame', () => {
    const b = new Battle([]);
    b.bossHp = 1;
    b.charge = 2;
    b.act('resonate', DURATION - RULES.shotDuration - 0.1);
    b.update(DURATION + 0.1);
    expect(b.outcome).toBe('victory');
  });
  it('new battle fully resets retry state', () => {
    const old = new Battle();
    old.hp = 0;
    old.charge = 2;
    old.outcome = 'defeat';
    const retry = new Battle();
    expect(retry.hp).toBe(3);
    expect(retry.charge).toBe(0);
    expect(retry.resolved.size).toBe(0);
    expect(retry.time).toBeLessThan(0);
  });
});

describe('authored chart', () => {
  it('is deterministic, ordered, valid and exercises the complete vocabulary', () => {
    expect(makeChart()).toEqual(CHART);
    expect(new Set(CHART.map((n) => n.width))).toEqual(new Set([1, 2, 3]));
    expect(new Set(CHART.map((n) => n.kind))).toEqual(
      new Set(['dark', 'resonant', 'barrier']),
    );
    expect(CHART.some((n) => n.travel < 2 * BEAT)).toBe(true);
    for (const n of CHART) {
      expect(n.lane).toBeGreaterThanOrEqual(0);
      expect(n.lane + n.width).toBeLessThanOrEqual(5);
      expect(n.hit).toBeLessThan(DURATION);
    }
    expect(CHART.map((n) => n.hit)).toEqual(
      CHART.map((n) => n.hit).sort((a, b) => a - b),
    );
  });
  it('has a no-damage winning route through every main phrase at 30 Hz', () => {
    const b = new Battle();
    const input: { time: number; action: Action }[] = [];
    const add = (beat: number, action: Action) =>
      input.push({ time: beat * BEAT, action });
    for (let phrase = 0; phrase < 7; phrase++) {
      const base = phrase * 16;
      add(base + 4, 'resonate');
      add(base + 5, 'resonate');
      // Save the final hit for the coda to exercise the entire chart before victory.
      if (phrase >= 3) add(base + 5.5, 'resonate');
      const out: Action = phrase % 2 ? 'left' : 'right';
      const back: Action = phrase % 2 ? 'right' : 'left';
      add(base + 6, out);
      add(base + 6.1, out);
      add(base + 13.1, 'jump');
      add(base + 14.7, back);
      add(base + 14.8, back);
    }
    add(114, 'resonate');
    add(115, 'resonate');
    add(115.5, 'resonate');
    add(116.6, 'jump');
    input.sort((a, b) => a.time - b.time);
    let frame = 0;
    for (const event of input) {
      while (frame < event.time) {
        b.update(frame);
        frame += 1 / 30;
      }
      // Actions at exact input timestamps; render frames are otherwise independent.
      b.act(event.action, event.time);
    }
    b.update(DURATION);
    expect(b.stats.damage).toBe(0);
    expect(b.outcome).toBe('victory');
    expect(b.stats.hits).toBe(5);
    expect(b.stats.absorbs).toBe(16);
  });
});
