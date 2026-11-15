# Daily Curiosity — Review Protocol

Daily Curiosity runs autonomously. The founder gets a weekly digest and escalations, not a merge request for every change. Full direction: *Daily Curiosity — Standing Direction* (Google Doc in 01_Project_Bible).

## Roles
| Who | Does |
|---|---|
| Gemini | Scouts topics into Drive `02_Research_Inbox` (Mon/Wed/Fri) |
| Claude | Picks topics, builds cards and code, opens PRs |
| Codex | Reviews every PR (`@codex review`) |
| Fact-checker (independent Claude subagent) | Reviews every card draft before it is coded (see [Fact-check gate](#fact-check-gate)) |
| ChatGPT | Second required reviewer of every card draft; writes the weekly digest |

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
6. **Content PRs** (label `content`, any new or edited card text, including cover questions, teases, figure labels and numbers) may code only text that the register shows as `APPROVED` for its exact Draft Hash (see [fact-check gate](#fact-check-gate)). A content PR whose coded hashes don't match is never ready.
7. Never commit secrets, `.env` files, keys, or the old `snapshots/` folders. Git history is the archive.
8. `tests/baseline/` pins the original 20 cards and `SRC/daily.js`. A pin may change only when the PR says why (for example, to make room for new cards) and the reviewer confirms that existing card text is unchanged.

## Fact-check gate

Owner decisions, 13 and 15 November 2026: card text is fact-checked **before** it is coded, by two independent reviewers, and every review must show its evidence claim by claim. A summary verdict alone is not a review.

### Flow

1. **Draft.** Claude writes the card as a code-ready JSON file plus a reviewer Doc in Drive `03_Card_Drafts`, and computes the canonical Draft Hash from the JSON (only Claude computes it; reviewers copy it).
2. **Register.** The draft goes on the *Editorial Review Register* Google Sheet (Card Pipeline tab, columns A–F). Any change to any field is a new version with a new hash, and earlier reviews stop counting.
3. **Two independent reviews of the exact hash**, each appended to the Review Log tab with a link to its full report:
   - a fresh Claude subagent that did not write the card and never sees the other review;
   - ChatGPT, on its own schedule.
4. **Approval.** The register's Build Authorization reads `APPROVED` only when both reviewers passed the current hash. Nothing else authorizes coding.
5. **Code.** Claude copies the approved JSON into `SRC/content.js` verbatim and confirms the coded entry hashes to the approved value. A card whose text is approved unchanged needs no PR; its Build Status is set to `VERIFIED`.

The older in-PR `## Fact-check: PASS — <sha>` comment is retired; the register approval replaces it.

### What every review report must contain

A report that lacks either table below is **non-conforming**: it does not count as a PASS, even if the Review Log row says PASS.

**1. Source-access table.** One row per cited source URL, plus any owner-supplied copy used:

| Source URL | Access status | What was read |
|---|---|---|

Access status is exactly one of:
- `OPENED` — the full page or document loaded and was read;
- `OPENED-PARTIAL` — loaded but truncated, or only part was readable (say which part);
- `OWNER-COPY` — the live page was blocked, so an owner-saved copy in Drive `04_Fact_Check_Sources` was used (give its file name);
- `BOT-CHECK` — a human-verification or anti-bot challenge;
- `PAYWALL`;
- `HTTP-403`, `HTTP-404`, `TIMEOUT` or another stated error;
- `NOT ATTEMPTED`.

**2. Claim table.** Every sentence of every field is broken into individual claims: title, cover question, tease, hook, core, deep dive, recall prompt and response, visual labels and alt text, source labels.

| # | Field | Claim | Verdict | Source | Supporting quote |
|---|---|---|---|---|---|

- Verdict is exactly one of `SUPPORTED`, `UNSUPPORTED`, `WRONG/MISLEADING` (including inferences beyond the source and misattribution to a source), or `UNVERIFIED-ACCESS` (the only source for it could not be opened).
- `SUPPORTED` needs a short verbatim quote from a source whose status is `OPENED`, `OPENED-PARTIAL` (from the readable part) or `OWNER-COPY`.
- Framing sentences that make no factual claim may be marked `SUPPORTED` with "framing; no factual claim" in the quote column.

**Verdict rules:**
- PASS only if every claim is `SUPPORTED`.
- Any `UNSUPPORTED` or `WRONG/MISLEADING` claim is a FAIL with the exact fix.
- Any `UNVERIFIED-ACCESS` claim is a FAIL whose correction names the blocked source, so the owner can save a copy or the builder can find a readable replacement. Access blockers are recorded as FAILs, never skipped.
- A key claim (numbers, dates, names, mechanisms, causes) that rests only on Wikipedia fails.
- A source that is blocked but not relied on by any claim is acceptable if the report says so.

**Before coding**, the builder opens both linked reports and confirms each has both tables and covers the exact hash. If a report is non-conforming, the card is not coded: the builder notifies the owner which report is missing what, and moves on to other work. The builder never edits or adds rows for the other reviewer. Reviews logged before this rule (15 November 2026) are grandfathered.

### Combined content PRs (owner decision, 15 November 2026)

When several approved cards are waiting to be coded, Claude codes them together in **one** content PR rather than one PR per card. The safeguards:

1. **One commit per card**, so any card can be reverted on its own.
2. **Hash check before and after.** Before applying a card, Claude confirms the approved JSON hashes to the register's Draft Hash and that both reviewer hashes match it; after applying it, Claude confirms the coded entry hashes to the same value. Any mismatch stops that card.
3. **Whole-batch checks.** CI and Codex review the complete PR, and a fresh QA subagent independently checks every card in the batch against the register and the approved Drive JSON, and checks that no other card changed.
4. `VERIFIED` cards (approved with no text change) are not touched.
5. `BLOCKED`, `PENDING` or FAIL cards are excluded until both reviewers pass their exact hash.
6. **Isolate failures.** If one card fails QA, Claude fixes it (a code or docs mistake) or drops it with a revert commit, and the rest of the batch continues. Any fix that would change card text goes back to a new draft version and review, never into the PR.
7. **The owner merges.** Routine corrections (sync errors, test failures, Codex code findings) are handled without asking. The owner taps merge once for the whole batch.

### What blocks a card

- a wrong or misleading claim, or a claim attributed to a source that doesn't say it;
- a claim no opened source supports;
- a dead source, or one paywalled or blocked without an owner copy, when a claim relies on it;
- a key claim supported only by Wikipedia;
- a non-conforming review report.

### History

On 13 November 2026 the four Phase 2 cards that had merged without a recorded fact-check were re-checked in-PR (PR #37). `gps-relativity` and `petrichor` passed; `true-fresco` and `exchequer-tallies` passed after several rounds of fixes. On 14–15 November all 20 original cards went through the register: 17 were approved (13 with fixes, 4 unchanged) and 3 were blocked on source access.

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
- If the verdict is RECOMMEND MERGE and CI is green, it posts the usual "Ready" comment (content PRs may code only register-approved text), adds `ready-to-merge` and notifies the owner.
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
