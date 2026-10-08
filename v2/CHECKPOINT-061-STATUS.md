# ARS — Checkpoint 06.1 status: source sync fixed; portrait hi-DPI still pending

## Scope and commits

Development branch only: `feat/ars-portfolio-v2-t1-foundation`.

- `bcd6155` — copy original six-frame Motion contact sheet (Git blob identical to source `1b259487f736970eeb8db34b05642ab48cac0ddb`) to website repository. Frame 179 is cropped into the preview using CSS.
- `29d6f4b` — add user-activated Motion preview button, motion source gate, reflow About at 900px, mobile photo sizing, and text-only social.svg aligned to Digital Builder × Business Strategist. No portrait in OG/social.
- `b4ec306` — regenerate and commit all 11 static outputs; the old-stale index.html and Motion case page are no longer the tracked HTML on this development branch.

## Direct GitHub verification

15/15 targeted static checks passed against exact tracked files: v2 identity, portrait only Home/About, legacy featured content removed, original poster source, manual player, immutable Motion source URL, held project routes absent, new social.svg, scoped manifest, Git blob matches for portrait360 and contact sheet.

## Portrait image quality: OPEN

Owner's actual portrait remains the valid 360×360 WebP in the public-safe branch, SHA256 `f702926df8aec4ce7865493f422aa24348cb2bddeb6b85359b165151d04a8467`, Git blob `591e0c6156808dcbd79490389cf23ef33ccb5ae7`.

An unretouched locally generated **800×800 WebP candidate** is verified (9888 bytes; SHA256 `d2578b49531b52d247eedb83064cb43b4bb0a84d65932e1abe410f3c03daf0b8`; expected Git blob `4a46765f2a93d57fdf30b23498b656b0aebc8113`). **This candidate is NOT yet committed**, due to a byte-transfer verification blocker between local staging and GitHub API. Never claim the branch currently hosts 800 pixels, and do not replace the valid 360 blob until the new blob SHA matches exactly. After verified upload, update manifest image dimensions and SHA256, regenerate all outputs and reverify.

## Evidence and rights gates remain locked

Portrait owner-approved only Home/About; Motion original source scoped to Motion case; Tari Cookies team materials HOLD, WAAI footage/music HOLD, SarafCare campaign assets and metrics HOLD. Hey/PBO are still source-based editorial illustrations, not real screenshot evidence.

## Not yet verified

Real Chromium visual snapshot of exact branch, keyboard + screen reader navigation, contrast and crop at phone/tablet/desktop across high DPR, video HTTP range and playback/seek/error cases, source checkout Node test run, page-load performance, Lighthouse and launch conditions. No GitHub CI, merge, or public deployment has been requested or authorized.

Next action is to finish exact 800px asset upload and QA. This checkpoint is **PARTIAL; not final visual approval**.
