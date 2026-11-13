# Daily Curiosity — Review Protocol

Daily Curiosity runs autonomously. The founder gets a weekly digest and escalations, not a merge request for every change. Full direction: *Daily Curiosity — Standing Direction* (Google Doc in 01_Project_Bible).

## Roles
| Who | Does |
|---|---|
| Gemini | Scouts topics into Drive `02_Research_Inbox` (Mon/Wed/Fri) |
| Claude | Picks topics, builds cards and code, opens PRs |
| Codex | Reviews every PR (`@codex review`) |
| Fact-checker (independent Claude agent) | Fact-checks every content PR before it can be ready (see [Fact-check gate](#fact-check-gate)) |
| ChatGPT | Optional second fact-check; writes the weekly digest |

## Rules
1. Every change goes through a pull request. Nothing is pushed straight to `main`.
2. The builder never reviews its own PR. Claude builds; Codex reviews code; a separate fact-checker agent that did not write the text fact-checks content.
3. Reviews cite `file:line` and end with one verdict: **RECOMMEND MERGE**, **CHANGES REQUESTED**, or **FOUNDER DECISION NEEDED**.
4. **Merging is done by the owner with one tap.** The agent environment blocks agents from merging ("merge without review"), so automatic merging is not used. The build task labels a PR `ready-to-merge` and notifies the owner only when:
   - CI is green;
   - Codex found no major issues on the exact head commit;
   - nothing in rule 5 applies.
5. Owner-decision items (label `owner-decision`, never marked ready): anything on the escalation list in [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 7. That includes:
   - accounts, data collection, analytics or tracking;
   - ads, payments or spending;
   - domains, backends or paid services;
   - a substantial redesign;
   - social features or personalization;
   - removing cards or major features.
   It also includes any change to this protocol, the standing direction or `.github/`.
6. **Content PRs** (label `content`, any new or edited card text, including cover questions, teases, figure labels and numbers) must pass the [fact-check gate](#fact-check-gate) on their exact head commit before they get `ready-to-merge`. A content PR with no recorded PASS is never ready.
7. Never commit secrets, `.env` files, keys, or the old `snapshots/` folders. Git history is the archive.
8. `tests/baseline/` pins the original 20 cards and `SRC/daily.js`. A pin may change only when the PR says why (for example, to make room for new cards) and the reviewer confirms that existing card text is unchanged.

## Fact-check gate

Owner decision, 13 November 2026: fact-checking is a required gate, not an optional step. It happens twice.

**1. Before writing (topic check).** Before drafting a card or any new line of copy, the builder:
- opens every source it plans to cite and confirms it loads, isn't paywalled and is reputable;
- writes an evidence list: each planned claim, the source that supports it, and a short quote;
- drops the topic, or changes the claim, if a key claim has no support or rests only on Wikipedia.

The evidence list goes in the PR body as the "Fact-check list".

**2. Before ready (independent check).** After the PR is opened, a fact-checker that did not write the text checks it:
- A fresh Claude agent (a subagent with no access to the builder's reasoning) is given only the card text and its sources.
- It opens every source and checks every claim in every field. It reports claim | verdict | quote in a PR comment headed `## Fact-check: PASS — <sha>` or `## Fact-check: FAIL — <sha>`.
- A FAIL lists the exact fixes. The builder fixes them on the same branch, and the new head commit is checked again.
- Each check covers one head commit. Any new push needs a new PASS.

**What blocks a card:**
- a wrong or misleading claim;
- a claim no opened source supports;
- a dead source, or one paywalled without a summary;
- a key claim supported only by Wikipedia.

ChatGPT may add a second fact-check. If it reports FAIL, that also blocks the card. Its PASS is not required.

**Re-check, 13 November 2026.** The four Phase 2 cards that merged without a recorded fact-check were re-checked:
- `gps-relativity`: PASS.
- `petrichor`: PASS. The aerosol-to-scent link is now hedged as the researchers' hypothesis, and MIT News is added as a source.
- `true-fresco`: FAIL. Its "drying holds the color" wording and the secco fallback in its recall response were misleading; both are fixed, and a museum source for carbonation is added.
- `exchequer-tallies`: FAIL. Its cover tease was misleading; it is fixed, and Parliament and Science Museum sources are added so key claims don't rest on Wikipedia alone.

## Fallback builder: when Claude is unavailable

This applies when Claude can't run, for example because the owner hit a usage limit and the scheduled build runs stop. The issue queue is agent-agnostic: every task is a GitHub issue labelled `auto` with a "Done when" list. Any capable agent can build the oldest one by following these docs. The owner chooses one mode:

1. **Pause (default).** Do nothing. The queue waits, and Claude's scheduled runs resume where they left off after the limit resets. Nothing is lost.
2. **Codex builds, and Claude reviews on return (recommended for code).**
   - The owner starts Codex on the oldest open `auto` issue with the prompt below.
   - The PR body says `Builder: Codex`.
   - Codex does **not** review its own PR, and the PR is not marked ready until Claude has reviewed it.
   - New card content (label `content`) should wait for mode 1. It already needs a separate writer and fact-checker.
3. **Codex builds, ChatGPT reviews.** This is the fastest, but it is a weaker check because both agents are from the same vendor. Use it only if the owner explicitly approves it as a temporary exception, and record that in the PR.

**When Claude returns**, the scheduled build agent first checks for open PRs whose body says `Builder: Codex`. Before taking any new issue, it reviews the oldest such PR at its head commit:
- It runs the tests and checks the issue's "Done when" list, `DESIGN_SYSTEM.md` and the standing direction.
- It posts a review that cites `file:line` and ends with one verdict.
- If the verdict is RECOMMEND MERGE and CI is green, it posts the usual "Ready" comment (content PRs need a fact-check PASS on the head commit first), adds `ready-to-merge` and notifies the owner.
- Otherwise it leaves the findings for Codex. The owner can comment `@codex address that feedback`.

While a Codex-built PR is open, Claude does not open a PR that touches the same files.

**Prompt for starting Codex** (paste into Codex with the `atercer4/daily-curiosity` repository selected):

> You are the fallback builder for Daily Curiosity while Claude is unavailable. Read `docs/STANDING_DIRECTION.md`, `docs/REVIEW_PROTOCOL.md`, `docs/DESIGN_SYSTEM.md`, `README.md` and `docs/CONTENT.md` on `main`.
>
> 1. Take the oldest open issue labelled `auto` (skip `owner-decision` and `content`) that has no open PR.
> 2. Implement exactly its "Done when" list on a branch named `dc-<issue>-<slug>`. Don't broaden scope.
> 3. Keep the runtime static and private: no new dependencies, network calls, storage, tracking or external assets. Don't edit original card text.
> 4. Add or update tests. `node tests/prototype.test.cjs` and `node --check SRC/*.js` must pass.
> 5. Open one PR whose body includes `Builder: Codex`, `Closes #<issue>`, what changed and why (cite the standing direction or design system section), and the tests run.
> 6. Don't review or approve your own PR. It waits for Claude's review.
