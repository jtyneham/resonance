export interface Settings {
  volume: number;
  reducedMotion: boolean;
}
export interface RecordData {
  score: number;
  clears: number;
}
const SETTINGS_KEY = 'resonance.settings.v1';
const RECORD_KEY = 'resonance.dummy.record.v1';
function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private storage may be unavailable; gameplay remains usable. */
  }
}
export function loadSettings(): Settings {
  const v = read(SETTINGS_KEY) as Partial<Settings> | null;
  return {
    volume:
      typeof v?.volume === 'number' && Number.isFinite(v.volume)
        ? Math.max(0, Math.min(1, v.volume))
        : 0.65,
    reducedMotion:
      typeof v?.reducedMotion === 'boolean'
        ? v.reducedMotion
        : matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}
export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings);
}
export function loadRecord(): RecordData {
  const v = read(RECORD_KEY) as Partial<RecordData> | null;
  return {
    score:
      typeof v?.score === 'number' && Number.isFinite(v.score)
        ? Math.max(0, v.score)
        : 0,
    clears:
      typeof v?.clears === 'number' && Number.isFinite(v.clears)
        ? Math.max(0, v.clears)
        : 0,
  };
}
export function saveClear(score: number) {
  const record = loadRecord();
  write(RECORD_KEY, {
    score: Math.max(score, record.score),
    clears: record.clears + 1,
  });
}
