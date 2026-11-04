#!/bin/sh
# Builds a universal (Intel + Apple Silicon) "Camel1 TV.app" and a .dmg.
# Set SIGN_ID to a "Developer ID Application: ..." identity to sign for distribution.
set -e
cargo build --release --target x86_64-apple-darwin
cargo build --release --target aarch64-apple-darwin
APP="target/Camel1 TV.app"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
lipo -create -output "$APP/Contents/MacOS/camel1" \
  target/x86_64-apple-darwin/release/camel1 \
  target/aarch64-apple-darwin/release/camel1
cp bundle/icon.icns "$APP/Contents/Resources/icon.icns"
cp bundle/Info.plist "$APP/Contents/Info.plist"
if [ -n "$SIGN_ID" ]; then
  codesign --force --options runtime --timestamp --sign "$SIGN_ID" "$APP"
else
  codesign --force --sign - "$APP"
fi
STAGE=target/dmg
rm -rf "$STAGE" target/Camel1-TV.dmg
mkdir -p "$STAGE"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
hdiutil create -volname "Camel1 TV" -srcfolder "$STAGE" -ov -format UDZO target/Camel1-TV.dmg >/dev/null
rm -rf "$STAGE"
echo "Built: $APP and target/Camel1-TV.dmg"
