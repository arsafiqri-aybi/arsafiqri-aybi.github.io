# ARS Portfolio v2 — Checkpoint 06 verification record

**Scope:** Authentic Media & Evidence, development branch only. **DO NOT** interpret this record as a deployment authorization.

## Media integrated
1. **ARS portrait** — owner-authenticated, explicitly authorized for **Home and About only**, 360 × 360 WebP, 3,936 bytes, no readable EXIF metadata. Public file `assets/ars-portrait.webp`; Git blob SHA `591e0c6156808dcbd79490389cf23ef33ccb5ae7` independently matched to the generated local file. Resized from owner-uploaded original without stylistic alteration. Home is identity-first while Tari remains uncleared.
2. **Motion Render Video** — the original six-second MP4 still uses native controls, playsinline, and no autoplay/loop. Its source is pinned to owner repo commit `ac73856a159587db1aa936409fd718bd5115ae5b`; GitHub read confirmed the binary file exists at this commit (blob `e93f1a71cf88a63383ab900316c8e0f0deda94a9`). Source `media-report.json` supports codec/decode/timing checks within declared scope; no actual browser playback was performed here.

## Strict holds
- Tari Cookies team Hi-Fi media, brand and related footage: rights/attribution PENDING.
- waai.id extracted video/poster/music: cross-platform reuse rights PENDING.
- SarafCare business branding, ad creative, metrics: evidence, rights and privacy gates PENDING.
- Hey/PBO: existing editorial illustrations remain labeled as **illustrations**, not screenshots; authentic capture and sanitization pending.
- No owner portrait usage for OG/social, CV, LinkedIn, marketing or project galleries.

## Verification actually executed
- **Media manifest test suite:** 19/19 PASS using the exact committed code, with Node-compatible test mocks in a JavaScript evaluation environment (NOT a GitHub Actions CI run). Registry validation returned no issues.
- **Generator:** 11 generated outputs in an **in-memory simulated filesystem**, including seven legacy case pages, Home, 404, sitemap and robots. Generator raised no error. Fourteen checks PASS: portrait only Home/About, authentic alt, OG isolation, immutable Motion URL, native manual playback, held projects absent, seven legacy routes, evidence anchors, sitemap coverage, no portrait in case pages, no undefined links, no filename/privacy leak, no autoplay.
- **GitHub binary integrity:** read back exact portrait Git blob with matching SHA, local Pillow decoded 360×360 WebP and found zero EXIF entries.
- **Motion pinned source:** GitHub read confirmed commit-pinned MP4 exists.

## NOT RUN / NOT CLAIMED
Physical device/browser screenshot review, screen-reader testing, visual crop assessment on responsive breakpoints, playable MP4 HTTP range response and audiovisual perception, network performance/Lighthouse, human usability evaluation, complete Node site build from an authentic checkout, production URL checks, public release.

## Git protection
GitHub Pages builds from `main:/`; no merge to main, no deployment or GitHub CI operations performed. Work stays on `feat/ars-portfolio-v2-t1-foundation`.

## Next checkpoint
Visual/interaction and responsive browser QA should check portrait sharpness and crop on high-density screens (the current approved photo is 360×360), keyboard focus/return-to-context, reduced motion, source-video controls and responsive gallery compositions. Improve the portrait rendition as needed from the original approved image before requesting publication.
