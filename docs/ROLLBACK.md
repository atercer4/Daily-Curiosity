# Daily Curiosity — Rollback Procedure

Use this when a change that reached production makes the live site worse: a broken page, missing or wrong card content, a failing daily rotation, an accessibility regression, or anything that crosses the privacy rules (an unexpected network call, storage write or tracker). Authority: [STANDING_DIRECTION.md](STANDING_DIRECTION.md) section 9 ("revert or roll back immediately; document the failure; create a corrective task; do not build on the broken state") and section 8 (agents never merge).

Daily Curiosity is a static site with no backend, database or user data, so a rollback never needs a data migration. Restoring the previous files restores the previous product.

## Who does what

| Step | Who |
|---|---|
| 1. Restore the last good deploy on Netlify | Owner (Netlify dashboard) |
| 2. Open a revert pull request | Claude (build agent) or owner |
| 3. Review and merge the revert | Codex reviews; owner taps merge |
| 4. Document the incident | Build agent |
| 5. Open a corrective task | Build agent |

## 1. Restore the last good deploy (minutes)

Netlify keeps every production deploy. Restoring one is instant and does not touch git.

1. Open the site in Netlify and go to **Deploys**.
2. Find the most recent production deploy from before the bad merge. Each deploy lists the commit it was built from; compare it with the merge commit on `main`.
3. Open that deploy and choose **Publish deploy**.
4. Load the live site and confirm Today's Curiosity, Explore More and Surprise Me work again.

The live site is now safe, but `main` still contains the bad change. Netlify may build it again on the next merge, so step 2 is still required. If Netlify shows auto publishing as locked after this step, leave it locked until the revert in step 2 is merged, then unlock it.

## 2. Revert the change in git

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

The revert pull request follows the normal gates in [REVIEW_PROTOCOL.md](REVIEW_PROTOCOL.md): CI green, Codex review, then the owner taps merge. Reverting a content pull request removes the cards it added; that restores an earlier state and does not need a fact-check, but the revert pull request should say which cards it removes.

## 3. Document the failure

Comment on the original pull request, and include in the revert pull request body:

- what broke and how it was noticed;
- when it went live and when it was restored;
- the bad commit and the restored deploy;
- why the tests and review missed it.

The weekly owner digest lists the incident under Quality (STANDING_DIRECTION section 11).

## 4. Open a corrective task

Open a GitHub issue labeled `auto` titled `[DC] Fix: <what broke>`. Its "Done when" must include a regression test that would have caught the failure. The fix is rebuilt from the reverted `main`, not on top of the broken state. If the fix would cross the section 7 escalation list, label the issue `owner-decision` instead.

## What not to do

- Don't push or commit directly to `main`.
- Don't force-push, reset or rewrite history on `main`.
- Don't build new work on top of the broken change while it is live.
- Don't delete Netlify deploys; the deploy history is the safety net.
