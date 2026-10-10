# My Gym Tracker Cloud — store listing draft
Status: pre-release draft, not submitted. Updated 10 October 2026.

## Brand
Public-facing name (proposed): **My Gym Tracker**
Internal/home-screen cloud name: **Gym Tracker Cloud** (distinguishes beta from personal app).
Brand identity: existing red-and-black **MG** emblem, no people in workout artwork.

## App Store — proposed copy
**Name:** My Gym Tracker
**Subtitle:** Workouts, food & progress
**Description:**
Build a fitness routine that works for you. My Gym Tracker brings your training schedule, food diary and personal progress together in one place.

Create custom workout days, choose exercises and record sets, reps and weights. Keep track of your nutrition targets, quickly log favourite meals and organise your shopping list.

Stay consistent with progress tracking and private photo storage. Sign in to sync supported records across your devices.

Features include:
- Personal weekly training plans, including rest days
- Exercise tracking, sets, reps and weight history
- Calorie and protein goals with a daily food diary
- Favourite meals and a custom shopping checklist
- Weight and measurements tracking
- Optional private progress-photo cloud storage
- Secure sign-in and self-service account deletion

Syncing requires internet access. Exercise and nutrition data are entered by users; the app does not provide medical advice. Feature availability and device compatibility are subject to final testing.

**Keywords (draft):** gym,workout,fitness,training,food,protein,progress

## Google Play — proposed copy
**App name:** My Gym Tracker
**Short description:** Plan workouts, track food and follow your fitness progress.
**Full description:** Use the App Store description above as the starting point; customise wording and screenshots for Android after device testing.

## Screenshot storyboard (capture real app screenshots, use test data)
1. Today: weekly workout overview
2. Train: custom workout with exercise sets and reps
3. Food: calorie and protein tracking
4. Favourites: reusable meals and shopping list
5. Progress: weight/measurement overview
6. Photos: private progress-photo gallery (use a non-personal test image)

## Release blockers and reviews required
- Confirm legal app operator, support email/contact and final privacy policy
- Check Apple/Google policies, age rating, data declarations and account-deletion URL requirements at submission time
- Complete security and accessibility review, including screen-reader labels
- Native store builds / packaging and physical Android testing
- Prepare tested high-resolution PNG icons, splash assets and screenshots at required platform sizes
- Test sign-up, password recovery, cloud conflict resolution, account deletion, photo access and unreliable network behaviour
- Verify external image and media asset usage rights
- Avoid advertising medical or clinical claims

## Existing resources
- Cloud beta: https://rdoyle121.github.io/my-gym-tracker/cloud-gym.html
- Draft privacy information: https://rdoyle121.github.io/my-gym-tracker/cloud-privacy.html
- Current brand SVG: icon.svg
- Current install PNG: mg-rendered-icon.png (manifest currently declares 120x120; full-size exported app-store icons still needed)

This document is drafting material, not a claim that store requirements have been met.

## Public account deletion information
- Instructions URL (pre-release): https://rdoyle121.github.io/my-gym-tracker/cloud-delete-account.html
- In-app action: More → Account & Security → Delete My Account (requires authenticated user and explicit confirmation)
- The informational page is not an unauthenticated deletion request service. Before public launch, verify current Apple/Google requirements and add a support route for users unable to sign in.
