# Daily Curiosity — Release Notes

## Phase 1 baseline (Concept A v7), November 2026

This is the stable, public baseline that Phase 2 content work builds on. Authority: [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 6, Phase 1 ("final release notes"). The source of truth is `main` on github.com/atercer4/daily-curiosity, deployed to Netlify on merge.

## Baseline contents

- **Product:** one curious idea a day, then explore only as deeply as you want. A static web app (HTML, CSS, JavaScript). No framework, backend, accounts, storage, analytics or external assets.
- **Today's Curiosity:** a card chosen by date from a fixed permutation in `SRC/daily.js`, starting at the 2026-10-22 epoch. The same date always shows the same card.
- **Explore More:** five native category buttons (four categories plus Surprise Me). Categories cycle their cards without an immediate repeat. Explore is independent of Today.
- **Card interaction:** Hook → Core Insight → Deep Dive & Sources → optional recall, all native `details` disclosures that start closed.
- **Library:** 20 cards, five in each category (Science & Nature; Engineering & Technology; Arts & Culture; History & Society), 36 source links and two explanatory visuals. Registers: [CONTENT.md](CONTENT.md) for content and sources, [RECALL.md](RECALL.md) for recall prompts and responses.
- **Safeguards:** CI runs syntax checks, the regression suite and a secret guard on every pull request. `tests/baseline/` pins the original fields of all 20 cards and `SRC/daily.js`.

## Changes since the git import

The v7 baseline was imported from Dropbox on 10 November 2026, with the old `snapshots/` folders excluded (git history now preserves every version). Since then:

| PR | Issue | Change |
|---|---|---|
| #1 | — | CI added; snapshot hash tests replaced with git-era baselines for card fields and `SRC/daily.js`. |
| #2 | — | Standing direction and review protocol added (owner one-tap merges, content fact-check gate). |
| #4 | #3 | Heading outline fixed: Explore's card title and category prompt are now h3 under "Explore More". |
| #6 | #5 | Approved recall wording fix for the autumn-pigments card; a test keeps RECALL.md in sync with the content. |
| #8 | #7 | Rollback procedure added ([ROLLBACK.md](ROLLBACK.md)). |
| #10 | #9 | Forced-colors (high contrast) support: the Venus bar chart and the selected category stay visible. |

No card text changed other than the approved recall wording fix in issue #5.

## Known limitations

- The daily card is read once on load: an open tab needs a reload after midnight, and timezone or system-clock changes can repeat or skip a card.
- The library repeats every 20 days. This length will grow as Phase 2 adds cards.
- Recall is ephemeral and unevaluated by design; nothing is recorded.
- Source links are external and can break; existing link issues are noted in CONTENT.md.
- The masthead and footer still read "v6"; this is cosmetic and unchanged here.

## Pending QA

Automated tests use a DOM stub, so these checks in real browsers are still pending (details in [QA.md](QA.md)):

- keyboard and screen-reader pass, including heading navigation;
- 200% and 400% zoom (no horizontal overflow was found at 320, 375, 768 and 1440 px in headless Chromium);
- real Windows High Contrast themes;
- console, network, storage and offline checks;
- source-link checks in CONTENT.md.

## Rollback

If a production deploy regresses, follow [ROLLBACK.md](ROLLBACK.md): restore the last good Netlify deploy, then revert through a pull request.

## Next

Phase 2: generalize the code and tests from exactly 20 cards to any number, then add sourced cards toward 40, each fact-checked by ChatGPT before merge.
