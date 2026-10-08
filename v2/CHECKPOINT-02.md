# ARS v2 — Checkpoint 02: source-generator bridge

The authoritative legacy generator is still scripts/build.mjs. This checkpoint adds a minimal bridge:
- Normal builds require the original seven records and produce the same **three legacy selected works**, page set, and Home content as before.
- Unknown catalog projects without an explicit candidate manifest fail closed.
- Candidate preview reads a JSON manifest **outside the public checkout** through ARS_V2_CANDIDATE_MANIFEST; new routes are filtered using the T1 release gates.
- A manifest is only a declared approval state. The code cannot authenticate its truth, prove media rights, or authorize a real deployment. Every planner result declares safeToDeploy=false.
- The legacy generator still has **non-adaptive** project details and a hardcoded Hey Home. Do not call this the finished ARS v2 design; T3–T7 are pending.
- The identity-first Home fallback and six-work gallery require a separate visual implementation and reviewed assets.
- Commit is on the non-Pages feature branch. Never merge without a fresh owner-approved release candidate, source/media review and comprehensive QA.

Run targeted checks in a full checkout:
  node --test v2/tests/release-gates.test.mjs v2/tests/generator-bridge.test.mjs
  node scripts/build.mjs

The generator currently writes to tracked HTML pages in the checkout. Run integration builds in a disposable copy, not on main or in a shared working tree. Do not put private candidate manifests or held media in a public Git branch.
