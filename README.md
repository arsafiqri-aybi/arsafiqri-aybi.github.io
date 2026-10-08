# Ars — Portfolio

Live: https://arsafiqri-aybi.github.io/

Complete replacement of the previous website, built without inspecting its former design. Six chapters guide a native scrolling journey: introduction, selected work, capabilities, process, about, and contact. Three static project pages remain accessible without JavaScript.

## Run

Use a static HTTP server in this directory. No production build, package install, backend, paid service, analytics, or third-party font request is required. Manrope and DM Sans are embedded as WOFF2 in fonts.css; their original OFL licenses are included.

## Design

Warm paper, charcoal, sage surfaces, and a restrained rust accent. Large sans-serif headings pair with italic serif highlights. A sculptural SVG represents the connection between ideas, systems, and experiences. Desktop chapter navigation exposes a small scrolling window; mobile navigation uses a compact bottom rail. Pointer feedback, restrained reveals, and browser-native page transitions enhance normal links. Reduced motion preserves every destination and all content.

## Content sources

Project summaries were scoped from the current README files in the owner's hey-android, hey-mcp, plugin-builder, personal-browser-operator, motion, and portofolio-web repositories, plus the owner's provided identity and contact handle. Projects remain labeled by development status. Artwork is explicitly marked as exploratory illustration, not application screenshots. Private source code, credentials, device identities, endpoints, and internal test records are not published.

Design guidance: website-builder/SKILL.md and its art direction, requirements, multisensory and quality references; portofolio-base content and contribution guidance; portofolio-web composition, scroll storytelling, focus, interruption and acceptance guidance; motion web interaction track; copywriting-intelligence claim and proof guidance. These were used as decision support rather than a claim of universal design quality.

## Verification

See VERIFICATION.md. Browser QA covers desktop, tablet and small phones, navigation, direct project routes, no-JavaScript use, reduced motion and rapid chapter input. Run the portable check in tools/verify.cjs after installing Playwright, with PORTFOLIO_CHROMIUM set if a custom executable is needed. Screenshots and JSON logs go to a temporary directory.

## Editing

index.html owns the landing-page content; work/*.html owns project stories. styles.css owns visual tokens and responsive layout; app.js enhances native navigation. Edit full UTF-8 text and re-run relevant checks. Publishing is GitHub Pages from main at repository root. Standard Git history preserves recovery; no force push is needed.
