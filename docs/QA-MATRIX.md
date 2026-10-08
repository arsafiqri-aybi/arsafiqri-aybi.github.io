# QA matrix — release candidate

2026-10-08. Real Chromium 133.0.6943.0, headless Linux. Raw results: `browser-qa.json`, `performance-lab.json`, `performance-before-asset-optimization.json`, `security-and-artifact-checks.json`. 12 browser check groups PASS, 0 FAIL. A PASS is scoped to the method below, not a universal certification.

| Gate | Status | Evidence and scope |
| --- | --- | --- |
| G01 Content integrity | PASS | CONTENT-EVIDENCE.md; pinned project READMEs, evaluation scope, owner identity; no invented achievements or runtime certification |
| G02 Journey | PASS | Native preview → Hey case → refresh → Back/Forward; real owner contact URL and 404 return route |
| G03 Static foundation | PASS | JS-off phone browser exposes all six work previews; Motion direct case and contact remain accessible |
| G04 Responsive | PASS | 35 rendered route/viewport combinations at 320/390/768/1024/1440; no document overflow. 844×390 landscape and effective 200% CSS viewport reflow also checked |
| G05 Keyboard/focus | PASS | End/Home/ArrowDown, focus retention, visible outline and hidden-element exclusion. Art links use inset focus outline; light surfaces use a dark focus color |
| G06 Media accessibility | PASS | Decorative project art hidden from accessibility tree; original illustration caption; semantic headings and named links. Axe WCAG tags checked across eight pages |
| G07 Motion reliability | PASS | Rapid 24-click selection, resize interruption, runtime reduced motion, reverse scroll, actual native cross-document transition, cleanup/history and actual CDP freeze/resume. Visibility-handler branch uses explicitly labelled synthetic document-hidden input in real Chromium |
| G08 Performance | PASS | Project asset budgets met; throttled mobile lab below selected 2.5s LCP / 0.1 CLS targets. Detailed readings below; lab only |
| G09 Security/privacy | PASS | Credential-pattern scan, safe static generation, no tracking/backend/dependencies shipped, same-origin assets; existing font licenses retained |
| G10 Visual system | PASS | Actual homepage desktop/phone and all six case-study renders reviewed; original source sculpture and delivery image preserve composition; contrast corrections applied |
| G11 Production | NOT_RUN | Candidate not yet merged; verify final GitHub Pages build and live route/assets after publication |
| G12 Handoff | PASS | Regenerable source, design/motion specs, source versions, raw QA, README and recovery baseline |

## Lab performance

Conditions: 390×844, DPR1, Chromium 133.0.6943.0, new context / cache disabled, CPU 4× slowdown, 150ms simulated latency, 200,000 bytes/s download, local gzip HTTP. Three candidate runs. This is not a physical mobile benchmark or field Core Web Vitals.

- Candidate LCP: 1340ms, 1376ms, 1356ms; median **1356ms**.
- CLS: **0.00483** in each run using session-window aggregation.
- Maximum observed load long task: median **232ms** at 4× CPU slowdown. It remains a load-time limitation; no field INP claim.
- After the delivery-asset optimization, median maximum load long task changed from 270ms to 232ms, while median LCP changed from 1296ms to 1356ms. The payload/computation trade-off is explicit; the accessible artwork-link markup also changed between those snapshots, so this is not a single-factor causal benchmark.
- 180 rAF callbacks during forward/reverse native scroll and 12 work changes, at desktop viewport with 4× CPU: median 16.7ms, p95 16.7ms, 0 intervals above 33ms. These are scheduling intervals, not measured presented/compositor frames.
- Baseline readings remain in raw reports; the prior site has different content and visuals, so no blanket speed-improvement claim is made.

## Final artifact budgets

| Budget | Final | Limit |
| --- | --- | --- |
| Initial HTML + CSS + JS gzip | 13,773 bytes | 153,600 bytes |
| Initial JS gzip | 2,279 bytes | 51,200 bytes |
| Initial font CSS including encoded fonts, raw | 82,638 bytes | 102,400 bytes |
| First-viewport media raw | 113,070 bytes | 409,600 bytes |
| Third-party requests on initial load | 0 | 0 |

## Limits / NOT_RUN

Safari/WebKit and Firefox, a physical Android/iOS phone, screen-reader operation and human usability research were not run. Headless Chromium does not expose real background visibility changes; the actual freeze/resume check and the synthetic visibility-handler check are reported separately. 720px reflow represents the effective CSS viewport of a 1440px window at 200%; actual browser-chrome zoom was not automated. Image/font failure was simulated by aborting their requests. No full WCAG conformance, universal browser smoothness, or production-ready status of the showcased projects is claimed.

Axe reported zero violations for its selected WCAG 2.2 AA-tagged rule set. Incomplete automatic checks on overlapping/artwork surfaces were reviewed by semantics and visual inspection; this does not replace screen-reader or full conformance evaluation.
