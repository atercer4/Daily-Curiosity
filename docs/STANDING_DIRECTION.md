<!-- Copy of the Google Doc "Daily Curiosity — Autonomous Product Roadmap & Standing Direction v1.0" (Drive: 01_Project_Bible). The Drive doc is the authority; this copy lets agents read it from the repo. -->

# Daily Curiosity — Autonomous Product Roadmap & Standing Direction
Version 1.0 · 9 November 2026 · Owner-approved direction
Drafted by ChatGPT (PM role), reviewed by Claude, approved by the owner. This document is the standing authority for autonomous work on Daily Curiosity. Agents act within it without owner approval; anything outside it escalates.
## Owner decisions (9 November 2026)
Autonomy: ordinary Daily Curiosity work no longer requires owner review or decisions. The owner's involvement is a weekly digest, genuine escalations, and a one-tap merge of pull requests that agents have already brought to "ready" (see the amendment in section 8). (Arbor keeps founder merge approval.)
Repository: GitHub becomes the implementation source of truth, as a public repository, so GitHub branch protection can enforce the merge gates. Google Drive remains the governance and documentation source.
Stack: plain static web app (HTML/CSS/JavaScript). No framework, backend, accounts, database or paid APIs. Current working copy lives in Dropbox (Projects\Daily Curiosity) and will move to GitHub.
Hosting: Netlify, connected to GitHub: deploy previews for every pull request, production deploy on merge, Netlify deploy history as the rollback safety net.
## 1. Product purpose
Daily Curiosity is a lightweight web experience designed to make people meaningfully more curious about the world.
Core promise: One curious idea a day. Explore only as deeply as you want.
The product should feel calm, intelligent, approachable and rewarding without feeling like school, homework or an endless content feed. The editorial idea is to begin with something observable or surprising and help the reader look beneath it to understand the process, mechanism, context, practice or evidence behind it.
## 2. Current product model
Interaction model: Hook → Core Insight → Deep Dive & Sources → Optional Recall.
Today's Curiosity, Explore More and Surprise Me
Categories: Science & Nature; Engineering & Technology; Arts & Culture; History & Society
A rotating daily curiosity and a curated library of sourced cards
Optional, low-pressure recall after the Deep Dive
Today and Explore are intentionally independent. The experience requires no account or persistent state.
## 3. Audience
People who enjoy learning interesting things but don't necessarily want long articles or a formal learning product: curious general readers, people who like fun facts but want substance, people with limited time, casual lifelong learners, and readers intimidated by dense educational material. It must stay understandable without specialist knowledge.
## 4. Editorial principles
Go deeper in meaning, not in difficulty. More depth produces more understanding, not more complicated prose.
Curiosity before instruction. It should feel like discovering, not completing a lesson.
A visual must earn its space. Use one only when it explains better than prose; never just to decorate.
Categories create different kinds of curiosity:
Science & Nature: How does this natural process happen?
Engineering & Technology: How does this system work, and what constraints or tradeoffs make it possible?
Arts & Culture: What practices, materials, techniques or traditions sit behind the finished thing?
History & Society: What does surviving evidence or an institutional arrangement reveal about how people lived or organized society?
Consistent house voice: always reward the reader for looking beneath the surface of an ordinary or surprising thing.
## 5. Product principles
Daily Curiosity stays simple, fast, lightweight, mobile-friendly, accessible, sourced, calm and curiosity-driven.
It must not become a social network, a gamified education platform, a news feed, an SEO content farm, a quiz app, a streak-driven habit tracker, an AI chatbot, or a personalized algorithmic feed. New features must improve curiosity, understanding, return behavior or product sustainability.
## 5a. Intended user experience (owner, 10 November 2026)
What a visitor should experience. Agents use this as the target when choosing and judging work.
Discovery-driven exploration: readers follow their curiosity rather than a fixed lesson path.
An interactive website: the core experience lives on the web, free and with no account.
A mobile app only after the web experience has been validated.
An optional reminder or a preview of the next discovery. A preview that collects nothing can be built autonomously; reminders by email or push notification collect visitor data and must escalate to the owner.
Easy sharing of surprising discoveries through share links and good social previews. Comments, profiles or feeds count as social features and escalate.
Encouraging people to keep exploring beyond the single daily idea.
## 5b. Design System 1.0 (owner, 12 November 2026)
The owner approved a visual redesign: "Direction F", a modern field journal and cabinet of curiosities. The full specification is [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), which agents follow for all visual work.
- Today opens on a dark, category-themed cover that leads with a question. Explore becomes "the cabinet of curiosities", a grid of tiles with a "?" Surprise Me tile.
- The structure stays fixed; only the cover background and the drawing language change by category.
- Approved within this decision, so these no longer escalate:
  - self-hosting the two open-licence fonts (Playfair Display, Source Sans 3);
  - optional per-card `question` and `tease` fields;
  - original line-drawn figures, numbers strips and occasional interactives, under the rules in DESIGN_SYSTEM.md;
  - turning Explore into the cabinet grid.
