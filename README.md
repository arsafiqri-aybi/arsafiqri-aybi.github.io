# ARS — Business Strategist × Digital Builder

Live website: https://arsafiqri-aybi.github.io/  
Source branch: `main` (GitHub Pages, repository root).

## Published experience

- Static, frontend-only personal portfolio. No runtime backend or paid service is required.
- Six desktop destinations: Home, Work, Expertise, Approach, About and Connect.
- Dedicated mobile Home, Work, About and Connect presentations, with horizontal/vertical navigation and a four-chapter About carousel.
- Six featured work entries; held third-party artwork stays absent. The publicly linked Tari Cookies page is a clearly labelled **case preview**, not a released full case study.
- Seven documented legacy case-study routes remain available in addition to the Tari Cookies preview.
- Original portrait on Home/About, source-derived diagrams for relevant projects, and the original manually played motion film.
- Real GitHub and Instagram links. No invented performance metrics, third-party screenshots, or unsupported contact details.

## Files serving the live site

`index.html`, `work/*/index.html`, `404.html`, `styles.css`, `assets/illustrations.css`, `fonts.css`, `app.js`, `ars-story.js`, referenced `assets/*`, and the metadata files (`favicon.svg`, `social.svg`, `robots.txt`, `sitemap.xml`).

`content/*` and `v2/content/*` hold project and approved-media data. Keep these, related source provenance, license files, and the release-gate modules intact: they are development and evidence dependencies even when not requested by the browser directly.

## Canonical maintenance rule — edit in place

The repository maintains **one canonical file for each responsibility**. All future fixes, UI/UX adjustments, refactors, copy changes, and optimizations must modify the existing file directly, preserving the current working behavior. Do not create parallel versioned copies, `v2`/`v3` replacements, `final`/`final-new` variants, temporary `backup` source files, or legacy duplicate implementations. When superseded code is proven unused, delete it from the current tree rather than keeping it beside the active implementation.

Use Git commits as the change history and rollback mechanism; never retain outdated code or files solely to remember earlier designs. A new file is appropriate **only if a genuinely new responsibility requires a separate module, asset, page, data source, or test**, not to store a revision of an existing feature. Keep supporting data, licenses, evidence, tests, and publishing safety rules when still required; "not browser-loaded" does not automatically mean "unused".

For every change: verify the current `main` state, edit canonical files in place, check dependent pages/modules and responsive behavior, test to the extent available, then commit the final working state to `main` without force pushing or creating duplicate versions. Avoid unrelated deletions. The existing build safety guard remains effective until the generator is synchronized with published markup.

## Engineering architecture and reference foundation

**Canonical production rule:** the currently published HTML is the source of
truth for the visible UI. The existing generator's templates have drifted;
neither its output nor archived reports can replace live pages or certify QA.
Keep one file per responsibility and refactor in place, not into duplicates.

| Responsibility | Canonical files and contract |
| --- | --- |
| Page content and structure | `index.html`, `work/*/index.html`, `404.html`: preserve content, URLs, semantics and mobile/desktop chapter structure |
| Design tokens, components, breakpoints and motion | `styles.css`: consolidate CSS safely without changing the cascade's rendered result |
| Illustrations and fonts | `assets/illustrations.css`, `fonts.css`, referenced approved assets: maintain licensing and ownership |
| Navigation and interaction state | `app.js`: preserve gestures, history, focus, scroll restoration and accessible fallback |
| Case-page storytelling | `ars-story.js`: one shared implementation, no parallel carousel versions |
| Data and publication gates | `content/*`, `v2/content/*`, `v2/scripts/*`: keep rights and evidence checks distinct from public presentation |
| Generator safety | `scripts/build.mjs`: block writing on template drift until source is reconciled |
| Published source tests | `v2/tests/current-site-contract.test.mjs`: verify current page structure, paths, assets, semantics and runtime hooks |

### Official open-source references studied

