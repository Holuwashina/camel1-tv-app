# Building Ninety

Native apps written in Rust. Each app is
a single window showing the site in the platform's own web view, with the
site's promo banners hidden, pop-ups blocked, and known ad redirects refused.

Independent, community-made.

**Downloads:** <https://holuwashina.github.io/ninety/> (served from
`docs/` by GitHub Pages; links point at the latest GitHub Release).

## Cutting a release

1. Build the Mac app (`macos/build.sh`) and the Android APK (below).
2. Create the release with those two files under the fixed asset names:
   ```bash
   gh release create v0.3.0 \
     "dist/Ninety-macOS.dmg" "dist/Ninety-Android.apk" \
     --title "Ninety 0.3.0" --notes "..."
   ```
3. Creating the tag triggers `.github/workflows/release.yml`, which builds the
   Windows and Linux installers on GitHub's runners and attaches them as
   `Ninety-Windows-Setup.exe`, `Ninety-Linux.AppImage` and
   `Ninety-Linux.deb`. The download page greys out any asset that is not
   on the latest release yet, so it is safe to publish before CI finishes.

The ad rules live in one file, `adblock.js`, which both apps inject at page
load. Keep the two copies identical.

## macos (tao + wry)

Plain `tao` + `wry`. Builds a universal (Intel + Apple Silicon) `.app` and a
`.dmg` with a drag-to-Applications layout.

```bash
cd macos
./build.sh
```

Output: `macos/target/Ninety.app` and `macos/target/Ninety.dmg`.

The build is ad-hoc signed. Other people can run it, but macOS shows a
"developer cannot be verified" warning on first open (right-click, Open). To
remove that warning you need an Apple Developer ID; then:

```bash
SIGN_ID="Developer ID Application: Your Name (TEAMID)" ./build.sh
```

Notarization is not scripted yet.

## tauri (Android, Windows, Linux)

Tauri 2 project. Desktop targets also build from it, but the Mac app above is
the one that ships.

Needs: Rust with the Android targets, Android SDK platform 35, build-tools 35,
NDK 27, Java 21, and `cargo tauri` (`cargo install tauri-cli --version "^2"`).

```bash
cd tauri
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
export ANDROID_HOME=$HOME/Library/Android/sdk
export NDK_HOME=$ANDROID_HOME/ndk/27.2.12479018
cargo tauri android build --apk --target aarch64 --target x86_64
```

Output: `src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release.apk`.

Release builds are signed with a key read from
`src-tauri/gen/android/keystore.properties` (not committed). The keystore
itself is `~/.android/camel1-release.keystore`. Back it up: without it, later
versions cannot be installed over earlier ones.

Users install the APK directly and must allow installs from unknown sources.
It is not published on Google Play.

## Icons

Both apps currently use the site's own touch icon. To swap in a custom logo,
replace the source image and rerun:

- macOS: regenerate `macos/bundle/icon.icns` (see `macos/build.sh` history)
- Android: `cargo tauri icon path/to/logo.png` inside `tauri/src-tauri`

## Not done

- iPhone build.
- Notarization for macOS.
- Video-player ads have not been checked.
