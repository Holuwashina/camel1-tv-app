# Ninety

Live football in its own app. macOS build in `macos/` (tao + wry); Android, Windows and
Linux builds in `tauri/` (Tauri 2). Both load the same page and inject the same two
scripts at document start: `theme.js` (look) and `adblock.js` (page behaviour), concatenated
at compile time.

## Rules

- `macos/src/theme.js` and `tauri/src-tauri/src/theme.js` must stay identical, as must
  the two `adblock.js` files. Edit the `macos/` copy, then copy it over.
- Design: one accent `#5FD36B`; Inter for text, Barlow Condensed for numbers; three themes
  (Dark, Light, Daybreak) as token sets at the top of `theme.js`; 12 px cards, 8 px square
  segmented controls. Brand sources in `brand/`. Never use "Camel" in our own branding.
- Identifiers: `app.getninety.desktop` (Mac, executable `ninety`) and `app.getninety.mobile`
  (Android). Changing the Android one makes a new app for users; don't.
- Versions live in `macos/Cargo.toml`, `macos/bundle/Info.plist`,
  `tauri/src-tauri/Cargo.toml` and `tauri.conf.json`. Release assets are
  `Ninety-macOS.dmg`, `Ninety-Android.apk`, `Ninety-Windows-Setup.exe`, `Ninety-Linux.AppImage`,
  `Ninety-Linux.deb`; the download page and README link to those fixed names.
- Public copy (README, `docs/`, release notes, commit messages) describes what the app is,
  in the brand voice: short statements, full stops, no exclamation marks.
- `tauri/src-tauri/gen/android/keystore.properties` is gitignored; never commit it.
- Measure, don't assume: give numbers for any performance claim.

Build steps: `BUILDING.md`.
