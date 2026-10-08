# ARS six-section portfolio implementation

Generated on 2026-10-08 from reviewed repository content. Scope: only the `arsafiqri-aybi.github.io` site repository.

## Decisions
- Six preview destinations: Home, Work, Expertise, Approach, About, Connect.
- Desktop focused scroll rail (three visible items); mobile horizontal list.
- Featured gallery with fully clickable project links; quiet single-destination All Work rows; no repeated north-east arrow glyphs.
- Static project routes; sections and cases remain addressable, including with JavaScript unavailable.
- Project Detail: Showcase, Quiet Editorial Aside, Decision-Led Process, Verified Outcome and editable-focus Architecture Explorer.
- Factual constraints: conceptual illustrations are not screenshots; tests and live use cannot be inferred from code presence; Hey remains in development; browser-operator CI slice is not production proof.
- No fabricated public email, LinkedIn, completed CV or unverified business impact. Instagram and GitHub are the only currently grounded public contact links.
- Theme setting uses localStorage; section selection uses sessionStorage; no new backend or trackers.

## Regenerate
`node scripts/build.mjs` or `python scripts/build.py` (Node available). Project data: `content/projects.json`; artwork markup: `content/artwork.json`; architecture summaries: `content/architecture.json`.

## Verification caveats
This change includes build-source integrity checks, not a claim of new cross-browser, screen-reader, field-performance or human usability tests. The older release QA report describes the older build and must not be represented as proof of the new design. Perform new browser and device tests before marking production UX verified.
