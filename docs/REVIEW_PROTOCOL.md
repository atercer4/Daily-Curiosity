# Daily Curiosity — Review Protocol

Daily Curiosity runs autonomously. The founder gets a weekly digest and escalations, not a merge request for every change. Full direction: *Daily Curiosity — Standing Direction* (Google Doc in 01_Project_Bible).

## Roles
| Who | Does |
|---|---|
| Gemini | Scouts topics into Drive `02_Research_Inbox` (Mon/Wed/Fri) |
| Claude | Picks topics, builds cards and code, opens PRs |
| Codex | Reviews code PRs (`@codex review`) |
| ChatGPT | Fact-checks new cards, writes the weekly digest |

## Rules
1. Every change goes through a pull request. Nothing is pushed straight to `main`.
2. The builder never reviews its own PR.
3. Reviews cite `file:line` and end with one verdict: **RECOMMEND MERGE**, **CHANGES REQUESTED**, or **FOUNDER DECISION NEEDED**.
4. A PR may be merged without the founder when CI is green **and** an independent reviewer said RECOMMEND MERGE **and** it touches none of the founder-only items below.
5. Founder-only items (label `founder-gate`, never auto-merged): changes to the product premise or categories, removal of cards, analytics/tracking/accounts/storage, any network call or third-party asset, paid services, domain or Netlify settings, license changes, and anything a reviewer marks FOUNDER DECISION NEEDED.
6. Never commit secrets, `.env` files, keys, or the old `snapshots/` folders. Git history is the archive.
7. `tests/baseline/` pins the original 20 cards and `SRC/daily.js`. Changing a pin is allowed only when the PR says why, and the reviewer confirms it.
