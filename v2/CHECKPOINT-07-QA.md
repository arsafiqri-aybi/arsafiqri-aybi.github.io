# ARS Portfolio v2 — Checkpoint 07 (partial source/browser QA)

Baseline: authentic feature branch 4862ea6ac916a2b7e822a976e947b5b4fd120e95. The original app.js local copy matched Git blob f062334ae101723cb23c9d46a2f6b38e3f00acef.

Fixed two reproduced issues:
- Opening a full destination from the preview could leave keyboard focus on a now-hidden link. Navigation moves focus to the new destination h1. Returning to preview focuses the currently selected rail item.
- Return-to-context from the All Work index could focus a different link when the same project appeared in Selected Work. Session state now records a validated exact link index, with safe ID fallback when the DOM changes. Native scroll is still clamped and untouched by wheel interception.

Validation: candidate script parsed and Chromium exercised the authentic baseline JS followed by the patch against synthetic DOM/CSS fixtures. Patched fixture tests/observations 12/12 passed, including five destinations, keyboard rail, reduced motion, theme, exact repeated-link focus and mocked Motion success/failure. Local Node source-regression tests 7/7 passed. Read-only validation of actual repository-generated HTML (Home and seven legacy case pages) passed 21/21 structural checks. These are not a complete browser E2E of the genuine rendered website.

Environment blocker: GitHub ZIP/clone inaccessible from local container (DNS/network); Chromium denied localhost, file and data URL navigations. Fixture testing via page.set_content can test JavaScript but not genuine full-site media, CSS and URL navigation.

NOT RUN: exact branch full-page screenshot QA, genuine routes end-to-end, mobile responsive reflow against actual styles.css, live MP4/network range/seek and audio, screen-reader assistive technology, Core Web Vitals/Lighthouse, cross-browser Firefox/WebKit, full repository Node tests from checkout.

No change to six-work evidence/rights gates, deployed website, GitHub Pages main, or media provenance. No GitHub CI invoked or public preview created. CP07 is PARTIAL; release remains LOCKED.
