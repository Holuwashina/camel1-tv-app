#!/bin/sh
# Builds a universal (Intel + Apple Silicon) "Ninety.app" and a .dmg.
# Set SIGN_ID to a "Developer ID Application: ..." identity to sign for distribution.
set -e
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin
APP="target/Ninety.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
lipo -create -output "$APP/Contents/MacOS/ninety" \
  target/x86_64-apple-darwin/release/ninety \
  target/aarch64-apple-darwin/release/ninety
cp bundle/icon.icns "$APP/Contents/Resources/icon.icns"
cp bundle/Info.plist "$APP/Contents/Info.plist"
if [ -n "$SIGN_ID" ]; then
  codesign --force --options runtime --timestamp --sign "$SIGN_ID" "$APP"
else
  codesign --force --sign - "$APP"
fi
STAGE=target/dmg
rm -rf "$STAGE" target/Ninety.dmg
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "Ninety" -srcfolder "$STAGE" -ov -format UDZO target/Ninety.dmg >/dev/null
rm -rf "$STAGE"
echo "Built: $APP and target/Ninety.dmg"