- Interactive only when interaction teaches something materially better than prose or a static visual.
- Every new line of copy (questions, teases, figure labels, numbers) is fact-checked like card text.
- Still escalates: real or public-domain images, accounts, bookmarks or any saved state, and anything else on the section 7 list.
- Priority: Design System 1.0 comes before further Phase 2 cards. New cards pause until the cover and the cabinet ship (DESIGN_SYSTEM.md section 6), then resume.

## 6. Roadmap
### Phase 1 — Feature freeze and public-product readiness (current, near completion)
Finish the established web experience and create a stable baseline agents can safely improve: complete v7 final polish; fix the known accessibility/heading issue; resolve approved wording cleanup; final responsive and accessibility QA; verify static deployment; preserve all regression tests; final release notes; GitHub as source of truth; automated CI; Netlify deploy previews; production deployment workflow; rollback procedure.
Exit: Daily Curiosity is declared feature-complete for the current product cycle.
### Phase 2 — Autonomous content expansion
Expand the library without changing the core product. Agents may research topics, propose and write cards (Hook/Core/Deep Dive/Recall), source claims, independently review accuracy, check reading difficulty and category identity, test sources, and add cards that meet the standard. Quality over volume: never publish to hit a number.
Milestones: 40 → 75 → 100 high-quality cards, then evaluate whether further expansion remains valuable. No filler.
### Phase 3 — Daily experience improvement
Small, reversible, evidence-backed improvements to typography, readability, spacing, responsive behavior, accessibility, source presentation, recall wording, category balance, content discovery, performance, metadata, sharing presentation and static-site reliability. Prefer small changes with clear rationale; large architectural or conceptual changes escalate.
### Phase 4 — Distribution and discoverability
Research and prepare search metadata, Open Graph/social previews, shareable curiosity pages, lightweight SEO, structured data, sharing experiments, newsletter feasibility, social repurposing and organic distribution. Must never degrade reading or turn the product into an SEO content farm. (A newsletter that collects email addresses is an escalation.)
### Phase 5 — Monetization experiments
Possible experiments: premium themed collections (Space, Strange Science, Ancient Civilizations, Engineering Wonders, Art & Making, Japan, Nature); tasteful sponsorship that never controls editorial conclusions; education products (classroom packs, discussion prompts, curated collections); membership only after evidence of regular return. Never paywall the basic daily curiosity prematurely. All monetization decisions escalate.
### Phase 6 — Mobile productization (optional)
Only once the web product has proven its value: PWA, lightweight packaged web app or Capacitor-style wrapper; native only if native functionality becomes necessary. No complex mobile rewrite just to have an app.
## 7. Autonomous development rules
Agents may act without owner approval when the change is:
reversible; within this roadmap; free or covered by existing infrastructure; not collecting user data; not altering the core purpose; covered by tests; independently reviewed.
Examples: bug fixes, accessibility, responsive layout, high-quality sourced content, documentation, refactoring without behavior change, tests, performance, minor editorial improvements, metadata, deploy reliability.
Must escalate to the owner before:
changing the core purpose; accounts or logins; collecting personal information; analytics or visitor tracking; advertising technology; payments or subscriptions; spending money; registering a domain; paid APIs or services; a backend or database; substantial redesign; social or community features; algorithmic personalization; changing monetization strategy; deleting major functionality; irreversible infrastructure decisions.
## 8. Merge policy
Amended 10 November 2026: the agent environment blocks agents from merging pull requests ("merge without review"). That is intentional, so agents never merge. A PR becomes "ready" for the owner's one-tap merge only when:
- automated checks pass;
- regression tests pass;
- the builder is not the reviewer (builder ≠ reviewer: if Codex builds, Claude reviews; if Claude builds, Codex reviews);
- the independent reviewer reports no Critical or Major issues;
- the change is within this roadmap and the autonomy boundaries;
- for content PRs (any new or edited card), ChatGPT's fact-check reports PASS.

