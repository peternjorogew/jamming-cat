import CAT_VIDEO_URL from "./catVideo";
import type { CatPosition } from "./types";

export const CAT_ID = "jamming-cat";
export const PLAYER_RIGHT_SELECTOR = ".main-nowPlayingBar-right";

export function createCat(): HTMLVideoElement {
  document.getElementById(CAT_ID)?.remove();

  const cat = document.createElement("video");
  cat.id = CAT_ID;
  cat.src = CAT_VIDEO_URL;
  cat.loop = true;
  cat.muted = true;
  cat.autoplay = false;
  cat.playsInline = true;
  cat.title = "Jamming Cat — click for settings";
  cat.setAttribute("aria-label", "Open Jamming Cat settings");
  return cat;
}

export function mountCat(
  cat: HTMLVideoElement,
  position: CatPosition,
): boolean {
  const playerRight = document.querySelector(PLAYER_RIGHT_SELECTOR);

  if (!playerRight) {
    return false;
  }

  if (position === "start") {
    playerRight.insertBefore(cat, playerRight.firstChild);
  } else {
    playerRight.appendChild(cat);
  }

  return true;
}
