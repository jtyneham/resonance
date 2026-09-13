export type BossHazardKind = 'dark' | 'barrier';
export type StageOpportunityKind = 'resonant';

/**
 * Travel events currently share one chart because they use the same timing and
 * collision pipeline. `resonant` is deliberately NOT a boss attack: the stage
 * places those opportunities independently, and no boss gesture or attack
 * animation may spawn or promise one.
 */
export type ChartEventKind = BossHazardKind | StageOpportunityKind;
export interface Note {
  id: number;
  beat: number;
  hit: number;
  lane: number;
  width: number;
  kind: ChartEventKind;
  travel: number;
}
