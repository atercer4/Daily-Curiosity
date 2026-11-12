# Daily Curiosity — Review Protocol

Daily Curiosity runs autonomously. The founder gets a weekly digest and escalations, not a merge request for every change. Full direction: *Daily Curiosity — Standing Direction* (Google Doc in 01_Project_Bible).

## Roles
| Who | Does |
|---|---|
| Gemini | Scouts topics into Drive `02_Research_Inbox` (Mon/Wed/Fri) |
| Claude | Picks topics, builds cards and code, opens PRs |
| Codex | Reviews every PR (`@codex review`) |
| ChatGPT | Fact-checks new cards, writes the weekly digest |

## Rules
1. Every change goes through a pull request. Nothing is pushed straight to `main`.
2. The builder never reviews its own PR. Claude builds; Codex reviews code; ChatGPT fact-checks content.
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
6. **Content PRs** (label `content`, any new or edited card) also need ChatGPT's fact-check. ChatGPT opens every cited source and confirms it supports the specific claim. A dead, paywalled-without-summary or weak source blocks the card. ChatGPT reports PASS or FAIL to the owner, who merges only on PASS.
7. Never commit secrets, `.env` files, keys, or the old `snapshots/` folders. Git history is the archive.
8. `tests/baseline/` pins the original 20 cards and `SRC/daily.js`. A pin may change only when the PR says why (for example, to make room for new cards) and the reviewer confirms that existing card text is unchanged.

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
- If the verdict is RECOMMEND MERGE and CI is green, it posts the usual "Ready" comment (content PRs still wait for ChatGPT's fact-check), adds `ready-to-merge` and notifies the owner.
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
