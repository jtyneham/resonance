export type AttackKind = 'dark' | 'resonant' | 'barrier';
export interface Note {
  id: number;
  beat: number;
  hit: number;
  lane: number;
  width: number;
  kind: AttackKind;
  travel: number;
}
