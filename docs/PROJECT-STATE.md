# Project state

Goal: original immersive Ars portfolio, static GitHub Pages, frontend first, additional service cost Rp0.

Baseline: `a8b002eba7b540c9600ac34d9b7d405761786c46`. Isolated branch: `feat/immersive-portfolio`. GitHub Pages configuration read: `main`, root path, HTTPS enforced, legacy build.

Accepted design: near-black / copper identity, editorial typography, code-native geometry, six curated projects, dominant preview with three visible unboxed choices, directly addressable static case studies, real Instagram contact. Existing factual identity and licensed fonts preserved; prior layout replaced.

Implementation: Python stdlib generator produces plain HTML; CSS handles native cross-document transitions; small vanilla JS enhances work selection and finite motion. No npm dependency, paid service, backend or tracking is shipped. Knowledge source versions are pinned in `SOURCE-VERSIONS.json`.

Current checkpoint: full implementation and source evidence exist; 12 browser groups PASS, 35 responsive route renders, eight-page automated accessibility sample with zero violations. Chromium 133 test runtime acquired via an isolated QA package after CDN downloads failed. Release merged on main: 70220b67e4bdc7b1630ce0f2c0f3aec609fa8ec6. Pages built successfully. Live HTTPS artifacts and the public browser journey are verified.

Status: COMPLETE for implemented website and documented QA scope. Last known good production checkpoint: https://arsafiqri-aybi.github.io/ at release 70220b67. Next action: owner visual review; retain the recorded physical-device / cross-browser / screen-reader limits.
