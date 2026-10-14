import type { CatSettings } from "./types";

const STYLE_ID = "jamming-cat-styles";

export function installStyles(settings: CatSettings): void {
  document.getElementById(STYLE_ID)?.remove();

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #jamming-cat {
      width: var(--jamming-cat-size);
      height: var(--jamming-cat-size);
      flex: 0 0 var(--jamming-cat-size);
      align-self: center;
      max-height: calc(100% - 8px);
      margin-block: auto;
      box-sizing: border-box;
      object-fit: contain;
      object-position: center;
      position: relative;
      top: 0;
      transform: translateY(0);
      opacity: var(--jamming-cat-opacity);
      filter: brightness(var(--jamming-cat-brightness)) contrast(0.95);
      cursor: pointer;
      pointer-events: auto;
      transition: opacity 200ms ease, filter 200ms ease;
    }

    #jamming-cat:hover {
      opacity: 1;
      filter: brightness(1) contrast(1);
    }

    .jamming-cat-settings {
      display: grid;
      gap: 14px;
      min-width: 320px;
      color: var(--spice-text);
    }

    .jamming-cat-settings label {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 14px;
    }

    .jamming-cat-settings input[type="number"],
    .jamming-cat-settings select {
      width: 120px;
      padding: 7px 9px;
      color: var(--spice-text);
      background: var(--spice-main-elevated);
      border: 1px solid color-mix(in srgb, var(--spice-text) 16%, transparent);
      border-radius: 6px;
    }

    .jamming-cat-settings__actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 6px;
    }

    .jamming-cat-settings button {
      padding: 8px 14px;
      border: 0;
      border-radius: 999px;
      cursor: pointer;
    }

    .jamming-cat-settings__save {
      color: var(--spice-button-text);
      background: var(--spice-button);
    }
  `;

  document.head.appendChild(style);
  applyVisualSettings(settings);
}

export function applyVisualSettings(settings: CatSettings): void {
  const root = document.documentElement;
  root.style.setProperty("--jamming-cat-size", `${settings.size}px`);
  root.style.setProperty("--jamming-cat-opacity", String(settings.opacity));
  root.style.setProperty(
    "--jamming-cat-brightness",
    String(settings.brightness),
  );
}
