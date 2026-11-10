# Daily Curiosity — Concept A v6

Optional Recall / Reflection implementation, November 1, 2026. Requirements source: attached approved **Daily Curiosity - Concept A v6 Optional Recall Reflection Brief - 2026-11-01.docx**. Existing static project modified in place; no installation, framework, backend, or deployment. Open index.html with JavaScript enabled.

## Preservation

Before edits, v5 passed 20 tests. The complete build was copied to `snapshots/concept-a-v5-2026-11-01/`, including earlier snapshots required by its tests. All 76 copied files were SHA-256 compared with originals before edits. SHA256.json records those hashes; active tests verify them again. To recover, copy the entire snapshot folder to a separate location and open its index.html; retain nested directories for tests. No previous snapshots were changed.

## Recall interaction

Each of the 20 cards has one `recall` object with `prompt` and `reveal` strings in SRC/content.js. [All 20 prompts and responses](docs/RECALL.md) are documented. They retrieve the card’s central mechanism, distinction, tradeoff, or cultural insight without asking for incidental numbers. Responses summarize existing sourced content; no new factual material or source links were added.

A section labeled “Optional · Pause and recall” appears after Sources inside Deep Dive. Its prompt is hidden by the closed Deep Dive. A native details/summary control labeled “Reveal response” lets the reader think first and open or close the answer. There are no inputs or evaluations. Navigation remains available.

Each rendering creates fresh recall DOM nodes within that article. Today and Explore share only content data, not open state. Revealing one does not affect the other, even for the same card. Changing Explore cards creates a closed response for the new card and leaves Today untouched. Closing Deep Dive or Core also resets that surface’s response. Reload resets all disclosures. Recall introduces no auto-focus, live regions, timers, announcements, storage, or remote calls.

## Preserved behavior

Today remains date-determined; Explore retains five-card category cycling and Surprise Me. SRC/daily.js is byte-identical to v5: local fields acquired once on load; pure cardIndexForDate uses UTC calendar arithmetic and positive modulo around the 2026-10-22 epoch. The fixed permutation remains unchanged, documented in the [preserved v5 README](snapshots/concept-a-v5-2026-11-01/README.md). Explore may match Today and excludes only its current card on subsequent random draws.

All original card fields, category assignments, Hook/Core/Deep text, 36 source links, and two explanatory visuals are preserved. Only recall data was added. [CONTENT.md](docs/CONTENT.md) remains the historical v4 content/source register. Heading cleanup was not included: Explore’s card title remains h2, the allowed minor v5 issue.

## Files changed

- SRC/content.js: 20 data-driven prompt/response pairs; original fields preserved.
- SRC/app.js: native optional recall disclosure and local reset handlers.
- SRC/styles.css: recall section spacing and border.
- index.html: v6 header/footer labels.
- tests/prototype.test.cjs: recall coverage, snapshot verification; existing scope guards retained. The common closed-disclosure assertion now expects three nested details, and the content-preservation test compares original fields after excluding recall.
- README.md, docs/QA.md: current behavior and QA handoff.
- Added docs/RECALL.md and the verified v5 snapshot with SHA256.json.

## Test results

Active suite: 24/24 passed. Archived unchanged suites: v5 20/20, v4 14/14, v3 11/11, v2 7/7. App/content/daily JavaScript syntax checks passed. Coverage includes all recall data and nesting, native reveal structure, resets, same-card surface independence, absence of evaluation/input/status mechanics, unchanged daily code, calendar regression, full category/random behavior, source/visual preservation, and all snapshot hashes.

Tests use a DOM stub, so native visibility, keyboard operation, layout, accessibility, console/network/storage behavior need independent browser QA. No browser pass is claimed. See [QA.md](docs/QA.md).

## Known limitations and scope

Recall is ephemeral and unevaluated; the app does not record whether readers think or reveal. Existing date limitations remain: timezone/system-clock changes may repeat or skip a daily card; an open tab needs reload after midnight; the library repeats every 20 days. Existing source-link issues remain documented in CONTENT.md. The Explore heading-level issue remains deferred.

No scoring, grades, right/wrong states, streaks, XP, progress bars, saved completion, accounts/profiles, analytics, notifications, social features, spaced repetition, adaptive difficulty, user notes/journaling, monetization, backend/API dependency, or theme customization was added.
