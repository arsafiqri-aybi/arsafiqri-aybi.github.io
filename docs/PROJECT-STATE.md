# Project state

Goal: original immersive Ars portfolio, static GitHub Pages, frontend first, additional service cost Rp0.

Baseline: `a8b002eba7b540c9600ac34d9b7d405761786c46`. Isolated branch: `feat/immersive-portfolio`. GitHub Pages configuration read: `main`, root path, HTTPS enforced, legacy build.

Accepted design: near-black / copper identity, editorial typography, code-native geometry, six curated projects, dominant preview with three visible unboxed choices, directly addressable static case studies, real Instagram contact. Existing factual identity and licensed fonts preserved; prior layout replaced.

Implementation: Python stdlib generator produces plain HTML; CSS handles native cross-document transitions; small vanilla JS enhances work selection and finite motion. No npm dependency, paid service, backend or tracking is shipped. Knowledge source versions are pinned in `SOURCE-VERSIONS.json`.

Current checkpoint: full implementation and source evidence exist; 12 browser groups PASS, 35 responsive route renders, eight-page automated accessibility sample with zero violations. Chromium 133 test runtime acquired via an isolated QA package after CDN downloads failed. Production not yet merged.

Next action: atomic expected-head branch commit, review diff, ordinary Pages release and live route/build verification.
