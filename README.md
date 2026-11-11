# Daily Curiosity — Concept A v6

Optional Recall / Reflection implementation, November 1, 2026. Requirements source: attached approved **Daily Curiosity - Concept A v6 Optional Recall Reflection Brief - 2026-11-01.docx**. Existing static project modified in place; no installation, framework, backend, or deployment. Open index.html with JavaScript enabled.

## Preservation

Since November 2026 this project lives in git (github.com/atercer4/daily-curiosity) and deploys to Netlify from `main`. The old `snapshots/` folders were retired; git history preserves every version. `tests/baseline/card-content-sha256.json` pins the original fields of all 20 cards and the daily-mapping test pins `SRC/daily.js`, replacing the snapshot hash checks. Run tests with `node tests/prototype.test.cjs`. Change rules: [docs/REVIEW_PROTOCOL.md](docs/REVIEW_PROTOCOL.md). If a production deploy regresses, follow [docs/ROLLBACK.md](docs/ROLLBACK.md).

## Recall interaction

Each of the 20 cards has one `recall` object with `prompt` and `reveal` strings in SRC/content.js. [All 20 prompts and responses](docs/RECALL.md) are documented. They retrieve the card’s central mechanism, distinction, tradeoff, or cultural insight without asking for incidental numbers. Responses summarize existing sourced content; no new factual material or source links were added.

A section labeled “Optional · Pause and recall” appears after Sources inside Deep Dive. Its prompt is hidden by the closed Deep Dive. A native details/summary control labeled “Reveal response” lets the reader think first and open or close the answer. There are no inputs or evaluations. Navigation remains available.

Each rendering creates fresh recall DOM nodes within that article. Today and Explore share only content data, not open state. Revealing one does not affect the other, even for the same card. Changing Explore cards creates a closed response for the new card and leaves Today untouched. Closing Deep Dive or Core also resets that surface’s response. Reload resets all disclosures. Recall introduces no auto-focus, live regions, timers, announcements, storage, or remote calls.

## Preserved behavior

Today remains date-determined; Explore retains five-card category cycling and Surprise Me. SRC/daily.js is byte-identical to v5: local fields acquired once on load; pure cardIndexForDate uses UTC calendar arithmetic and positive modulo around the 2026-10-22 epoch. The fixed permutation remains unchanged, recorded in git history. Explore may match Today and excludes only its current card on subsequent random draws.

All original card fields, category assignments, Hook/Core/Deep text, 36 source links, and two explanatory visuals are preserved. Only recall data was added. [CONTENT.md](docs/CONTENT.md) remains the historical v4 content/source register. Heading outline (fixed in issue #3): Today’s card title is h2 under the h1 “Today’s Curiosity”; Explore’s category prompt and card title are h3 under the h2 “Explore More”, and each card’s Core, Deep Dive and Sources/Recall headings follow one level below. Styles are keyed to classes, so the two surfaces look identical.

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

Recall is ephemeral and unevaluated; the app does not record whether readers think or reveal. Existing date limitations remain: timezone/system-clock changes may repeat or skip a daily card; an open tab needs reload after midnight; the library repeats every 20 days. Existing source-link issues remain documented in CONTENT.md.

No scoring, grades, right/wrong states, streaks, XP, progress bars, saved completion, accounts/profiles, analytics, notifications, social features, spaced repetition, adaptive difficulty, user notes/journaling, monetization, backend/API dependency, or theme customization was added.
