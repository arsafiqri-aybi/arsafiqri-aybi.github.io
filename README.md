# ARS — Integrated Digital Portfolio

Live website: https://arsafiqri-aybi.github.io/

A static, evidence-aware personal portfolio for Arsafiqri Ummati Aybi (ARS). Built on GitHub Pages with no required backend or paid service.

## Experience

- Six main destinations: Home, Work, Expertise, Approach, About and Connect.
- Identity-first composition with a three-visible-item rail on desktop and horizontally browsable navigation on mobile.
- Curated editorial Work Gallery and **All Work** index. Each entire project entry has exactly one internal destination: its case study.
- Seven direct-access Project Detail routes with Showcase, editorial Quick Context, Decision-Led Process, scoped Outcome and Architecture Explorer.
- Dark/Light/Contextual atmosphere preference, keyboard navigation and reduced-motion behavior.
- No speculative email, résumé or LinkedIn links. Grounded public contact routes: GitHub and Instagram.
- Artwork is clearly marked as original editorial interpretation, not an application screenshot or user-study evidence.

## Source of truth and regeneration

Reviewed project content: `content/projects.json`; artwork markup: `content/artwork.json`; architecture summaries: `content/architecture.json`.

The canonical generator is `scripts/build.mjs` (Node.js 20+, standard library only). Run:

```sh
node scripts/build.mjs
```

`python scripts/build.py` remains a compatibility wrapper and requires Node. Serving the committed HTML/CSS/JS requires **no** build step: `python -m http.server 4173`.

## Validation boundaries

See `docs/NEW-PORTFOLIO-IMPLEMENTATION.md`. The earlier `docs/QA-MATRIX.md` and `docs/RELEASE-REPORT.md` document the **previous** design and must not be cited as testing of this release. New live Pages build status is separately verifiable through GitHub's Pages build API. Device/browser accessibility testing of the new experience remains outstanding.

## Routes

- `/` (six integrated sections via URL fragment)
- `/work/hey/`
- `/work/personal-browser-operator/`
- `/work/scale-governor/`
- `/work/motion/`
- `/work/skill-builder/`
- `/work/copywriting/`
- `/work/website-builder/`

Do not replace authentic project evidence with invented screenshots or make deployment/impact claims unsupported by cited source material.
