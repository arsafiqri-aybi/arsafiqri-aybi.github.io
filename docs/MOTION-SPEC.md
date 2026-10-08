# Motion specification

Semantic state is committed before animation. Native URLs and native scrolling remain authoritative.

| Motion | Purpose / trigger | Mapping and ownership | Cancellation / fallback | Cost and verification |
| --- | --- | --- | --- | --- |
| Hero arrival | Introduce the three-layer sculpture on first page initialization | WAAPI on image: +24px/-4deg/.6 opacity → base, 1100ms cubic-bezier(.22,1,.36,1); copy remains immediately visible | Finite; no queue; cancellation removes effect; reduced motion presents static object | One rasterized SVG delivery object; authored geometry retained separately; measure frame intervals, image load and LCP |
| Hero pointer | Small depth feedback on fine-pointer movement | CSS custom properties on wrapper → image transform; travel capped at 6px on either axis | Pointer leave resets; hidden tab and reduced motion reset; no mouse needed | One geometry read per event; verify touch, preference change and responsive layout |
| Hero scroll | Reframe object during native scroll | One scheduled rAF per input batch, 0…-9deg from section progress; no ongoing animation loop | IntersectionObserver prevents offscreen work; hidden tab cancels scheduled frame; resume computes current state | Verify rapid reverse scroll, resizing, visibility and rAF trace |
| Work selection | Connect a selected label with its preview | Set aria-pressed / hidden / active synchronously; new article moves +12px → 0 and .6 → 1 opacity, 420ms | Cancel previous animation on new selection; no delayed semantic callback; reduced motion changes state immediately | Verify rapid clicks, keyboard, local list scroll and hidden focus |
| Preview → detail | Expand the work into a full-page case study | Native cross-document View Transitions; unique project-art and project-title names; 650ms | Standard same-origin links when unsupported; direct URLs, Back, Forward and refresh work; reduced motion disables transition | Browser route/Back tests and visual sequence; no cloned overlay or focus trap |
| Narrative reveal | Modest spatial arrival for newly visible prose | 14px → 0 transform, 600ms, once per block; never hides the semantic content | Observer unobserves each revealed block; preference/hidden tab cancels; static fallback when API unavailable | Verify all information is available with JS off |
| Press / hover | Local acknowledgement and next-action hint | Finite CSS transforms, border/color; shared CSS tokens | No information depends on hover; reduced motion disables transitions | Keyboard, touch, focus-visible, contrast |

On `pagehide` observers, listeners and animation ownership are released. BFCache `pageshow` restores enhancements once. Session storage remembers the active project for return navigation; unavailable storage is safely ignored. No secrets, analytics, backend or third-party runtime request is added.

Official API reference inspected: https://developer.chrome.com/docs/web-platform/view-transitions/cross-document. Lab metric definitions: https://web.dev/articles/vitals. These APIs are progressive enhancement; they are not relied on for essential navigation.
