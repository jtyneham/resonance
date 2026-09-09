export const RULES = {
  lanes: 5,
  bpm: 160,
  beats: 120,
  countInBeats: 2,
  playerHp: 3,
  bossHp: 5,
  jumpDuration: 0.52,
  jumpClearStart: 0.06,
  jumpClearEnd: 0.46,
  absorbWindow: 0.12,
  immunity: 0.85,
  shotDuration: 0.62,
  actionCooldown: 0.09,
} as const;

export const BEAT = 60 / RULES.bpm;
export const DURATION = RULES.beats * BEAT;
