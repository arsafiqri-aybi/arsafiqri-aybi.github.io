# CP06.1 — Motion overlay accessibility and fallback correction

The authored CSS `html.motion-enhanced .motion-play-cover{display:block}` could override browser user-agent `[hidden]` styles when JS sets `cover.hidden=true`. Fixed with a more specific author-level `html.motion-enhanced .motion-play-cover[hidden]{display:none}`. On successful user-initiated play, keyboard focus moves to the native video controls; on failed play, the cover also disappears to permit native-controls retry and a text status explains the fallback. No autoplay.

This update only touches JS/CSS and corresponding source tests; generated static HTML remains exactly as in previous checkpoint. End-to-end video playback is not verified without an accessible source stream.
