# My Gym Tracker — development-only native packaging scaffold

This folder is a **starting point for Android and iOS development builds**, not an App Store submission or signed distributable.

## How to build on a development machine

Requirements: a supported Node.js/npm version for Capacitor 7, Android Studio and its SDK (Android), or macOS with Xcode (iOS). Do not run native builds directly from GitHub Pages.

```sh
cd native
npm install
npx cap add android
npx cap add ios   # macOS / Xcode only
npx cap sync
npx cap open android
npx cap open ios   # macOS / Xcode only
```

The `capacitor.config.json` currently has a **remote `server.url`** pointed at the public cloud app. This is intended only for **early development/testing**. The checked-in `www/index.html` is a minimal offline fallback, not the full app. Network access is required to use the remote app. It does not yet integrate Capacitor-specific secure storage, native notifications, photo permissions or offline handling.

## Before store submission

1. Bundle and build audited app assets locally, remove development-only remote `server.url`, and verify dependencies, service-worker behaviour, auth redirects and account syncing in a real WebView.
2. Finalise the **MG** icons and launch/splash assets in each native target. The PNG icon and splash packs were created separately; they are not yet committed into native target projects.
3. Test account creation, recovery, deletion, private photo upload, permissions, offline sync conflicts, and navigation on real Android and iOS devices.
4. Validate App Store and Play Store rules, including Apple minimum-functionality guidelines for wrapped websites and Google's quality requirements. A web wrapper alone may be rejected.
5. Update `appId` to an owned and verified identifier before release; configure signing, privacy declarations, contact/support, privacy policy and store screenshots.
6. Confirm that the hosted app and third-party script/image resources have appropriate availability, privacy documentation and rights.

**Safety:** The original `index.html`, `sw.js`, and live `cloud-gym.html` are not modified by this native scaffold. This scaffold does not create a built APK, AAB or IPA. No app-store accounts are connected or submissions made.
