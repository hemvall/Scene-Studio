# Scene Studio

A browser-native studio for short character-driven animated videos. Build cinematic 3D scenes, direct expressive illustrated characters, write and compile scripts, edit deterministic timelines, add subtitles and sound, and export videos or portable JSON projects.

## Run locally

Use Node.js 24 and the repository's pinned pnpm version.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:5191/. The studio launches directly at the root; `/studio` works too.

## Features

- Project library, reel templates, English/French script variants and a scene director.
- Procedural characters and environments, camera framing, transforms and timeline animation.
- Deterministic scene evaluation, subtitles, audio synthesis/mixing and MP4/PNG/JSON export.
- Optional provider integrations use keys entered by the user. Local editing and the offline director work without API credentials. No credentials are committed.

See [the studio guide](docs/scene-studio.md) for detailed features, controls, architecture and current limitations.

## Verification

```sh
pnpm typecheck
pnpm test
pnpm build
```

## Standalone import

Imported from [hemvall/bloub PR #2](https://github.com/hemvall/bloub/pull/2), snapshot `e79ce382654f1e528e5dbc0408112d09bb01442d`. This repository contains the Scene Studio files introduced by that PR, with independent application/bootstrap/build configuration. The old SVG avatar editor, its assets, branding, author metadata and license file are not included. External music attribution metadata remains attached to the music library.

Browser data now uses the `scene-studio-` namespace. To move an existing saved project, export its JSON from the previous app and import it here.
