# Checkpoint 05C — Return to Work Context

Implementation scoped to the current development feature branch, with no public deployment.

From a released Selected Work entry **or** All Work row, JS records an optional same-session origin (`pathname`, project ID, and document scroll position), not content or personal data. When the user follows a case-study Back to All Work link, an explicit intent marker lets the home page restore the originating position and keyboard focus. History/back-forward navigation is also handled best-effort. The native link remains fully functional without JS or storage.

Safety constraints: only work within the current same-origin path, validate safe IDs and finite nonnegative scroll, clamp to document height, do not construct a selector from arbitrary session text, keep browser zoom/new-tab modifiers native, and never intercept the Work Gallery wheel event. Navigation still falls back to `../../#work` if no session context exists. Preview rail scrolling remains unchanged.

Static parser checks for scripts/build.mjs and app.js passed before commit; interaction/browser QA and screen-reader review remain NOT_RUN. No merge to main, CI, or deployment.
