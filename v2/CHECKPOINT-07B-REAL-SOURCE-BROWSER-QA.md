# ARS Portfolio v2 — Checkpoint 07B: Authenticated Source Visual QA

Baseline: feature branch commit 790820f6e9ab84e537c164bc297a9ccf5f79e4f4. User-supplied GitHub ZIP fully verified against tree 9f680bdd6f65a8c1377cf20099bc4f463cce325d (79 blobs). Owner-approved 800px portrait SHA-256 matches d2578b49531b52d247eedb83064cb43b4bb0a84d65932e1abe410f3c03daf0b8.

## Exact testing boundary

The extracted original site was served by a local HTTP server (HTTP 200), but Chromium navigation to localhost failed with net::ERR_BLOCKED_BY_ADMINISTRATOR. No full URL-based E2E is claimed. Chromium nevertheless rendered genuine branch HTML, CSS, original fonts, JavaScript, owner photo and original Motion poster by inlining their byte-identical source contents using Playwright page.set_content. This is authentic source browser rendering and interaction, NOT a fake layout fixture and NOT network/navigation E2E.

## Fixed defects

1. At narrow CSS widths of 320 and 390, the Home document scrollWidth was 415px because the mobile rail's max-content width expanded its flex ancestors. CSS min-width:0/max-width:100% confines the rail and preview, preserving horizontal scrolling INSIDE the rail. Verified at 320, 390, 430, 680, 681, 768, 900, 1024 and 1440px.
2. Connect used only an h2, preventing the source app.js focusLocationTarget() manager from focusing a destination h1. The generator and regenerated Home now use h1, and both original responsive heading CSS rules follow that semantic element.

## Test results (local source staging)

- Authentic Git tree verification PASS, 79 files.
- Original Node suite 110/110 PASS.
- Modified Node suite 115/115 PASS (five new contract tests).
- Browser real-source in-memory render/interaction 93/93 PASS: Home at five viewport widths, mobile rail scroll containment, original portrait decoding, all five full destinations with keyboard focus to h1 and no horizontal overflow, seven existing case pages at mobile and desktop widths, original Motion poster decoding, zero JavaScript errors.
- Generator ran successfully and regenerated 11 outputs. The only generated content changed for this patch is the Home index heading (other generated page bytes are unchanged).

## Gates still open (NOT RUN)

Genuine HTTP browser navigation to Home and project URLs, cross-document Back/Forward and return-to-context, media streaming/playback/seek and CORS/range, axe/WCAG audit and actual assistive technology, Lighthouse/Core Web Vitals, real font/cache/network performance, Firefox/Safari and production smoke test. This QA does not clear the release gate. Existing held project rights/claims/media remain blocked; no unapproved Tari Cookies, waai.id or SarafCare assets are published.

No GitHub CI invocation, no merge to main, no public preview and no deployment.
