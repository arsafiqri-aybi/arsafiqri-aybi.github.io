# ARS Portfolio v2 — final release candidate

Target: https://arsafiqri-aybi.github.io/
Base: `a50c1a0d68cf143c01c34419825b35de9916f802`. Publication remains on main/root GitHub Pages. No history reset, route removal, backend, paid service, or device operation.

## Owner scope and delivered experience

The owner's latest direct instruction authorizes completion and deployment of the attached final specification. This supersedes its earlier planning-only approval state. The previously approved six-work presentation remains: Tari Cookies, waai.id, and SarafCare are unlinked, media-free placeholders; Hey, Browser Operator, and Motion link to documented cases. All seven existing case routes remain available.

Public prose is English and all six gallery descriptions exactly match the supplied locked editorial baseline. Home remains identity-first with the approved portrait; portrait use is limited to Home and About. Hey and Browser Operator use source-derived diagrams, not fabricated screenshots. Motion uses the hash-verified original six-second render and frame 179 extracted directly from that video, in its approved gallery/case contexts. Playback is manual, with native audio/seek controls, English captions, visual description, and source/error fallbacks.

## Verification

- Node regression suite: 128 passed, 0 failed.
- Deterministic regeneration and diff whitespace: passed.
- Browser: 10 checks passed at a local HTTP origin using actual generated output.
- Responsive: 320, 375, 430, 680, 768, 1024, and 1440 px, plus landscape; six main sections and seven case routes. No horizontal overflow.
- Internal routes/fragments, metadata, held-route exclusion, keyboard rail, appearance controls, no-JS fallback, browser Back/Forward, and exact gallery focus/scroll restoration: passed.
- Actual original MP4 decoded at 640×360 and 6 seconds. Manual playback, pause, seek, mute, replay, navigation pause, and source failure feedback: passed. Local playback used the downloaded immutable original bytes; external delivery needs separate live verification.
- axe-core: 42 samples across Contextual, Dark, and Light; no automated violations. Incomplete checks remain explicitly recorded in `final-browser-qa.json`; this is not full WCAG or screen-reader certification.
- Local mobile lab: 193583 initial transferred bytes, LCP 44 ms, CLS 0.041826594472271515; no initial video request. Unthrottled local Chromium measurement, not field Core Web Vitals or a Lighthouse score. Budgets: 400 KB initial transfer, local LCP under 2500 ms, CLS under 0.1.
- All 27 public source/documentation URLs returned HTTP 200 in this session.
- Known secret-pattern/output checks and portrait social-use exclusion: passed. This is a scoped audit, not a comprehensive security certification.
- Screenshots inspected at desktop/mobile for identity, gallery, and case/media surfaces.

## Release limits and recovery

Tari team attribution/assets, WAAI redistribution rights, and SarafCare media/results proof remain unpublished pending their own clearance. Their placeholders do not grant case-study or asset publication rights. Hey's physical-device issues remain stated as limitations. Physical-device, assistive screen-reader, full browser zoom, human comfort, and field performance checks were not performed. No claim of complete accessibility or product reliability is made.

This commit records a verified candidate. Actual publishing must be observed afterward through the Pages build API and live HTTP/browser checks against the manifest hashes; production completion is not asserted before that observation. The last known good reference is the base SHA above. Recovery is a reviewed forward restoration of that content, not a force push or history reset.
