export type BpmMode = "normalized" | "raw";
export type CatPosition = "start" | "end";

export interface CatSettings {
  size: number;
  opacity: number;
  brightness: number;
  position: CatPosition;
  bpmMode: BpmMode;
  respectReducedMotion: boolean;
  debug: boolean;
}

export interface Beat {
  start: number;
  duration?: number;
}

export interface AudioAnalysis {
  track?: {
    tempo?: number;
  };
  beats?: Beat[];
}
