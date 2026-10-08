# ARS CP06.1 — Verified 800×800 portrait integration

Owner-approved authentic portrait uploaded and independently confirmed to match SHA-256 `d2578b49531b52d247eedb83064cb43b4bb0a84d65932e1abe410f3c03daf0b8` and Git blob `4a46765f2a93d57fdf30b23498b656b0aebc8113`. Original 360×360 remains in Git history, while the release manifest now points to `assets/ars-portrait-800.webp`, exactly 9,888 bytes. No facial edits or EXIF metadata.

Regenerated all 11 static outputs from the reviewed generator and updated media manifest on the isolated branch; Home/About now refer to the 800px file with correct intrinsic dimensions. The live GitHub Pages main remains untouched. Added byte integrity and negative tests to Node test suites. Existing evidence gates hold all unapproved project material; Open Graph still text-only and Motion remains user-controlled.

**Verification boundary:** generator emulated with exact source content in a JS in-memory filesystem, all 12 pre-commit release invariants passed. The Node test sources are authored but running all Node tests on a full checked-out branch and visual browser QA remain separate actions. No production deployment, GitHub CI, or merge.
