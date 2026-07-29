import { DEFAULT_SETTINGS, saveSettings } from "./config";
import type { CatSettings } from "./types";

function numberInput(
  labelText: string,
  value: number,
  minimum: number,
  maximum: number,
  step: number,
): { row: HTMLLabelElement; input: HTMLInputElement } {
  const row = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");

  text.textContent = labelText;
  input.type = "number";
  input.min = String(minimum);
  input.max = String(maximum);
  input.step = String(step);
  input.value = String(value);

  row.append(text, input);
  return { row, input };
}

function checkbox(
  labelText: string,
  checked: boolean,
): { row: HTMLLabelElement; input: HTMLInputElement } {
  const row = document.createElement("label");
  const text = document.createElement("span");
  const input = document.createElement("input");

  text.textContent = labelText;
  input.type = "checkbox";
  input.checked = checked;
  row.append(text, input);
  return { row, input };
}

export function showSettings(
  current: CatSettings,
  onSave: (settings: CatSettings) => void,
): void {
  const form = document.createElement("form");
  form.className = "jamming-cat-settings";

  const size = numberInput("Size (px)", current.size, 40, 100, 1);
  const opacity = numberInput("Opacity", current.opacity, 0.2, 1, 0.05);
  const brightness = numberInput(
    "Brightness",
    current.brightness,
    0.3,
    1.4,
    0.05,
  );
  const reducedMotion = checkbox(
    "Respect reduced-motion",
    current.respectReducedMotion,
  );
  const debug = checkbox("Debug logging", current.debug);

  const positionRow = document.createElement("label");
  const positionText = document.createElement("span");
  const position = document.createElement("select");
  positionText.textContent = "Player position";
  position.innerHTML = `
    <option value="start">Start of right controls</option>
    <option value="end">End of right controls</option>
  `;
  position.value = current.position;
  positionRow.append(positionText, position);

  const bpmRow = document.createElement("label");
  const bpmText = document.createElement("span");
  const bpmMode = document.createElement("select");
  bpmText.textContent = "BPM handling";
  bpmMode.innerHTML = `
    <option value="normalized">Normalized (recommended)</option>
    <option value="raw">Raw Spotify BPM</option>
  `;
  bpmMode.value = current.bpmMode;
  bpmRow.append(bpmText, bpmMode);

  const actions = document.createElement("div");
  actions.className = "jamming-cat-settings__actions";

  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset";

  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = "Save";
  save.className = "jamming-cat-settings__save";
  actions.append(reset, save);

  form.append(
    size.row,
    opacity.row,
    brightness.row,
    positionRow,
    bpmRow,
    reducedMotion.row,
    debug.row,
    actions,
  );

  const collect = (): CatSettings => ({
    size: Number(size.input.value),
    opacity: Number(opacity.input.value),
    brightness: Number(brightness.input.value),
    position: position.value === "start" ? "start" : "end",
    bpmMode: bpmMode.value === "raw" ? "raw" : "normalized",
    respectReducedMotion: reducedMotion.input.checked,
    debug: debug.input.checked,
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onSave(saveSettings(collect()));
    Spicetify.PopupModal.hide();
  });

  reset.addEventListener("click", () => {
    onSave(saveSettings({ ...DEFAULT_SETTINGS }));
    Spicetify.PopupModal.hide();
  });

  Spicetify.PopupModal.display({
    title: "Jamming Cat settings",
    content: form,
    isLarge: false,
  });
}
