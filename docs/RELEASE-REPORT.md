# Release candidate — Ars immersive portfolio

Target repository: `arsafiqri-aybi/arsafiqri-aybi.github.io`; isolated branch `feat/immersive-portfolio`; pre-change baseline `a8b002eba7b540c9600ac34d9b7d405761786c46`.

## Result

Full static homepage and six case studies; original editorial / copper identity; three visible unboxed choices with six reachable works; interruptible preview changes; native shared-element navigation; direct routes and JS-off fallback; keyboard and reduced motion; actual source links and owner Instagram contact. No paid service, backend, analytics or third-party runtime is added.

## Verification

12 real-browser check groups PASS; 35 route/width renders; automated accessibility sample on eight pages, zero violations; native cross-document transition observed. Mobile throttled local lab median LCP 1356ms, CLS 0.00483. Asset budgets pass. Boundaries and raw reports in QA-MATRIX.md.

## Release / recovery

Candidate ready for source review and publication through the existing GitHub Pages mechanism. No workflow or Pages configuration change is needed. Inspect the protected expected branch head before committing; use ordinary non-force merge. Then verify HTTPS, all seven page routes, custom 404, same-origin assets, metadata and Pages build status. Production status is NOT_RUN until that inspection succeeds.

Recovery: ordinary revert of the release commit; baseline preserved in Git history. No repo history is deleted and knowledge repositories are read-only.

## Known limitations

No physical-phone, Safari/Firefox, screen-reader, human usability or field-performance evaluation. On the 4× CPU lab, a 232ms median maximum load long task remains. Headless background visibility was checked with separately labelled handler simulation and actual freeze/resume, not a physical background tab. Social preview artwork is an SVG; specific social networks may require a raster image for their card crawler.
