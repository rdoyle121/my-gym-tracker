# Native app starter (not a completed app-store build)

This **separate Capacitor project** is a starter for compiling the cloud tracker for iOS and Android. It does not modify the original `index.html` tracker or deploy to GitHub Pages.

## Before you build
- Proposed native bundle/application ID: `com.rdoyle121.mygymtracker`. Confirm store availability and your right to use the identifier before publishing. It replaces the testing placeholder; app IDs are difficult to change after release. Existing APKs with the old ID are treated by Android as separate apps, not in-place updates.
- Confirm rights to the existing MG artwork and photographs.
- The app currently loads Supabase JS from a CDN and makes network requests to Supabase, image hosts and optional OpenStreetMap services. Packaging does **not** make it fully offline.
- Password-reset emails from the native build are configured to return to the **hosted cloud website**, not a native deep link. Users can complete recovery in their browser and then log into the native app. Confirm this flow and allowlist the hosted redirect URL in Supabase Authentication settings. Sign-up confirmation, location/notification permissions, secure storage, account deletion, and external URLs still require native WebView testing.
- The staging script disables the cloud PWA service worker in the native-only HTML copy. Confirm this works on both platforms.
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

## Native readiness caveats (10 October 2026)
- Hosted password recovery URL: `https://rdoyle121.github.io/my-gym-tracker/cloud-gym.html`. Add it to Supabase Auth redirect allowlist before testing.
- Email sign-up confirmation may still open the hosted website; verify that session handling and returning to the native shell are clear to users.
- The current app's third-party Supabase JS module CDN remains an online dependency, so this scaffold is **not offline-ready**.
- Capacitor native WebViews have different origins from GitHub Pages. Review Supabase allowed URLs, CSP/CORS, system-browser navigation, image uploads, location access and notification permissions.
- The packaged native app requires real device testing before release. Nothing here claims an iOS/Android build was produced.

## Automatic Android test APK (GitHub Actions)
A workflow at `.github/workflows/android-debug.yml` builds an **Android debug APK**, not a signed store release.
1. Open **Actions → Android debug APK (test only)** in this GitHub repository.
2. Run the workflow manually if needed, or check the workflow triggered by updates to native files.
3. After it succeeds, open its run and download `my-gym-tracker-android-debug-apk` under **Artifacts**. Extract the ZIP to find `app-debug.apk`.
4. Only install the debug APK on a test Android device you control. Debug APKs are not for public distribution and must not be uploaded as Google Play production packages.

The workflow requires GitHub Actions to be enabled on the repo. The workflow **has not been verified to build successfully yet**, and native sign-in/photo/location behaviour remains untested.

Never enter a production password into an unverified test build unless you trust the source and build. The current app uses real Supabase endpoints, so consider a separate test account.

## iOS simulator build (GitHub Actions)
The workflow `.github/workflows/ios-simulator.yml` generates an **unsigned simulator-only .app** on a macOS GitHub runner. It does not create an installable iPhone IPA or App Store release.

To review the run, open **Actions → iOS simulator build (test only)**. If it succeeds, the artifact is `my-gym-tracker-ios-simulator`, containing a zipped simulator .app. It can be installed into a compatible Xcode simulator after extraction, **not directly onto an iPhone**.

For a real iPhone test you will need an Apple signing team, an owned bundle identifier, Xcode/native provisioning, a development or TestFlight distribution build, and device testing. Do not provide Apple credentials or signing secrets in chat. The native iOS build has not been validated yet.

## MG icon in iOS builds
The iOS CI workflow runs `npm run native:brand:ios` after generating the Capacitor iOS project. This creates an opaque 1024×1024 AppIcon PNG from the repository's existing `icon.svg` and replaces the generated iOS AppIcon asset catalog. The icon artwork is not a replacement for a signed device build or store review. If building locally on a Mac, run this command after `npm run native:add:ios`.

## iOS permission prompts
The iOS CI build runs `node apply-ios-privacy.mjs` after generating the iOS project. It adds camera, photo-library and when-in-use location usage descriptions to the generated `Info.plist`. These do not grant permissions automatically; iOS still asks the person before access, when the relevant API is used. Test these flows on a physical iPhone before release. The app's existing browser photo-picker may not invoke every native permission. Review final App Store privacy disclosures and remove any unused purpose strings before submitting.

## Android release bundle (unsigned, not uploadable to Google Play)
The workflow `.github/workflows/android-release-bundle.yml` runs `./gradlew bundleRelease` and uploads an **unsigned** Android App Bundle (`.aab`). This is for validating the release build process, not for store submission or phone installation. Release signing, a securely backed-up upload key, versionCode/versionName management, store declarations, Play Console access and a review of all dependencies and permissions remain required. Never add a keystore, keystore passwords or Play credentials to GitHub source control. The workflow has not yet been confirmed to pass.
