import type { BpmMode } from "./types";

export const VIDEO_DEFAULT_BPM = 135.48;

/**
 * Spotify can describe the same groove in half-time or double-time. Keeping
 * the animation within this perceptual range avoids extreme fast or sluggish motion.
 */
export function normalizeBpm(bpm: number): number {
  let normalized = bpm;

  while (normalized > 150) {
    normalized /= 2;
  }

  while (normalized < 75) {
    normalized *= 2;
  }

  return normalized;
}

export function chooseBpm(bpm: number, mode: BpmMode): number {
  return mode === "normalized" ? normalizeBpm(bpm) : bpm;
}

export function playbackRateForBpm(bpm: number, mode: BpmMode): number {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    return 1;
  }

  return chooseBpm(bpm, mode) / VIDEO_DEFAULT_BPM;
}
