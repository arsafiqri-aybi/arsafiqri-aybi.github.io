# ARS v2 — Checkpoint 04: Curated Work Gallery Renderer

A source-safe editorial gallery shell has been added **only on the feature branch**.

- Uses three responsive compositions: primary, feature, editorial; a chosen project is one keyboard-focusable link.
- Selected Work is planned from release-filtered records. The default public catalog still has only the three legacy selected items. No held Tari/WAAI/SarafCare drafts or unapproved media are committed.
- Gallery media is restricted to existing editorial illustrations and visibly labeled **not a product screenshot**. Records with no cleared artwork use text-only treatment instead of an empty placeholder.
- Work Gallery uses native document scroll; the rail/preview wheel behavior in the Home explorer is unchanged.
- The All Work index and Next Work derive from release-filtered records; Next Work uses curated order before the remainder of the public archive. Navigation to held projects is excluded.
- Support for six curated work compositions is demonstrated only with **synthetic** local planner tests; it is not evidence that all six real works have cleared publication.
- Existing legacy routes and case pages remain; the adaptive case-study implementation, real portrait/media, return-to-context QA and public deployment are still pending.

Verification: pure gallery-plan unit tests locally (17 PASS), static code wiring checks performed before commit. This checkpoint has NOT passed a full cross-device browser render, accessibility audit, final source checkout build, or public live QA.

No GitHub Actions, main merge, or deployment permitted by this checkpoint.
