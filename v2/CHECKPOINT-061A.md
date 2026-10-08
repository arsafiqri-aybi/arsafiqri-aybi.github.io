# CP06.1A — Authentic Motion player, safe poster crop and responsive foundation

- Copied `assets/motion-original-contact-sheet.png` from the original Motion repository at commit `ac73856a159587db1aa936409fd718bd5115ae5b`, Git blob `1b259487f736970eeb8db34b05642ab48cac0ddb`. This sheet includes six sampled original frames; the cropped bottom-right cell shows frame 179 (~5.97s). It is an authentic visual sample, not an AI illustration. The larger six-frame PNG (76,029 bytes) loads only on Motion Case detail.
- Progressive-enhanced overlay button displays the cropped final frame and starts the original pinned video only from user click. If JS disabled, the native controls remain available. No autoplay or loop.
- Earlier tablet breakpoint for About layout avoids narrow text. Portrait width is more restrained on mobile.
- `social.svg` now matches Digital Builder × Business Strategist with no portrait. Existing Open Graph references still point to social.svg.
- No held project footage/images are published.
- Parsing and media registry static checks passed; browser playback, cross-device reflow and real accessibility QA remain NOT_RUN at this checkpoint. More steps (larger portrait, regenerated HTML and QA) follow.
