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