- [WebKit/WebKit](https://github.com/WebKit/WebKit/blob/main/Introduction.md):
  layout regression testing, platform behavior and browser compatibility.
- [swiftlang/swift-docc-render](https://github.com/swiftlang/swift-docc-render):
  structured content and rendering responsibilities. An Apple-origin
  open-source documentation renderer, **not** Apple's private website source.
- [primer/primitives](https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md):
  semantic spacing, colors, typography, motion, focus and contrast tokens.
- [microsoft/fluentui](https://github.com/microsoft/fluentui/blob/master/docs/architecture/component-patterns.md):
  separate state, presentation, styling and accessibility contracts.
- [adobe/spectrum-web-components](https://github.com/adobe/spectrum-web-components/tree/main/CONTRIBUTOR-DOCS):
  accessible focus behavior and maintainable component ownership.
- [microsoft/playwright](https://github.com/microsoft/playwright):
  behavior-focused mobile, desktop and cross-browser regression tests.
- [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci):
  measurable performance and accessibility regression budgets.

### Safe modernization order

1. Pin the current public routes, imagery and balanced Android Home as a
   regression baseline; validate relative URLs, id references and JS syntax.
2. Consolidate the multiple historic `@media` and `!important` overrides
   under consistent semantic tokens **only after computed-style comparison**.
3. Clarify navigation and gesture state boundaries in the current `app.js`;
   verify keyboard, scroll, history, screen readers and reduced motion.
4. Reconcile the generator with published HTML before any regeneration.
5. Check small Android, tablet and desktop in Chromium, Firefox and WebKit;
   measure performance before claiming readiness.

The patterns above are research references, not copied source code or evidence
that all browser tests have already passed.

### In-place CSS and navigation refactor

The seven identical CSS rules found in the same media/scope contexts were
removed while preserving their later counterparts. The canonical mobile width
(680px) is now referenced by one JavaScript constant rather than repeated
magic numbers. Route selection logic was reformatted without changing tokens;
hash and popstate share their restoration handler, and an unused DOM query
was removed. This is a source-level preservation pass; full browser visual
and gesture regression checks are still outstanding.

The adjacent identical Android media-query wrappers have also been merged only where directly neighboring. A before/after lexical comparison confirmed the same CSS leaf rules, declaration bodies, ancestry and order; this is **not** a replacement for computed-style or screenshot testing.


## Regeneration safety

`scripts/build.mjs` is **not yet synchronized with the current published mobile markup**. As a safeguard, it now checks generated output against existing files **before writing anything**, and refuses to replace files on drift. Do not use it to overwrite the current production design. Synchronize its templates with the current HTML first. `--allow-layout-overwrite` is a deliberate override that can discard current interface work; it must not be used casually.

The live site is committed static HTML/CSS/JS and does not require a build on GitHub Pages.

## DSARS and code-driven motion adaptation (2026-10-25)

The portfolio consumes the independent `arsafiqri-aybi/dsars` ARS Interface System Foundation Candidate's semantic light/dark palette, and its 120/180ms feedback/settle motion tokens, through the existing canonical `styles.css`. The design system itself remains a **foundation candidate**; this is a scoped portfolio mapping, not a production certification or an import of the web component adapter.

[Code-Driven Motion](https://github.com/arsafiqri-aybi/motion)'s web interaction track informs chapter transitions and interruption handling. Rich chapter travel retains its measured 460ms pacing. Reduced-motion preference changes stop movement without removing transforms needed for layout. Forced-color mode keeps a visible focus indicator and selection cue.

Source-contract checks now cover these changes. Actual Android, desktop, forced-colors, assistive technology, and screenshot regressions are **not yet verified**. Project evidence, authentic imagery, routes and responsive chapter architecture stay unchanged.

## Testing and boundaries

`node --test v2/tests/current-site-contract.test.mjs` checks the published source's static contracts. The remaining `v2/tests/*.test.mjs` cover reusable release/media/navigation logic and require review when the design changes. Browser automation, physical Android/iOS, Safari/Firefox and screen-reader tests are separate checks; no old release's QA results are evidence of the present layout.

The historical source commits remain in Git history. Inactive debugging layers, superseded reports/checkpoints and obsolete QA harnesses have been removed from the current tree without altering published pages. 

## Mobile visual inspector (isolated route)

Open **https://arsafiqri-aybi.github.io/inspect/** on Chrome Android.
This is an opt-in developer utility, **not part of the public homepage**.
It renders the real production site inside a same-origin full-viewport iframe,
then draws selectable rectangles over the DOM. The **Struktur / Semua** control
switches between major sections and all visible HTML elements; **Pilih** freezes
ordinary click navigation for inspection and **Kotak** turns outlines on/off.
Tapping a node shows its DOM selector, HTML, dimensions, computed CSS, and
matching same-origin CSS selectors, with copy controls. Turn **Pilih** OFF to
navigate between live portfolio chapters, then turn it on again.

Inspector overlay refinement: `main#main` and `section#home` remain
present in production HTML but have **no inspector outline or selectable
wrapper label** in either density mode; inspecting their descendants continues
normally. The inspector also avoids drawing an extra upper border around the
mobile header/menu. The original website header divider and active-tab underline
remain unchanged.

The inspector uses one dedicated \`inspect/index.html\` for an actual new
responsibility, with no second copy of the portfolio, no injected script on the
main domain's normal page, no dependencies, and no changes to \`app.js\` or
\`styles.css\`. It intentionally has \`noindex,nofollow\` and a
\`robots.txt\` exclusion. This is a diagnostic overlay: labels identify
HTML/CSS objects, not the source file line number, and screenshots taken while
the inspector is open will contain the overlay. A website that blocks
same-origin framing or cross-origin pages cannot be inspected by this route.

