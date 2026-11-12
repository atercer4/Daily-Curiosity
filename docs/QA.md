# Concept A v6 independent QA handoff

Date: November 1, 2026. Authority: attached approved Optional Recall / Reflection brief. All 20 prompts/responses are in RECALL.md. Previous QA documentation is preserved in the v5 snapshot.

## Completed

- Pre-edit v5: 20/20 passed; recoverable snapshot of 76 files verified against originals before edits, then against SHA-256 manifest afterward.
- Active v6: 24/24 passed.
- Archived unchanged v5/v4/v3/v2 suites: 20/14/11/7 passed respectively, zero failures.
- Syntax checks: app.js, content.js, daily.js passed.
- Daily code byte-identical; original content fields match preserved v4/v5 material, with recall as the only content addition.
- Tests cover 20 prompt/response pairs, native nested gating, reveal reset on parent close, same-card Today/Explore independence, card-change reset, source/visual rendering, scope safeguards and snapshot integrity. Existing daily/date/category/random regression coverage passes.

The stub models the open property and parent nesting, not native browser rendering or real keyboard input. Programmatic changes to open in these tests do not prove user-input behavior. No real-browser, screen-reader, mobile, or manual editorial pass is claimed. Earlier browser restrictions were not bypassed.

## Acceptance and pending independent QA

A/B: 20 pairs exist; each was drafted from the central idea. Independently review all prompts against the card, avoiding trivia and checking calm, concise, non-evaluative responses.

C–E/L: recall is inside Deep Dive, labeled optional, with a native reveal disclosure. In an actual browser, verify no prompt before Deep Dive opens, no answer before reveal, Enter/Space operation, Open/Close state, and no navigation gate.

F/M/N: source checks show no grading/progress, persistence or added services. Inspect rendered UI, console, network and storage while exercising all flows to verify those properties independently.

G–I: separate DOM nodes and same-card independence tested. Open Today’s response, change Explore through all five categories and Surprise Me, and confirm Today stays open. Reveal/close either response independently, including when both show the same card. Closing either Core or Deep Dive resets only that surface’s response. New Explore cards start closed.

J/K: daily code unchanged and regression tests pass. Confirm same-date refresh stability and category cycling manually; random Explore may match Today, but does not immediately repeat itself. Existing clock/timezone/midnight limitations remain accepted.

O/P: snapshot integrity tests and archived suites pass. Independently copy the full v5 snapshot elsewhere, open it and run its suite.

Q: all real-browser items remain pending:

- [ ] Keyboard and screen reader: logical tab order; native summaries; meaningful labels; no hidden prompt/answer tab stops; no new focus movement, live regions or announcement noise.
- [ ] 320/375/768/1440 CSS pixels, 200%/400% zoom: both surfaces expanded, long prompts/responses, controls, citations and diagrams; no clipping or horizontal overflow.
- [ ] Forced colors, reduced motion, visible focus and selected state. No animation introduced. Forced colors partly done in issue #9 (below); real Windows High Contrast check pending.
- [ ] Console, network, storage and offline flow. No missing local resources, app-driven requests or persistent writes; citations require internet.
- [ ] All 20 responses in both surfaces; screen-reader state and reset behavior, including rapid open/close interactions.
- [ ] Existing source-link checks in CONTENT.md and existing Today/Explore device checks remain pending.

R: fixed in issue #3 (November 10, 2026). Explore’s card title and category prompt are now h3 under “Explore More” (h2), with Core h4, Deep Dive h5 and Sources/Recall h6; Today keeps h1 → h2 → h3 → h4 → h5. A headless-Chromium layout comparison at 375 and 1280 px found no position, size or font differences against the previous version. A real screen-reader heading-navigation check remains pending.

S: forced colors fixed in issue #9 (November 11, 2026). With `forced-colors: active` emulated in headless Chromium, the Venus bar chart's bars disappeared (they were painted with a background only) and the selected category kept only its underline. A `@media (forced-colors: active)` block now draws the bars in `CanvasText` and the selected category in `Highlight`/`HighlightText`. Normal rendering at 375 and 1280 px is pixel-identical to the previous version. The same audit found no horizontal overflow at 320, 375, 768 or 1440 px with every disclosure open on all 20 cards, and all checked text/background pairs at 5.4:1 contrast or better. A check in real Windows High Contrast themes remains pending.

## Human validation

Observe outside the app, without analytics: is the prompt clearly optional, does it encourage retrieval, is the response useful, and does the experience avoid feeling like homework? No completion or performance is recorded.

## Limitations

Ephemeral recall state, no response input/evaluation, fixed 20-day content cycle, date read only on load, timezone/clock changes can repeat or skip cards, inherited external source availability issues, and pending independent browser/editorial QA. No deployment performed.

## Issue #24: the cabinet of curiosities (12 November 2026)

- Automated: every card is reachable from the grid under "All" and under its category filter; the "?" tile never repeats the open card and stays under every filter; opening a tile moves focus to the card with three closed layers; filters change only the grid; counts come from the library size; Today is untouched by every Explore action.
- Headless Chromium at 320, 390 and 1280 px ([320](design/qa/dc-24-320.jpg), [390](design/qa/dc-24-390.jpg), [1280](design/qa/dc-24-1280.jpg)): no horizontal overflow, every chip and tile button at least 44px tall, no console errors. Pressing Enter on a "Look inside" button opened that card and focused it. Each tile button's accessible name is "Look inside <title>" via `aria-labelledby`.
- [ ] Pending in real browsers: screen-reader pass of the tile list and filter chips, 200%/400% zoom, Windows High Contrast (tiles keep a CanvasText border; the selected chip keeps Highlight).
