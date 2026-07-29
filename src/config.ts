import type { CatSettings } from "./types";

const STORAGE_KEY = "jamming-cat:settings:v1";

export const DEFAULT_SETTINGS: CatSettings = {
  size: 65,
  opacity: 0.78,
  brightness: 0.85,
  position: "end",
  bpmMode: "normalized",
  respectReducedMotion: true,
  debug: false,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function sanitize(candidate: Partial<CatSettings>): CatSettings {
  return {
    size: clamp(Number(candidate.size) || DEFAULT_SETTINGS.size, 40, 100),
    opacity: clamp(
      Number(candidate.opacity) || DEFAULT_SETTINGS.opacity,
      0.2,
      1,
    ),
    brightness: clamp(
      Number(candidate.brightness) || DEFAULT_SETTINGS.brightness,
      0.3,
      1.4,
    ),
    position: candidate.position === "start" ? "start" : "end",
    bpmMode: candidate.bpmMode === "raw" ? "raw" : "normalized",
    respectReducedMotion:
      candidate.respectReducedMotion ??
      DEFAULT_SETTINGS.respectReducedMotion,
    debug: candidate.debug ?? DEFAULT_SETTINGS.debug,
  };
}

export function loadSettings(): CatSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: CatSettings): CatSettings {
  const safeSettings = sanitize(settings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeSettings));
  return safeSettings;
}
