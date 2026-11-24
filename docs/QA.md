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

J/K: daily code unchanged and regression tests pass. Confirm same-date refresh stability and category cycling manually; random Explore may match Today, but does not immediately repeat itself. Existing clock/timezone limitations remain accepted. Midnight (issue #66): a tab hidden and shown again on a new local date moves Today, the cover and the masthead date to that date; a tab that stays visible keeps its card until it is hidden and shown again or reloaded.

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

## Issue #82: one featured card per category (24 November 2026)

This supersedes the "All" grid of issue #24. Explore opens on "Featured": four previews, one per category (its first card in library order), plus the "?" tile as a full-width fifth option. Each preview's "Explore <category> →" button (accessible name "Explore <category>: all <n> curiosities") shows that category's cards and moves focus to the selected chip, because the pressed button is replaced. The "Featured" chip returns to the four previews. The cabinet count is a polite live region.
- Automated: exactly four previews on load, in category order; every card is reachable through its category; "Explore" and "Featured" round-trip without touching Today or the open Explore card; the "?" draw still covers the whole library and never repeats the open card.
- Render check: the five Explore views at 320, 390 and 1280px (no overflow, every tile drawn, every chip and tile button at least 44px, four "Explore" buttons on the landing view).
- Headless Chromium keyboard pass at 320, 390 and 1280px: Enter on "Explore Arts" focused the Arts chip (pressed); Shift+Tab reached "Featured"; Enter restored the four previews.
- Screenshots: [320](design/qa/dc-82-320.jpg), [390](design/qa/dc-82-390.jpg), [390, Arts](design/qa/dc-82-390-category.jpg), [1280](design/qa/dc-82-1280.jpg).
- [ ] Pending in real browsers: screen-reader pass of the featured view and the chip focus move.

## Issue #45: Direction F reading rows (15 November 2026)

This supersedes C–E/L and G–I above. The idea, Look closer and Remember this? are now three sibling native disclosures, and the recall prompt and its reveal live in Remember this?. Closing Remember this? closes only its own response; the rows no longer reset each other. Today opens The idea on load and Explore cards start closed. Heading outline: Today h2 title → h3 rows (Sources h4); Explore h3 title → h4 rows (Sources h5). The row headings are visually hidden because each summary shows the same label.

Headless Chromium at 320, 390 and 1280 px:
- no horizontal overflow;
- no console errors;
- every button, summary and the cover link is at least 44 px tall;
- Enter on a focused summary opens it.

Before/after screenshots: [1280](design/qa/dc-45-1280.jpg), [390](design/qa/dc-45-390.jpg), [320](design/qa/dc-45-320.jpg). A real screen-reader pass is still pending.

## Render check in CI (issue #49)

`tests/render-check.cjs` runs in the required `tests` job after the regression suite. It serves the site locally and, in headless Chromium at 320, 390 and 1280px, renders every card on Today and in Explore with every disclosure open. It also renders one synthetic plate, numbers strip and cover drawing (injected in the browser, never card content), so the illustration path is covered before real plates exist.

A render fails when any of these happens:
- the page scrolls horizontally;
- a page or console error occurs;
- a figure's drawing (the element carrying the text alternative, not the figure around it) is hidden or under 40px, any part of it is hidden, it extends past its reading column, or it lacks a text alternative of at least 50 characters;
- a card that declares a cover drawing or a numbers strip does not show it;
- a plate label renders under 13px on screen or is cut off by the screen edge;
- a button, summary or the cover link is under 44px tall.

Screenshots of failing renders are uploaded as the `render-check-failures` artifact. To run it locally: `npm install --no-save playwright@1.63.0 && npx playwright install chromium && node tests/render-check.cjs`. Playwright is installed only in CI and adds nothing to the site.

The suite was checked against deliberately broken styles: a too-small tile action, a 600px-wide diagram, 9px plate labels, hidden plates or diagram parts, and a hidden cover drawing each failed the run.


## Auto-merge smoke test

This documentation-only note exists to verify the guarded last-mile workflow after PR #58. It makes no product, content, governance, dependency, or runtime change.
