# ARS v2 — T1 release-gate foundation

This is a **public-safe, non-executing** code checkpoint based on the owner-approved T1 plan. The source branch is `feat/ars-portfolio-v2-t1-foundation`, inherited from baseline `c2362592002839b765d8539efd0b912fad162070`. GitHub Pages currently builds from `main:/`, which this checkpoint does not change.

**Important:** A feature branch in a public repository is itself public. Therefore this commit contains ONLY pure reusable gate logic and entirely **synthetic test fixtures**. Unreleased real project drafts, owner portrait bytes, internal evidence/rights ledgers, team assets, and campaign metrics are NOT committed.

Run on a complete checkout:

```sh
node --test v2/tests/release-gates.test.mjs
```

This module does not generate pages or touch `scripts/build.mjs`. It validates **declared** approval states but cannot authenticate owner signatures or third-party rights. Future T2 work must integrate against the authentic source, preserve seven legacy public routes, and keep unpublished/uncleared material outside all public repository branches. All candidate plans return `safeToDeploy:false`.

**Authorization:** User permits staged commits on an isolated branch. This is NOT authorization to merge/push to `main`, deploy, expose held media, or start T2 automatically.
