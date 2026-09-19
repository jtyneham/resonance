export const IDLE_FRAME_COUNT = 16;
export const IDLE_CYCLE_MS = 2_000;
export const IDLE_CELL_BOTTOM_GUTTER_PX = 4;
export const IDLE_FLOAT_DISTANCE_PX = 12;
const IDLE_EXPOSURE_COUNT = (IDLE_FRAME_COUNT - 1) * 2;
const IDLE_SHEET_COLUMNS = 4;
const IDLE_SHEET_ROWS = 4;

export function idleCellBounds(
  frame: number,
  sheetWidth: number,
  sheetHeight: number,
) {
  const safeFrame = Math.min(
    IDLE_FRAME_COUNT - 1,
    Math.max(0, Number.isFinite(frame) ? Math.floor(frame) : 0),
  );
  const column = safeFrame % IDLE_SHEET_COLUMNS;
  const row = Math.floor(safeFrame / IDLE_SHEET_COLUMNS);
  const left = Math.floor((column * sheetWidth) / IDLE_SHEET_COLUMNS);
  const right = Math.floor(((column + 1) * sheetWidth) / IDLE_SHEET_COLUMNS);
  const top = Math.floor((row * sheetHeight) / IDLE_SHEET_ROWS);
  const bottom = Math.floor(((row + 1) * sheetHeight) / IDLE_SHEET_ROWS);

  return { left, top, width: right - left, height: bottom - top };
}

export function idleTime(ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return ms % IDLE_CYCLE_MS;
}

export function idleFrame(ms: number) {
  const exposure = Math.min(
    IDLE_EXPOSURE_COUNT - 1,
    Math.floor((idleTime(ms) / IDLE_CYCLE_MS) * IDLE_EXPOSURE_COUNT),
  );
  return exposure < IDLE_FRAME_COUNT
    ? exposure
    : IDLE_EXPOSURE_COUNT - exposure;
}

export function idleFloatOffset(ms: number) {
  const phase = idleTime(ms) / IDLE_CYCLE_MS;
  const riseAndFall = Math.sin(phase * Math.PI) ** 2;
  return -IDLE_FLOAT_DISTANCE_PX * riseAndFall;
}

export function idleTipEnergy(ms: number) {
  const phase = idleTime(ms) / IDLE_CYCLE_MS;
  const slowPulse = (Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const quickPulse = (Math.sin(phase * Math.PI * 4 + Math.PI / 5) + 1) / 2;
  return 0.28 + slowPulse * 0.42 + quickPulse * 0.12;
}

export function isPaintedMatteSeed(red: number, green: number, blue: number) {
  const brightest = Math.max(red, green, blue);
  const darkest = Math.min(red, green, blue);
  return darkest >= 176 && brightest - darkest <= 13;
}

export function isNeutralMatteArtifact(
  red: number,
  green: number,
  blue: number,
) {
  const brightest = Math.max(red, green, blue);
  const darkest = Math.min(red, green, blue);
  return darkest >= 65 && brightest - darkest <= 20;
}

export function isInsideIdleGripVoid(
  x: number,
  y: number,
  cellWidth: number,
  cellHeight: number,
) {
  const normalizedX = x / cellWidth;
  const normalizedY = y / cellHeight;
  const dx = (normalizedX - 0.45) / 0.065;
  const dy = (normalizedY - 0.425) / 0.095;
  return dx * dx + dy * dy <= 1;
}

export function isPaintedMatteCandidate(
  red: number,
  green: number,
  blue: number,
) {
  const brightest = Math.max(red, green, blue);
  const darkest = Math.min(red, green, blue);
  return darkest >= 86 && brightest - darkest <= 64;
}

export function isBrightEdgeFringe(red: number, green: number, blue: number) {
  const brightest = Math.max(red, green, blue);
  const darkest = Math.min(red, green, blue);
  return darkest >= 55 && brightest - darkest <= 100;
}
