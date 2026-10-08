# ARS — Digital Builder × Business Strategist

Live website: https://arsafiqri-aybi.github.io/

A static, evidence-aware personal portfolio for Arsafiqri Ummati Aybi (ARS). Built on GitHub Pages with no required backend or paid service.

## Experience

- Six main destinations: Home, Work, Expertise, Approach, About and Connect.
- Identity-first composition with a three-visible-item rail on desktop and horizontally browsable navigation on mobile.
- Curated editorial Work Gallery and **All Work** index. Three documented works link to case studies; Tari Cookies, waai.id, and SarafCare use unlinked placeholders. The original Motion film has separate playback controls and a case-study link.
- Seven direct-access Project Detail routes with Showcase, editorial Quick Context, Decision-Led Process, scoped Outcome and Architecture Explorer.
- Dark/Light/Contextual atmosphere preference, keyboard navigation and reduced-motion behavior.
- No speculative email, résumé or LinkedIn links. Grounded public contact routes: GitHub and Instagram.
- Hey and Browser Operator use source-derived diagrams. Other authored artwork is labeled as editorial illustration. The Motion film and its extracted poster are original source media.

## Source of truth and regeneration

Reviewed project content: `content/projects.json`; artwork markup: `content/artwork.json`; architecture summaries: `content/architecture.json`.

The canonical generator is `scripts/build.mjs` (Node.js 20+, standard library only). Run:

```sh
node scripts/build.mjs
```

`python scripts/build.py` remains a compatibility wrapper and requires Node. Serving the committed HTML/CSS/JS requires **no** build step: `python -m http.server 4173`.

## Validation boundaries

See `docs/NEW-PORTFOLIO-IMPLEMENTATION.md`. The earlier `docs/QA-MATRIX.md` and `docs/RELEASE-REPORT.md` document the **previous** design and must not be cited as testing of this release. New live Pages build status is separately verifiable through GitHub's Pages build API. Current release checks are recorded in `v2/FINAL-RELEASE.md`. Automated browser samples are scoped checks, not full WCAG or physical-device certification.

## Routes

- `/` (six integrated sections via URL fragment)
- `/work/hey/`
- `/work/personal-browser-operator/`
- `/work/scale-governor/`
- `/work/motion/`
- `/work/skill-builder/`
- `/work/copywriting/`
- `/work/website-builder/`

Do not replace authentic project evidence with invented screenshots or make deployment/impact claims unsupported by cited source material.

## Current browser verification

`node --test v2/tests/*.test.mjs` checks content, release boundaries, and legacy-route regressions. `scripts/verify-v2.cjs` performs URL-level Chromium checks on the committed static output. It starts and stops its own local HTTP server. Supply `ARS_BROWSER` (Chromium executable), `ARS_AXE` (axe-core JS), `ARS_MOTION_FILE` (the pinned original MP4), and optionally `ARS_QA_OUT` for private screenshots and reports. These tools are development-only; the public site has no runtime package dependency.

The original six-second film is manually started. Its poster is frame 179 directly extracted from the SHA-256-verified source. Portrait remains limited to Home and About. No third-party WAAI, Tari, or campaign media is copied into this release.
