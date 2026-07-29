import { playbackRateForBpm } from "./bpm";
import { debug, error, warn } from "./logger";
import type { AudioAnalysis, CatSettings } from "./types";

export class BeatSynchronizer {
  private audioData: AudioAnalysis | null = null;
  private timer: number | undefined;
  private requestVersion = 0;
  private lastProgress = 0;
  private lastProgressAt = performance.now();

  public constructor(
    private readonly cat: HTMLVideoElement,
    private getSettings: () => CatSettings,
  ) {}

  public async refreshTrack(): Promise<void> {
    const requestVersion = ++this.requestVersion;
    await new Promise((resolve) => setTimeout(resolve, 250));

    try {
      const audioData = (await Spicetify.getAudioData()) as AudioAnalysis;

      if (requestVersion !== this.requestVersion) {
        debug("Discarded stale audio-analysis response");
        return;
      }

      this.audioData = audioData;
      this.updatePlaybackRate();
      this.synchronize();
    } catch (caughtError) {
      if (requestVersion !== this.requestVersion) {
        return;
      }

      this.audioData = null;
      this.cat.playbackRate = 1;
      warn("Audio analysis unavailable; using default speed", caughtError);
      this.synchronize();
    }
  }

  public updateSettings(): void {
    this.updatePlaybackRate();
    this.synchronize();
  }

  public handlePlayPause(): void {
    this.synchronize();
  }

  public handleProgress(): void {
    const now = performance.now();
    const progress = Spicetify.Player.getProgress();
    const expectedProgress = this.lastProgress + (now - this.lastProgressAt);
    const jumped = Math.abs(progress - expectedProgress) > 900;

    this.lastProgress = progress;
    this.lastProgressAt = now;

    if (jumped) {
      debug("Seek detected; resynchronizing", { progress, expectedProgress });
      this.synchronize();
    }
  }

  public synchronize(): void {
    this.cancelTimer();

    if (
      !Spicetify.Player.isPlaying() ||
      this.shouldRespectReducedMotion()
    ) {
      this.cat.pause();
      return;
    }

    const progressSeconds = Spicetify.Player.getProgress() / 1000;
    const beats = this.audioData?.beats;

    if (!beats?.length) {
      this.safePlay();
      return;
    }

    const upcomingBeat = beats.find((beat) => beat.start > progressSeconds);

    if (!upcomingBeat) {
      this.safePlay();
      return;
    }

    const delay = Math.max(0, (upcomingBeat.start - progressSeconds) * 1000);
    this.cat.pause();

    this.timer = window.setTimeout(() => {
      this.cat.currentTime = 0;
      this.safePlay();
      debug("Aligned animation to beat", upcomingBeat.start);
    }, delay);
  }

  public destroy(): void {
    this.requestVersion++;
    this.cancelTimer();
    this.cat.pause();
  }

  private updatePlaybackRate(): void {
    const rawBpm = Number(this.audioData?.track?.tempo);
    const settings = this.getSettings();
    this.cat.playbackRate = playbackRateForBpm(rawBpm, settings.bpmMode);

    debug("Playback rate updated", {
      rawBpm,
      mode: settings.bpmMode,
      playbackRate: this.cat.playbackRate,
    });
  }

  private shouldRespectReducedMotion(): boolean {
    return (
      this.getSettings().respectReducedMotion &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  private cancelTimer(): void {
    if (this.timer !== undefined) {
      window.clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  private safePlay(): void {
    this.cat.play().catch((caughtError) => {
      error("Video playback failed", caughtError);
    });
  }
}
