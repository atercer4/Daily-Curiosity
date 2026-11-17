# Daily Curiosity — Release Notes

## Phase 1 baseline (Concept A v7), November 2026

This is the stable, public baseline that Phase 2 content work builds on. Authority: [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 6, Phase 1 ("final release notes"). The source of truth is `main` on github.com/atercer4/daily-curiosity, published by GitHub Pages on merge (Netlify until 15 November 2026).

## Baseline contents

- **Product:** one curious idea a day, then explore only as deeply as you want. A static web app (HTML, CSS, JavaScript). No framework, backend, accounts, storage, analytics or external assets.
- **Today's Curiosity:** a card chosen by date from a fixed permutation in `SRC/daily.js`, starting at the 2026-10-22 epoch. The same date always shows the same card.
- **Explore More:** five native category buttons (four categories plus Surprise Me). Categories cycle their cards without an immediate repeat. Explore is independent of Today.
- **Card interaction:** Hook → Core Insight → Deep Dive & Sources → optional recall, all native `details` disclosures that start closed.
- **Library:** 24 cards: the original 20 (five per category) plus four Phase 2 cards, one in each category (issues #17 and #19), with 55 source links and two explanatory visuals. Registers: [CONTENT.md](CONTENT.md) for content and sources, [RECALL.md](RECALL.md) for recall prompts and responses.
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
| #14, #16 | #13, #15 | Code and tests generalized from exactly 20 cards to N cards; new cards append to the daily rotation. |
| #18 | #17 | First Phase 2 cards: `gps-relativity` (GPS clocks and relativity) and `true-fresco` (true fresco). |
| #20 | #19 | Phase 2 cards: `petrichor` (the smell of rain) and `exchequer-tallies` (tally sticks and the 1834 fire). |
| #28 | #21 | Design System 1.0 (Direction F) recorded in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). |
| #31 | #30 | Fallback builder documented for when Claude is unavailable. |
| #32 | #22 | Design System 1.0 step 1: self-hosted Playfair Display and Source Sans 3 (OFL), section 3 tokens and paper grain, labels The idea / Look closer / Remember this?, Surprise Me reads “Take me somewhere unexpected”, no hard-coded counts or “v6” badge. |
| #33 | #23 | Design System 1.0 step 2: the Today cover (question and tease, falling back to title and hook) and the phone first screen. |
| #34 | #24 | Design System 1.0 step 3: Explore becomes “The cabinet of curiosities”, a grid of tiles with “All” plus category filter chips and a dark “?” Surprise Me tile; opening a tile shows the card below and moves focus to it. Category cycling is replaced by filtering. |
| #39 | — | Fact-check backlog, combined batch: 13 original cards replaced with their dual-approved register drafts (one commit per card; sources replaced where the originals were unreadable or did not support the text; misattributions and unsupported claims fixed). Four cards were approved unchanged and are untouched; three are excluded pending source access. Baseline pins re-pinned for the 13. Review protocol: register-based gate, claim-by-claim evidence and source-access status required in every review, combined-PR policy. |
| #42 | — | Hosting moved from Netlify to GitHub Pages (owner decision, 15 November 2026): `.nojekyll` added; STANDING_DIRECTION, README, ROLLBACK and DESIGN_SYSTEM updated; STANDING_DIRECTION section 8 now names the two-reviewer register gate. |
| #46 | #45 | Design restoration to the approved Direction F reference (no card text changed): the reading area becomes an open ivory column with three sibling reading rows (The idea · Look closer · Remember this?, each with an italic note; Today opens The idea), replacing the v7 boxed card, “01 / Hook” label, Open/Close pills, nested beats and closing line. The cabinet widens to four columns with the tile number top-right, a “Look inside →” text action, short chips with category dots and the “?” tile last. Footer per the reference. The Venus and woodcut figures keep their data and text alternatives, restyled as field-journal plates. Before/after: [1280](design/qa/dc-45-1280.jpg), [390](design/qa/dc-45-390.jpg), [320](design/qa/dc-45-320.jpg). |
| #48 | #47 | Illustration components (code only, no card content). `visual.type: "plate"` draws an original line figure from data (whitelisted shapes, text labels, one text alternative). `visual.numbers` adds a numbers strip of at most three figures. `visual.cover: true` redraws the plate on the Today cover. All of it lives inside the hashed `visual` field, and a test fails on any card field outside the canonical hash, so visuals cannot bypass the register gate. Schema and the visual-assessment choices are in [CONTENT.md](CONTENT.md). Layout checked with synthetic data: [cover](design/qa/dc-47-1280-cover.jpg), [figure](design/qa/dc-47-1280-figure.jpg), [390](design/qa/dc-47-390.jpg), [320](design/qa/dc-47-320.jpg). |
| #50 | #49 | Render check in CI: every card on Today and in Explore at 320, 390 and 1280px in headless Chromium, plus a synthetic plate fixture. It fails on horizontal overflow, page errors, broken or unlabelled figures, plate labels under 13px, or controls under 44px, and uploads screenshots of failures. Playwright is pinned (1.63.0) and installed in CI only. See [QA.md](QA.md). |
| #51 | #49 | Render check follow-up: it measures the drawing itself rather than the figure around it, and requires the cover drawing and numbers strip a card declares (Codex finding on #50). |
| #53 | #52 | Workflow: every card gets a visual assessment (format or none, with a reason), with Gemini naming the possible visual evidence. Every label, number, caption, alt text and geometric claim is fact-checked by both reviewers as part of the hashed draft. A "not to scale" rule applies, and PRs with visuals need screenshots and the render check. [REVIEW_PROTOCOL.md](REVIEW_PROTOCOL.md#visual-assessment). |
| #55 | #54 | Page metadata: a meta description (the core promise and the four categories) so search results and link previews say what Daily Curiosity is. No external assets or tracking; Open Graph stays in Phase 4. |
| #57 | #56 | Fact-check backlog: `exchequer-tallies` replaced with its dual-approved register draft (v3). Wikipedia-only details removed; sources narrowed to the History of Parliament and the Science Museum Group (source links 57 → 55). |
| #61 | #60 | Fact-check backlog: `gps-relativity` replaced with its dual-approved register draft (v5): retitled "Clocks designed to tick slow", one framing sentence replaced with Pogge's wording, and the Pogge source relabelled. Source links unchanged (55). |

Original card text has changed only through approved fixes: the recall wording fix in issue #5 and the 13 register-approved cards above.

## Known limitations

- The daily card is read once on load: an open tab needs a reload after midnight, and timezone or system-clock changes can repeat or skip a card.
- The library repeats every 24 days. This length grows as Phase 2 adds cards: since issue #13 the rotation length equals the library size, and new cards are appended after the original 20.
- Recall is ephemeral and unevaluated by design; nothing is recorded.
- Source links are external and can break; existing link issues are noted in CONTENT.md.

## Pending QA

Automated tests use a DOM stub, so these checks in real browsers are still pending (details in [QA.md](QA.md)):

- keyboard and screen-reader pass, including heading navigation;
- 200% and 400% zoom (no horizontal overflow was found at 320, 375, 768 and 1440 px in headless Chromium);
- real Windows High Contrast themes;
- console, network, storage and offline checks;
- source-link checks in CONTENT.md.

## Rollback

If a production deploy regresses, follow [ROLLBACK.md](ROLLBACK.md): revert the change through a pull request; GitHub Pages republishes `main` within minutes of the merge.

## Next

Phase 2: generalize the code and tests from exactly 20 cards to any number, then add sourced cards toward 40, each approved by two independent reviewers in the Editorial Review Register before it is coded.
