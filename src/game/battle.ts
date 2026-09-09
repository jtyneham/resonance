import { BEAT, DURATION, RULES } from './config';
import { CHART, type Note } from './chart';

export type Action = 'left' | 'right' | 'jump' | 'resonate';
export type Outcome = 'playing' | 'victory' | 'defeat' | 'timeout';
export type EventKind =
  | 'absorb'
  | 'fire'
  | 'blocked'
  | 'boss-hit'
  | 'damage'
  | 'miss'
  | 'jump'
  | 'move';
export interface BattleEvent {
  kind: EventKind;
  time: number;
  lane: number;
}
export interface Shot {
  born: number;
  lane: number;
  ends: number;
  blocked: boolean;
  resolved: boolean;
}
export interface Stats {
  absorbs: number;
  misses: number;
  hits: number;
  blocked: number;
  damage: number;
  combo: number;
  bestCombo: number;
  score: number;
}

export class Battle {
  time: number = -RULES.countInBeats * BEAT;
  lane = 2;
  hp: number = RULES.playerHp;
  bossHp: number = RULES.bossHp;
  charge = 0;
  jumpAt = -Infinity;
  airMoveUsed = false;
  immuneUntil = -Infinity;
  lastAction = -Infinity;
  outcome: Outcome = 'playing';
  resolved = new Set<number>();
  shots: Shot[] = [];
  events: BattleEvent[] = [];
  stats: Stats = {
    absorbs: 0,
    misses: 0,
    hits: 0,
    blocked: 0,
    damage: 0,
    combo: 0,
    bestCombo: 0,
    score: 0,
  };

  constructor(readonly chart: readonly Note[] = CHART) {}

  airborne(at = this.time) {
    return at >= this.jumpAt && at < this.jumpAt + RULES.jumpDuration;
  }
  clearsLow(at: number) {
    const age = at - this.jumpAt;
    return age >= RULES.jumpClearStart && age <= RULES.jumpClearEnd;
  }
  occupies(note: Note, lane = this.lane) {
    return lane >= note.lane && lane < note.lane + note.width;
  }
  emit(kind: EventKind) {
    this.events.push({ kind, time: this.time, lane: this.lane });
  }

  update(now: number) {
    if (this.outcome !== 'playing' || now < this.time) return;
    this.time = now;
    // Resolve chronological events even if a rendered frame was dropped.
    const due: { time: number; note?: Note; shot?: Shot }[] = [];
    for (const note of this.chart) {
      const time =
        note.hit + (note.kind === 'resonant' ? RULES.absorbWindow + 1e-7 : 0);
      if (!this.resolved.has(note.id) && time <= now) due.push({ time, note });
    }
    for (const shot of this.shots)
      if (!shot.resolved && shot.ends <= now)
        due.push({ time: shot.ends, shot });
    due.sort((a, b) => a.time - b.time);
    for (const event of due) {
      if (this.outcome !== 'playing') break;
      if (event.time > DURATION) break;
      const { note, shot } = event;
      if (note) {
        this.resolved.add(note.id);
        if (
          this.occupies(note) &&
          (note.kind === 'barrier' || !this.clearsLow(note.hit))
        )
          this.damage(event.time);
      }
      if (shot) {
        shot.resolved = true;
        if (shot.blocked) {
          this.stats.blocked++;
          this.emit('blocked');
        } else {
          this.bossHp--;
          this.stats.hits++;
          this.stats.score += 1000;
          this.emit('boss-hit');
          if (this.bossHp <= 0) {
            this.outcome = 'victory';
            this.stats.score += this.hp * 500;
          }
        }
      }
    }
    if (this.outcome === 'playing' && now >= DURATION) this.outcome = 'timeout';
  }

  damage(at: number) {
    if (at < this.immuneUntil) return;
    this.hp--;
    this.charge = 0;
    this.stats.damage++;
    this.stats.combo = 0;
    this.immuneUntil = at + RULES.immunity;
    this.emit('damage');
    if (this.hp <= 0) this.outcome = 'defeat';
  }

  act(action: Action, now = this.time) {
    this.update(now);
    if (this.outcome !== 'playing') return;
    if (action === 'left' || action === 'right') {
      if (this.airborne() && this.airMoveUsed) return;
      const next = Math.max(
        0,
        Math.min(RULES.lanes - 1, this.lane + (action === 'left' ? -1 : 1)),
      );
      if (next === this.lane) return;
      if (this.airborne()) this.airMoveUsed = true;
      this.lane = next;
      this.emit('move');
    } else if (action === 'jump') {
      if (this.airborne()) return;
      this.jumpAt = this.time;
      this.airMoveUsed = false;
      this.emit('jump');
    } else {
      if (this.time - this.lastAction < RULES.actionCooldown) return;
      this.lastAction = this.time;
      const target =
        !this.airborne() &&
        this.chart
          .filter(
            (n) =>
              n.kind === 'resonant' &&
              !this.resolved.has(n.id) &&
              this.occupies(n) &&
              Math.abs(n.hit - this.time) <= RULES.absorbWindow + 1e-8,
          )
          .sort(
            (a, b) => Math.abs(a.hit - this.time) - Math.abs(b.hit - this.time),
          )[0];
      if (target) {
        this.resolved.add(target.id);
        this.charge = Math.min(2, this.charge + 1);
        this.stats.absorbs++;
        this.stats.combo++;
        this.stats.bestCombo = Math.max(this.stats.bestCombo, this.stats.combo);
        this.stats.score += 200;
        this.emit('absorb');
      } else if (this.charge === 2) {
        this.charge = 0;
        const shot: Shot = {
          born: this.time,
          lane: this.lane,
          ends: this.time + RULES.shotDuration,
          blocked: false,
          resolved: false,
        };
        for (const n of this.chart) {
          if (n.kind !== 'barrier' || !this.occupies(n, shot.lane)) continue;
          // Solve the intersection of outgoing and incoming travel lines.
          const meeting =
            (1 +
              shot.born / RULES.shotDuration +
              (n.hit - n.travel) / n.travel) /
            (1 / RULES.shotDuration + 1 / n.travel);
          if (
            meeting >= shot.born &&
            meeting <= shot.ends &&
            meeting >= n.hit - n.travel &&
            meeting <= n.hit
          ) {
            shot.ends = meeting;
            shot.blocked = true;
          }
        }
        this.shots.push(shot);
        this.emit('fire');
      } else {
        this.stats.misses++;
        this.stats.combo = 0;
        this.emit('miss');
      }
    }
  }
}
