# ARS — Arsafiqri Ummati Aybi

A personal portfolio connecting business strategy, creative work and digital craft.

Live: https://arsafiqri-aybi.github.io/

## Design

An original editorial direction built from a blank layout: warm paper, ink and cobalt; expressive sans-serif headings paired with restrained serif emphasis; authentic project imagery; and natural page scrolling on every screen. The former arc navigation, full-screen chapter system and mobile case carousels have been removed.

The homepage introduces Arsafiqri, presents three selected projects, provides an index of four independent explorations, explains his background and approach, and leads to verified social profiles. Seven individual project pages use a shared reading system with real evidence, contextual results, in-page navigation and progressive image enlargement.

## Canonical source

| Responsibility | Source |
| --- | --- |
| Identity, social destinations and public selection | `content/profile.json` |
| Reviewed case content and media provenance | `content/tari-cookies.json`, `content/waai-id.json`, `content/sarafcare.json` |
| Independent project records | `content/projects.json` |
| All public page structure | `scripts/build.mjs` |
| Visual tokens, layouts, states and adaptations | `styles.css` |
| Optional interactions and active navigation | `app.js` |
| Visual decisions and verification | `Visual.md` |

Edit the canonical source in place. Regenerate pages instead of editing generated HTML independently. Git keeps earlier designs; do not add duplicate or versioned source implementations.

```bash
node scripts/build.mjs
node scripts/build.mjs --check
node --test v2/tests/*.test.mjs
```

Node 20+ is sufficient. No package installation or runtime backend is required. GitHub Pages serves the committed HTML directly from `main`. `--check` compares the current output with its sources without writing. The public selection is explicit; archived projects cannot silently reappear. The former generator drift guard has been replaced by this shared, reproducible renderer.

## Content integrity

Tari Cookies, waai.id and SarafCare retain their reviewed paragraphs, research context, tables, quotations, media and limitations. Asset hashes are checked during generation. Portrait usage retains its approved Home scope. No invented customer endorsements, contact information or performance claims have been added. Historical account metrics and owner-reported campaign results retain their original qualifications.

The older source records and independent publication-planning modules under `v2/` remain for provenance and reusable release-contract checks. They do not define the active visual system or authorize archived projects for publication. `inspect/` remains an opt-in same-origin diagnostic route and is excluded from indexing.

## Interaction and resilience

Navigation uses real links and browser history. All essential content is in HTML and remains available without JavaScript. Optional JavaScript adds a native image dialog, accurate active-section indicators, keyboard focus after anchor navigation and graceful missing-image presentation. The original image link remains the fallback.

The CSS includes continuous responsive sizing, readable article measures, responsive tables, reduced motion, visible keyboard focus, forced-color adaptations and print styles. No analytics, tracking, account system or unimplemented contact form is introduced.

## Verification

See `Visual.md` for the current observed results and remaining verification limits. Automated source, publication and provenance checks supplement browser inspection; they do not certify every device, browser or assistive technology.
