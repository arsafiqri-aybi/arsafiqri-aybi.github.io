# Ars — immersive portfolio

A static, original portfolio for Arsafiqri Ummati Aybi. Near-black editorial composition, copper sculpture, six curated work previews, directly addressable case studies, keyboard navigation and optional native page transitions.

## Run locally

Python 3.10+; no build or runtime dependency is required for serving the checked-in site.

```bash
python -m http.server 4173
```

Open http://localhost:4173/.

## Edit and regenerate

Edit reviewed facts in `content/projects.json`; regenerate pages with:

```bash
python scripts/build.py
```

The original copper geometry SVG can be regenerated with `python scripts/sculpture.py`. Production `assets/core.svg` uses a rasterized WebP inside an SVG wrapper to avoid parsing thousands of geometry faces on each visitor load. Keep `assets/core-source.svg` as the editable source. To regenerate delivery art, install Playwright only in your QA environment and run `QA_CHROMIUM=/path/to/chromium node scripts/optimize-art.cjs`.

JavaScript enhances the work selector and finite motion; all six case studies and content remain available without it. Native same-origin View Transitions are an optional enhancement. Reduced motion uses static states. Local browser storage remembers the selected work only; no data leaves the browser.

## Routes

- `/`
- `/work/hey/`
- `/work/scale-governor/`
- `/work/motion/`
- `/work/skill-builder/`
- `/work/copywriting/`
- `/work/website-builder/`
- `/404.html`

GitHub Pages configuration: `main`, root directory, `.nojekyll`, HTTPS. All relative route assets work with direct navigation and refresh.

## Sources and verification

`docs/CONTENT-EVIDENCE.md`, `SOURCE-VERSIONS.json`, `ART-DIRECTION.md`, `MOTION-SPEC.md`, `EXECUTION-CONTRACT.json`, `QA-MATRIX.md` and `RELEASE-REPORT.md` record source scope, decisions, verified checks and remaining limits. A static validator is not a browser or human usability test.

## Asset rights

The SVG sculpture, project illustrations, favicon and social graphic are original code-native works created for this site. Project visuals are labelled interpretations, not application screenshots. Existing Manrope and DM Sans font files are self-hosted in `fonts.css`; their SIL OFL license files are retained. No reference-video asset is included.

## Recovery

Use an ordinary Git revert of the release commit on `main`; do not force-push. The pre-rebuild baseline is `a8b002eba7b540c9600ac34d9b7d405761786c46`. Confirm the Pages build and live routes after any release or recovery.
