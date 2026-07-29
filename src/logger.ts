let debugEnabled = false;

export function setDebug(enabled: boolean): void {
  debugEnabled = enabled;
}

export function debug(...values: unknown[]): void {
  if (debugEnabled) {
    console.log("[JAMMING-CAT]", ...values);
  }
}

export function warn(...values: unknown[]): void {
  console.warn("[JAMMING-CAT]", ...values);
}

export function error(...values: unknown[]): void {
  console.error("[JAMMING-CAT]", ...values);
}
