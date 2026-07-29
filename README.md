# Jamming Cat

This is a small Spicetify extension I made for fun while learning how
Spicetify extensions work.

It adds the CatJAM animation to the right side of Spotify's player. The cat
plays when the music is playing, pauses when the music pauses, and uses
Spotify's audio analysis to try to stay in sync with the beat.

## What it does

- Adds an animated cat to the right side of the player
- Starts and stops with Spotify playback
- Uses the track's BPM and beat timestamps for synchronization
- Detects when I seek to another part of a song and resynchronizes
- Normalizes very fast or slow BPM values so the cat does not look ridiculous
- Handles rapid song changes without using old track data
- Adds itself back if Spotify rebuilds the player interface
- Saves settings between Spotify restarts

Clicking the cat opens its settings. From there I can change:

- Size
- Opacity
- Brightness
- Position inside the right-side player controls
- Normalized or raw BPM handling
- Reduced-motion behaviour
- Debug logging

## Requirements

- Spotify Desktop
- [Spicetify](https://spicetify.app/)
- Node.js and npm

## Installation

Clone the repository and enter the project folder:

```bash
git clone https://github.com/peternjorogew/jamming-cat.git
cd jamming-cat
```

Install the dependencies:

```bash
npm install
```

Build and install the extension into Spicetify:

```bash
npm run deploy
```

After that, completely quit Spotify and open it again. The cat should appear
on the right side of the bottom player.

`npm run deploy` builds the extension, copies it into Spicetify's Extensions
folder, enables it in the Spicetify configuration, and runs `spicetify apply`.

## Development

To create a production build without installing it:

```bash
npm run build
```

The finished extension is written to:

```text
dist/jamming-cat.js
```

For development with automatic rebuilding:

```bash
npm run watch
```

The original animation lives at `assets/catjam.webm`. During the build,
`scripts/embed-asset.mjs` converts it into a data URL so the extension works as
one JavaScript file and does not depend on a separate local media path.

## How the synchronization works

The CatJAM animation naturally moves at about `135.48 BPM`. Spotify provides
audio-analysis data for the current track, including its tempo and beat
timestamps.

The extension calculates the animation speed like this:

```text
track BPM / 135.48
```

Normalized mode adjusts tracks detected in half-time or double-time into a
more natural range. This stops the cat from moving far too quickly or slowly.
It also waits for an upcoming beat before restarting the animation, and repeats
that process after seeking or changing songs.

The synchronization is still an approximation. The animation itself was not
created as a perfectly measured beat loop, and Spotify's analysis can differ
between tracks.

## Project structure

```text
assets/catjam.webm       CatJAM animation used by the extension
scripts/embed-asset.mjs  Embeds the WebM in the compiled JavaScript
scripts/deploy.mjs       Builds and installs the extension locally
src/app.tsx              Main extension lifecycle and Spotify events
src/bpm.ts               BPM normalization and playback-rate calculation
src/cat.ts               Creates and mounts the video element
src/config.ts            Loads and saves the extension settings
src/settings-ui.ts       Click-to-open settings window
src/styles.ts            Cat and settings-window styling
src/synchronizer.ts      Playback, beat, seek, and track synchronization
```

## Third-party asset

The `assets/catjam.webm` file is the widely shared CatJAM meme animation. I did
not create or claim ownership of this animation.

It is included as a third-party asset for this personal learning project. The
project's MIT code license does **not** grant any rights to the CatJAM
animation. Rights to that animation remain with its original creator or
rightsholder. If you are the rightsholder and would like it removed, please
open an issue and I will remove or replace it.

## Disclaimer

This is an unofficial community project. It is not affiliated with, supported
by, or endorsed by Spotify or Spicetify.

Spotify can change its desktop interface at any time, which may temporarily
break the extension or require its selectors to be updated.

## License

The source code is licensed under the MIT License. The third-party CatJAM
animation in `assets/catjam.webm` is excluded from that license.
