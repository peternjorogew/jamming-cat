import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const builtExtension = resolve(projectRoot, "dist/jamming-cat.js");
const configPath = execFileSync("spicetify", ["-c"], {
  encoding: "utf8",
}).trim();
const extensionsDirectory = resolve(dirname(configPath), "Extensions");
const installedExtension = resolve(extensionsDirectory, "jamming-cat.js");

await mkdir(extensionsDirectory, { recursive: true });
await copyFile(builtExtension, installedExtension);

execFileSync("spicetify", ["config", "extensions", "jamming-cat.js"], {
  stdio: "inherit",
});
execFileSync("spicetify", ["apply"], { stdio: "inherit" });

console.log(`Installed ${installedExtension}`);
