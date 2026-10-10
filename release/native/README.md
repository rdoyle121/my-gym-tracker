# Native app starter (not a completed app-store build)

This **separate Capacitor project** is a starter for compiling the cloud tracker for iOS and Android. It does not modify the original `index.html` tracker or deploy to GitHub Pages.

## Before you build
- Replace `com.example.mygymtracker` in `capacitor.config.json` with an app ID you own **before** generating native projects; changing it afterwards is disruptive.
- Confirm rights to the existing MG artwork and photographs.
- The app currently loads Supabase JS from a CDN and makes network requests to Supabase, image hosts and optional OpenStreetMap services. Packaging does **not** make it fully offline.
- Account recovery links, OAuth/deep links if introduced, location/notification permissions, secure storage, account deletion, and external URLs must be tested in native WebViews.
- Test that the cloud service worker is not interfering with native loading. Native shells may require disabling PWA service-worker registration.
- Use the MG icon/splash packs from the release artwork task to configure Xcode and Android Studio; the artwork is not automatically installed by this scaffold.

## Build locally (requires Node.js, Android Studio; macOS + Xcode for iOS)
```sh
cd release/native
npm install
npm run native:add:android
npm run native:open:android
# macOS only:
npm run native:add:ios
npm run native:open:ios
```
After updating web code, run `npm run native:sync` and rebuild each platform.

The `prepare-web.mjs` script stages a copy of `cloud-gym.html` as `dist/index.html` plus selected assets. Review network imports and every dynamically requested asset before claiming release readiness. Do not commit generated `dist/`, `android/`, or `ios/` directories.

## Remaining gates
1. Make sign-in/password recovery work with native navigation and deep links.
2. Audit all dependencies, RLS security, private photo handling and backup/deletion behaviour.
3. Test on physical iPhone and Android devices, including flaky connections.
4. Finalise privacy policy with operator identity and support contact.
5. Configure final bundle IDs, signing, branded launcher icons/splash screens and permissions.
6. Produce native release builds, store screenshots and complete Apple/Google declarations.

**Status:** preparation scaffold only. No native binaries have been built and no store submissions have occurred.
