# ARS Portfolio v2 — Checkpoint 07C: real-source QA, offline limits

**Source baseline:** GitHub ZIP for commit `790820f6e9ab84e537c164bc297a9ccf5f79e4f4`, all 79 blobs checked against Git tree `9f680bdd6f65a8c1377cf20099bc4f463cce325d`. Updated HTML/CSS/build from development commit `5110aece4c104e12c72dfe128ed5346e13546a4c` reconstructed locally; Git blob identities were checked for those three user-facing files before this patch. No source from a different branch was substituted.

## Validation executed

- Node canonical generator `node scripts/build.mjs`: **PASS**, generated Home, seven legacy case-study pages, 404, sitemap and robots without new held routes.
- Node test suite before this patch: **115/115 PASS**; after adding no-JS regression tests: **120/120 PASS**.
- Earlier Chromium rendering of authentic source using `page.set_content` and byte-identical inlined CSS/JS/images: **93/93 PASS** on mobile/desktop and seven legacy case studies.
- Additional browser/static/HTTP audit with the patched fallback: **100/100 PASS**. Includes semantic markup and relative link existence checks (fragments correctly excluded), Python HTTP 200 for Home/legacy routes/media/CSS/JS plus expected 404, Chromium responsive/keyboard/reduced-motion/portrait/Motion-poster presence, and no-JS fallback.
- No-JavaScript horizontal overflow reproduced before patch: document scrollWidth 692 at CSS viewport 390 due to offscreen section previews being laid out simultaneously. After this CSS-only fix, document width matched viewport at 320, 390, 430, 680, 768 and 1440 CSS pixels. The five complete destinations stay present in no-JS HTML, and the initial identity preview remains visible.
- The local server returned HTTP 200, but Chromium `page.goto` to localhost, 127.0.0.1 and external test domains returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. A Playwright route-fulfillment attempt and disabling proxy also did not bypass this restriction. This is a browser-harness limitation, NOT an E2E success.
- Static asset sizes and gzip estimates measured, but they are not Lighthouse or field Core Web Vitals measurements.

## Important non-passes

**NOT RUN / BLOCKED:** genuine browser URL navigation, native cross-document Back/Forward and scroll restoration, actual external MP4 play/seek/audio/HTTP range, remote video streaming (GitHub Raw DNS resolution blocked), axe-core/WCAG runner (not installed), assistive screen-reader testing, Lighthouse/Core Web Vitals (not installed and browser network blocked), Firefox/WebKit/physical devices and production URL QA.

Source file `scripts/qa.cjs` and historical `docs/performance-lab.json` describe an older design/test baseline; they were not treated as proof of ARS v2.

## Release gate and protection

No new media, projects or claims. Tari Cookies, waai.id, SarafCare assets remain HELD. Portrait use remains approved for Home/About only; Motion source pinned and manual. The patch is a CSS no-JavaScript fallback and a source-regression test. It does not alter the existing seven routes or HTML generator.

**Checkpoint 07C: PARTIAL, not a release approval.** GitHub Pages remains on main:/; no GitHub Actions, merge or deployment authorized or performed.
