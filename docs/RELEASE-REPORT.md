# Released — Ars immersive portfolio

Target repository: `arsafiqri-aybi/arsafiqri-aybi.github.io`; isolated branch `feat/immersive-portfolio`; pre-change baseline `a8b002eba7b540c9600ac34d9b7d405761786c46`.

## Result

Full static homepage and six case studies; original editorial / copper identity; three visible unboxed choices with six reachable works; interruptible preview changes; native shared-element navigation; direct routes and JS-off fallback; keyboard and reduced motion; actual source links and owner Instagram contact. No paid service, backend, analytics or third-party runtime is added.

## Verification

12 real-browser check groups PASS; 35 route/width renders; automated accessibility sample on eight pages, zero violations; native cross-document transition observed. Mobile throttled local lab median LCP 1356ms, CLS 0.00483. Asset budgets pass. Boundaries and raw reports in QA-MATRIX.md.

## Release / recovery

Live URL: https://arsafiqri-aybi.github.io/

Source commit: `ecdce4ec93d397001a71c08c80f9781fb4f1c45a`. Reviewed PR: https://github.com/arsafiqri-aybi/arsafiqri-aybi.github.io/pull/1. Release merge on `main`: `70220b67e4bdc7b1630ce0f2c0f3aec609fa8ec6`.

GitHub Pages build for that merge is `built`, with no build error. Sixteen public HTTPS checks passed: seven page routes, CSS/JS/font/art assets, favicon/social artwork, robots, sitemap, and custom 404. Public bytes match the verified local implementation. The actual public site browser journey home → Hey detail → Back also passed at 390×844, preserving the selected work, with zero uncaught errors and no page overflow.

No workflow, Pages configuration, font-license, or knowledge-repository mutation was required. Deployment and production verification are PASS within the documented browser/HTTP scope.

Recovery: ordinary mainline revert of the merge (`git revert -m 1 70220b67e4bdc7b1630ce0f2c0f3aec609fa8ec6`), followed by ordinary push and Pages verification; baseline preserved in Git history. No repo history is deleted and knowledge repositories are read-only.

## Known limitations

No physical-phone, Safari/Firefox, screen-reader, human usability or field-performance evaluation. On the 4× CPU lab, a 232ms median maximum load long task remains. Headless background visibility was checked with separately labelled handler simulation and actual freeze/resume, not a physical background tab. Social preview artwork is an SVG; specific social networks may require a raster image for their card crawler.
