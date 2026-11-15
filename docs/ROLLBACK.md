# Daily Curiosity — Rollback Procedure

Use this when a change that reached production makes the live site worse: a broken page, missing or wrong card content, a failing daily rotation, an accessibility regression, or anything that crosses the privacy rules (an unexpected network call, storage write or tracker). Authority: [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 9 ("revert or roll back immediately; document the failure; create a corrective task; do not build on the broken state") and section 8 (agents never merge).

Daily Curiosity is a static site with no backend, database or user data, so a rollback never needs a data migration. Restoring the previous files restores the previous product.

## Who does what

| Step | Who |
|---|---|
| 1. Open a revert pull request | Claude (build agent) or owner |
| 2. Review and merge the revert | Codex reviews; owner taps merge |
| 3. Document the incident | Build agent |
| 4. Open a corrective task | Build agent |

## 1. Restore the live site: revert and merge (minutes)

The site is hosted on GitHub Pages, which publishes `main` directly (since 15 November 2026; Netlify before that). Pages keeps no older deploys to republish, so the fastest way back to the last good state is to revert the bad change on `main`. Pages republishes within a few minutes of the merge.

The revert pull request goes through the normal gates (CI green, then Codex review, then the owner taps merge); both usually finish within a few minutes.

After the merge, check the **Actions** tab for the "pages build and deployment" run to finish. Then load https://atercer4.github.io/Daily-Curiosity/ and confirm Today's Curiosity, Explore More and Surprise Me work again.

**Emergency only:** if the live site is harmful while the revert is still in review (for example, a privacy breach), the owner can take the site offline under Settings → Pages → **Unpublish site**, then publish again after the revert.

## 2. How to open the revert

Undo the change with a new commit, through a normal pull request. Never rewrite history.

- On GitHub, open the merged pull request and use its **Revert** button. That opens a new branch and pull request that undoes it.
- Or, from a local clone, on a new branch from `origin/main`:

  ```
  git checkout -b revert-<pr#> origin/main
  git revert -m 1 <merge-commit-sha>
  node --check SRC/app.js && node --check SRC/content.js && node --check SRC/daily.js
  node tests/prototype.test.cjs
  ```

  Push the branch and open a pull request titled `Revert #<pr#>: <reason>`.

The revert pull request follows the normal gates in [REVIEW_PROTOCOL.md](REVIEW_PROTOCOL.md) (CI green, Codex review, then the owner taps merge). Reverting a content pull request removes the cards it added; that restores an earlier state and does not need a fact-check, but the revert pull request should say which cards it removes.

## 3. Document the failure

Comment on the original pull request, and include in the revert pull request body:

- what broke and how it was noticed;
- when it went live and when it was restored;
- the bad commit and the revert commit;
- why the tests and review missed it.

The weekly owner digest lists the incident under Quality (STANDING_DIRECTION section 11).

## 4. Open a corrective task

Open a GitHub issue labeled `auto` titled `[DC] Fix: <what broke>`. Its "Done when" must include a regression test that would have caught the failure. The fix is rebuilt from the reverted `main`, not on top of the broken state. If the fix would cross the section 7 escalation list, label the issue `owner-decision` instead.

## What not to do

- Don't push or commit directly to `main`.
- Don't force-push, reset or rewrite history on `main`.
- Don't build new work on top of the broken change while it is live.
- Don't change the GitHub Pages source branch to work around a bad change; revert it on `main`.