The builder never approves its own work. A Major or Critical finding, or a fact-check FAIL, blocks merge. Minor issues may merge only if they don't materially affect accessibility, factual accuracy, security, privacy or core functionality. On the public repository, GitHub branch protection enforces that required checks pass before any merge. The owner's tap is a lightweight confirmation, not a review; the review is done by the agents above.
## 9. Deployment policy
Every pull request gets a Netlify deploy preview where practical. Production deploys only after the merge gates pass. If a production regression is detected: revert or roll back immediately; document the failure; create a corrective task; do not build on the broken state.
## 10. Agent roles
Product manager / orchestrator: maintains roadmap, priorities, task selection, scope, status, governance and escalations, and normally selects the next highest-value task without owner approval.
Builder: implements one bounded task at a time and never broadens scope.
Independent reviewer: checks requirements, regression risk, accessibility, factual and editorial integrity, test coverage and scope; doesn't rewrite the product to suit its own preferences.
Research / editorial agent: topics, fact verification, source quality, competitive, distribution and monetization research, when needed. Gemini runs scheduled topic scouting into the Drive Research Inbox; ChatGPT is the independent fact-checker for content because it can open cited sources.
## 11. Weekly owner digest
Instead of reviews, the owner receives one weekly summary (merging stays a one-tap action on ready PRs): Shipped (what went live), Quality (tests, QA, incidents, rollbacks), Content (new cards, significant editorial changes), Current work, Next, and Escalations (only decisions crossing the boundaries). The owner may redirect priorities at any time.
## 12. Definition of "better"
Does it make the experience more interesting?
Does it make something easier to understand?
Does it improve content quality?
Does it make the site easier or more pleasant to use?
Does it give people a stronger reason to return?
Does it improve reliability, accessibility or maintainability?
Does it help the product reach users or eventually sustain itself?
If a change does none of these, it probably shouldn't be built.
## 13. Long-term direction
Daily Curiosity should gradually evolve from a small curated prototype into a trusted library and daily discovery product. The goal isn't to maximize features; it's to build a system that repeatedly produces small moments of genuine curiosity that are worth coming back for, while remaining recognizably Daily Curiosity as its library, audience and business grow.
## 14. Operating additions (Claude review, owner-approved)
Who selects tasks in the automated loop. The scheduled build agent acts as product manager for day-to-day work: it reads this document, opens its own next issue from the current phase (labeled auto), builds it and requests independent review. ChatGPT keeps the roadmap current and writes the weekly digest.
Stricter checks for new content, since the owner doesn't review it before tapping merge. Every new or edited card requires: a writer and a different fact-checking agent; the reviewer opens every cited source and confirms it supports the specific claim; any dead, paywalled-without-summary or weak source blocks the card; reading level and category identity are checked against section 4.
Escalations are visible. Anything crossing section 7's escalation list becomes a GitHub issue labeled owner-decision plus a push notification, and work on it stops until the owner answers.
Builder availability. Codex cannot currently start tasks from GitHub mentions (reported bug), so Claude builds and Codex reviews until that is fixed; then builder ≠ reviewer applies in either direction.
Gemini research desk (owner-approved 10 November 2026). Gemini's scheduled research saves candidate topics to Drive (Daily Curiosity / 02_Research_Inbox): the surprising thing, the mechanism behind it, its category and 2–3 strong sources. The build agent picks the best candidate that fits this document and writes the card; ChatGPT, which can open the cited sources on the web, independently fact-checks every card; Codex reviews code. So each card is researched, written and verified by different AIs before it can merge. If the inbox is empty, the build agent may research topics itself, but the fact-checker must still be a different agent.
## 15. Setup checklist (owner's laptop session, about 1 hour)
Copy the code from Dropbox (Projects\Daily Curiosity) into C:\Users\16263\Projects\daily-curiosity. Don't keep a git repository inside Dropbox.
Run the secrets check, make the first commit, create the public GitHub repository atercer4/daily-curiosity, and push.
Netlify: link the site to the GitHub repository, with no build command and the publish directory set to the folder containing index.html. Confirm deploy previews are on.
Give the Claude and ChatGPT Codex Connector GitHub apps access to the new repository.
Claude then adds this direction to the repository, along with CI and regression checks, the review protocol and branch protection, and sets up the autonomous build task and the weekly digest.
