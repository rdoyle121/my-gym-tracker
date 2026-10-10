# My Gym Tracker — Apple App Privacy / Google Play Data safety working audit
Updated: 10 October 2026. **Internal draft, NOT ready to submit.**

## Verified app features (source: cloud-gym.html, cloud-privacy.html, native build scaffold)
| Data or service | Current handling | Possible store declaration; verify final category |
|---|---|---|
| Account email / authentication | Supabase Auth; email and authentication session | Contact information (email), identifiers/user ID |
| Workouts, exercises, notes and gym visits | Local browser storage and account-specific Supabase sync | Health & fitness / app activity or user content as relevant |
| Food diary, targets and shopping list | Locally stored; uploaded through Supabase account sync | Health & fitness, app activity or other user content |
| Body weight / measurements | Locally stored and synced | Health & fitness |
| Progress photos | Local gallery, optional private cloud photo upload | Photos / user content (cloud uploads only); verify native photo library access |
| Nearby gyms search | Opt-in location request and OpenStreetMap Overpass request | Precise or approximate location depending on actual coordinates |
| Error logs / IP addresses / infrastructure | Supabase, GitHub Pages, CDN/image and Overpass hosts can receive technical metadata | Review diagnostics, identifiers and external processor policies |

## Preliminary Apple answers
- **Collect data? YES.** Do not select 'No data collected'.
- **Linked to user?** Account-based Supabase data is linked to authenticated identity; answer appropriately for each data type.
- **Tracking?** No deliberate advertising/tracking SDK identified in reviewed app code, but audit all third-party services and network traffic before declaring 'No tracking'.
- Verify optional collection, purposes (app functionality), retention/deletion, analytics and encryption against the distributed native binary.

## Preliminary Google Play answers
- **Collect data? YES.** User data is transmitted to Supabase and optionally to the location provider.
- **Can users request deletion?** In-app self-deletion has been tested; account-deletion instructions are published. Verify locked-out-user handling and current Play requirements.
- **Encrypted in transit?** Requests appear to use HTTPS; independently verify all production endpoints and network security settings before selecting this answer.
- **Shared with third parties?** Needs a processor-by-processor review using Google's 'sharing' definition and service-provider exemptions. Do not automatically mark 'No'.
- For every category, verify required/optional, linked or unlinked, purposes, handling, and whether storage is local only versus server-side.

## Key issues before filing forms
1. Audit the final built Android APK and iOS bundle for permissions, third-party SDKs, requests and native storage.
2. Confirm data retention, backup deletion, Supabase auth and storage lifecycle, service-provider terms and lawful privacy notices.
3. Review jsDelivr, photo host, OpenStreetMap Overpass, GitHub Pages and Supabase privacy handling.
4. Validate wording of public privacy policy and operator identity / contact. Existing privacy page is explicitly a *pre-release draft*.
5. Confirm age restrictions, whether health information needs special treatment, and regional obligations.
6. Confirm Google Play account-deletion external URL requirements and Apple user-facing privacy choices.
7. Publish final app-store forms **only after** review; use this document as a checklist, not as definitive answers.

## Public pages
Privacy draft: https://rdoyle121.github.io/my-gym-tracker/cloud-privacy.html
Support: https://rdoyle121.github.io/my-gym-tracker/cloud-support.html
Account deletion: https://rdoyle121.github.io/my-gym-tracker/cloud-delete-account.html

## Policy references
Apple App Store Connect: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en

No live data, credentials or customer records are included in this audit.
