# Jamming Cat

A learning-focused Spicetify extension that places an animated cat in the
right-hand section of Spotify's player and synchronizes its WebM animation to
track beat data.

## Features

- Pauses and resumes with Spotify playback.
- Aligns the animation to Spotify's beat timestamps.
- Detects seeking and resynchronizes.
- Normalizes half-time and double-time BPM values.
- Ignores stale audio-analysis responses after rapid track changes.
- Reinserts itself if Spotify rebuilds the player DOM.
- Embeds the local WebM into the compiled extension.
- Provides click-to-open settings for size, opacity, brightness, position,
  BPM handling, reduced motion, and debug logging.

## Requirements

- Spotify Desktop with Spicetify
- Node.js and npm

## Development

Install dependencies:

```bash
npm install
```

Build a standalone extension:

```bash
npm run build
```

The compiled extension is written to `dist/jamming-cat.js`.

Build, copy the extension to Spicetify, enable it, and apply Spicetify:

```bash
npm run deploy
```

After deployment, completely quit and reopen Spotify. Click the cat to change
its settings.

## Project structure

```text
assets/catjam.webm       Source animation
scripts/embed-asset.mjs  Generates the embedded TypeScript data URL
scripts/deploy.mjs       Cross-platform local deployment
src/app.tsx              Extension lifecycle and Spotify events
src/bpm.ts               BPM normalization and playback rate
src/cat.ts               Video creation and mounting
src/config.ts            Persistent settings
src/settings-ui.ts       Settings modal
src/styles.ts            Appearance and CSS variables
src/synchronizer.ts      Beat timing, seeking, and stale-request handling
```

## BPM synchronization

The source WebM naturally animates at approximately `135.48 BPM`. The playback
rate is calculated as:

```text
selected track BPM / 135.48
```

Normalized mode moves double-time BPM values above 150 into half-time and
half-time values below 75 into double-time. Raw mode uses Spotify's tempo
without adjustment.

## Asset note

`assets/catjam.webm` was supplied with this learning project. Verify the
animation's reuse rights and provide appropriate attribution before publishing
the extension.
