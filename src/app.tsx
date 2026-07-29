import { createCat, mountCat, PLAYER_RIGHT_SELECTOR } from "./cat";
import { loadSettings } from "./config";
import { debug, error, setDebug } from "./logger";
import { showSettings } from "./settings-ui";
import { applyVisualSettings, installStyles } from "./styles";
import { BeatSynchronizer } from "./synchronizer";
import type { CatSettings } from "./types";

async function main(): Promise<void> {
  while (
    !Spicetify?.Player?.addEventListener ||
    !Spicetify?.getAudioData ||
    !Spicetify?.PopupModal
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  let settings: CatSettings = loadSettings();
  setDebug(settings.debug);
  installStyles(settings);

  const cat = createCat();
  const synchronizer = new BeatSynchronizer(cat, () => settings);

  const ensureMounted = (): void => {
    const correctParent = document.querySelector(PLAYER_RIGHT_SELECTOR);

    if (!correctParent) {
      return;
    }

    if (cat.parentElement !== correctParent) {
      mountCat(cat, settings.position);
      synchronizer.synchronize();
      debug("Cat mounted in rebuilt player");
      return;
    }

    if (
      (settings.position === "start" && correctParent.firstChild !== cat) ||
      (settings.position === "end" && correctParent.lastChild !== cat)
    ) {
      mountCat(cat, settings.position);
    }
  };

  const observer = new MutationObserver(ensureMounted);
  observer.observe(document.body, { childList: true, subtree: true });

  for (let attempt = 0; attempt < 100 && !cat.isConnected; attempt++) {
    ensureMounted();
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!cat.isConnected) {
    observer.disconnect();
    error("Right player section was not found");
    return;
  }

  cat.addEventListener("click", () => {
    showSettings(settings, (nextSettings) => {
      settings = nextSettings;
      setDebug(settings.debug);
      applyVisualSettings(settings);
      mountCat(cat, settings.position);
      synchronizer.updateSettings();
      Spicetify.showNotification("Jamming Cat settings saved");
    });
  });

  Spicetify.Player.addEventListener("onplaypause", () => {
    synchronizer.handlePlayPause();
  });

  Spicetify.Player.addEventListener("onprogress", () => {
    synchronizer.handleProgress();
  });

  Spicetify.Player.addEventListener("songchange", () => {
    void synchronizer.refreshTrack();
  });

  window.addEventListener(
    "beforeunload",
    () => {
      observer.disconnect();
      synchronizer.destroy();
    },
    { once: true },
  );

  await synchronizer.refreshTrack();
  Spicetify.showNotification("Jamming Cat ready — click it for settings");
}

export default main;
