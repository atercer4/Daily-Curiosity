# Daily Curiosity

One curious idea a day. Explore only as deeply as you want.

Daily Curiosity is a small static web app (HTML, CSS and JavaScript, no framework, backend or build step). Each card starts from something observable or surprising and explains the process, mechanism, practice or evidence behind it, with sources. It is live at https://atercer4.github.io/Daily-Curiosity/, published by GitHub Pages from `main` (Netlify until 15 November 2026).

## Run it

Open `index.html` in a browser with JavaScript enabled, or serve the folder with any static file server. There is nothing to install.

## What a visitor sees

- **Today's curiosity.** A dark cover in the card's category theme leads with the card's question and tease (falling back to its title and hook), plus a cover drawing when the card has one. The card below it has three reading rows: The idea (the core, open on load), Look closer (the deep dive and sources) and Remember this? (an optional recall prompt with a "Reveal response" control). The card is chosen from the local date by `SRC/daily.js`, so the same date always shows the same card. A tab hidden and shown again on a new local date moves to that day's card (issue #66).
- **The cabinet of curiosities.** A grid of tiles, one per card, with "All" and four category filter chips. "Look inside →" opens that card below the grid and moves focus to it. The dark "?" tile ("Take me somewhere unexpected") opens a random card from the whole library. Explore is independent of Today, and filtering changes only the grid.
- **Visuals.** A few cards carry a figure drawn from data in their `visual` field: a line-drawn plate, a numbers strip of up to three figures, or a cover drawing. Every figure has a text alternative. The schema is in [docs/CONTENT.md](docs/CONTENT.md).

Counts shown on the page come from the library size, never from hard-coded numbers. The current library, sources and visuals are listed in [docs/CONTENT.md](docs/CONTENT.md) and summarized in [docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md).

Deliberately absent: accounts, saved state or browser storage, analytics or tracking, network requests made by the app, external assets (the two fonts are self-hosted under the OFL), scores, streaks and notifications. Recall is never recorded or evaluated. Adding any of these is an owner decision ([docs/STANDING_DIRECTION.md](docs/STANDING_DIRECTION.md) section 7).

## Files

- `index.html`: page structure, metadata and the inline site icon.
- `SRC/content.js`: the cards (`DAILY_CURIOSITIES`).
- `SRC/daily.js`: the daily rotation order (`DAILY_CARD_IDS`), and the date-to-card mapping around the 2026-10-22 epoch.
- `SRC/app.js`: renders the cover, Today's card, the cabinet and the visuals.
- `SRC/styles.css` and `SRC/fonts/`: Design System 1.0 styles and self-hosted fonts.
- `tests/`: the regression suite, the render check and the baseline pins.

## Tests

```
node tests/prototype.test.cjs
for f in SRC/*.js; do node --check "$f"; done
node tests/render-check.cjs
```

The regression suite uses a DOM stub. It covers the daily mapping, the cabinet and filters, the reading rows and recall, the card schema and word limits, and the docs that must stay in sync with the content. `tests/baseline/` pins the original 20 cards' content hashes and `SRC/daily.js`. The render check opens every card on Today and in Explore at 320, 390 and 1280px in headless Chromium and fails on overflow, page errors, broken or unlabelled figures, or small touch targets; it needs Playwright and its Chromium build (`npm install --no-save playwright@1.63.0 && npx playwright install chromium`), which are installed in CI only. CI runs all three on every pull request. Real-browser checks that are still pending are listed in [docs/QA.md](docs/QA.md).

## Changing it

- Every change goes through a pull request; nothing is pushed to `main`. Rules: [docs/REVIEW_PROTOCOL.md](docs/REVIEW_PROTOCOL.md). Direction and autonomy limits: [docs/STANDING_DIRECTION.md](docs/STANDING_DIRECTION.md).
- Card text and visuals are fact-checked before they are coded: a card may be coded only when both independent reviewers have approved its exact draft in the Editorial Review Register (REVIEW_PROTOCOL, "Fact-check gate").
- New cards go at the end of `DAILY_CARD_IDS` in `SRC/daily.js`, after the original 20, whose order is pinned. Tests require unique IDs and titles, balanced categories (no category more than two cards ahead of another), no two consecutive same-category cards in the rotation, and no card field outside the hashed set. Recall prompts and responses are listed in [docs/RECALL.md](docs/RECALL.md).
- Visual work follows [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) (Design System 1.0, owner-approved 12 November 2026).
- If a production deploy regresses, follow [docs/ROLLBACK.md](docs/ROLLBACK.md).

## Known limitations

- Timezone or system-clock changes can repeat or skip a daily card, and a tab that stays on screen past midnight keeps its card until it is hidden and shown again or reloaded.
- The library repeats once every N days, where N is the number of cards.
- Source links are external and can break.

History of what changed and when: [docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md) and the git log.
