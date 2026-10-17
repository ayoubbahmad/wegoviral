# WeGoViral – Admin & Community Management Roadmap

How we build the admin side of the community, one feature at a time.

## How we ship each item

Every item moves through the same five steps. An item ships only when all five boxes are ticked.

| Step | Who | What "done" means |
|---|---|---|
| **Build** | Claude | Code, migration and API written; type check, lint and build pass |
| **Review** | Ayoub | Code reviewed (diff or PR) |
| **Test** | Claude + Ayoub | Automated API checks pass (production DB until launch, then staging); the acceptance criteria below are tried by hand |
| **Accept** | Ayoub (+ founders for big items) | Behaves as expected; feedback addressed |
| **Ship** | Claude | Merged to `main`, deployed, migration applied, smoke-tested in production |

Status legend: ⬜ not started · 🟨 in progress · 🟦 in review/testing · ✅ shipped

---

## Decisions so far

- **Roles:** Super Admin, Admin, Moderator, Instructor, Member (table below).
- **Admin lives in a third space** in the logo switcher (🛡️ Admin), visible to staff only. Quick actions (pin, delete…) stay inline in the feed.
- **Payments:** Stripe (already set up; details to come).
- **Free and paid tiers:** the Super Admin decides what each tier can access (spaces, courses, events, challenges…).
- **New members:** optionally must finish a **community guide** before posting or interacting, and/or wait for **admin approval**. Both are toggles, and admins can exempt individual members.
- **Unlock rules** can combine: tier, level, and **time in the community** (e.g. "member for at least 30 days").
- **Event recordings** are turned into course lessons **manually**, never automatically.

## Roles & permissions

| Permission | Super Admin | Admin | Moderator | Instructor | Member |
|---|:-:|:-:|:-:|:-:|:-:|
| Post, comment, react (once onboarded) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Report posts/comments | ✅ | ✅ | ✅ | ✅ | ✅ |
| Handle reports, edit/delete any post or comment, pin | ✅ | ✅ | ✅ | ❌ | ❌ |
| Suspend / mute members | ✅ | ✅ | ✅ (temporary only) | ❌ | ❌ |
| Approve new members, exempt from guide | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create/edit events | ✅ | ✅ | ✅ | Own events | ❌ |
| Create/edit courses | ✅ | ✅ | ❌ | Own courses | ❌ |
| Challenges | ✅ | ✅ | ✅ | ❌ | ❌ |
| Spaces, badges, point rules, community guide | ✅ | ✅ | ❌ | ❌ | ❌ |
| Ban / delete members | ✅ | ✅ | ❌ | ❌ | ❌ |
| Set roles up to Moderator / Instructor | ✅ | ✅ | ❌ | ❌ | ❌ |
| Set Admin / Super Admin roles | ✅ | ❌ | ❌ | ❌ | ❌ |
| Plans, paywalls, coupons, revenue stats | ✅ | ❌ | ❌ | ❌ | ❌ |
| Community stats (non-revenue) | ✅ | ✅ | ✅ | Own content | ❌ |

Safety rules: nobody can change their own role, and the last Super Admin can't be demoted or removed.

---

## Phase 0 — Shipping foundations

Until launch, development and testing use the **production database** (the community isn't live yet). Test data created by automated checks is always cleaned up. How it all fits together: [DEPLOYMENT.md](DEPLOYMENT.md).

- ✅ **Railway deploy settings**: build, pre-deploy migrations (`yarn migrate:deploy`), start, `/health` check and restart-on-failure are set on the service. Railway's `railway.json` is deprecated and was being ignored, so it's removed.
  - *Verified:* a fresh deploy's manifest shows the pre-deploy command and health check.
- 🟦 **Branch workflow**: one branch per item, PR to `main` with a checklist template. Vercel posts a preview URL per PR (uses the production backend).
  - Railway PR environments stay **off**: with a shared database, a PR's migration would hit production before merge. Backend changes are tested locally instead.
- 🟦 **Automated checks on each PR** (GitHub Actions): frontend typecheck, lint of changed files, build; backend typecheck, build, and "migrations match the schema".
  - *Accept:* the checks run on this PR and pass.
- 🟦 **API test suite** in the repo (`yarn test:api`, 25 tests for auth and the feed), run locally before merging; cleans up after itself.
- 🟦 **Demo data script** (`yarn demo:seed` / `yarn demo:clear`): 6 members, 11 posts with covers, images, a poll, likes and comments. Clearing leaves real data untouched. Events and courses get added to it in their own phases.

## Before launch (do not skip)

- ⬜ **Separate development database**: new Supabase project for development and testing, Railway `staging` environment, Vercel previews pointing to it, and local `backend/.env` switched to it (remove the duplicate `DATABASE_URL`).
  - *Accept:* creating a post on staging or locally doesn't show up in production, and the reverse.
- ⬜ **Run the API test suite in CI** against staging (needs the separate database).
- ⬜ **Clear demo/test data** from production (`yarn demo:clear`).

## Phase 1 — Roles, Admin space & members

- ⬜ **Roles**: add `SUPER_ADMIN` and `INSTRUCTOR`; make the current admin a Super Admin.
  - *Accept:* the permission table above holds for every endpoint (automated checks per role).
- ⬜ **Permission system**: one shared `can(user, action, resource?)` check on the backend, mirrored in a frontend hook that hides buttons the user can't use.
- ⬜ **Admin space**: 🛡️ Admin entry in the space switcher, own sidebar, and route guard.
  - *Accept:* members never see the entry; typing `/admin` as a member redirects away.
- ⬜ **Members list**: search, filters (role, tier, status, join date), sorting, pagination.
- ⬜ **Member profile panel**: details, join date, activity counts, role, badges, status history.
- ⬜ **Change roles**, following the permission table and safety rules.
  - *Accept:* an Admin can't create another Admin; a Super Admin can; nobody can demote themselves.
- ⬜ **Suspend / mute / ban** with a reason and duration (moderators: temporary only). Enforced by the API, not just hidden in the UI.
  - *Accept:* a muted member can read but every post/comment/react call returns 403 with a clear message; the restriction lifts automatically when it expires.
- ⬜ **Activity log**: who did what and when (role changes, suspensions, deletions, approvals…), filterable.
- ⬜ **Overview page (basic)**: total members, new this week, posts this week, pending approvals, open reports.

## Phase 2 — New member onboarding

- ⬜ **Community settings**: toggles for "require community guide" and "require admin approval".
- ⬜ **Community guide builder**: admin writes the guide as ordered steps (text, image or video, optional "I agree" checkbox or short quiz).
- ⬜ **Guide gate**: until a member finishes the guide, they can read but not post, comment, react or vote. A progress banner shows how much is left.
  - *Accept:* the API refuses interactions until the guide is complete, and finishing it unlocks them instantly.
- ⬜ **Approval queue**: new members wait as "pending"; staff approve or reject with an optional message.
- ⬜ **Application questions** (optional) shown at sign-up, e.g. "What do you create? Which platforms?", visible in the approval queue.
- ⬜ **Exemptions**: staff can mark a member as "skip guide" and/or pre-approve them.
- ⬜ **Invite links / codes**: optionally pre-approved, with expiry and usage limits.
- ⬜ **Welcome**: auto-follow Introduce Yourself and prompt a first post once onboarding is done.

## Phase 3 — Moderation & spaces

- ⬜ **Report button** on posts and comments (reason + note).
- ⬜ **Moderation queue**: open reports grouped by post/comment, actions (dismiss, delete, warn author, suspend author), resolution recorded in the activity log.
- ⬜ **Edit any post or comment** (staff), with an "edited by the team" mark.
- ⬜ **Recently deleted**: restore within 30 days.
- ⬜ **Spaces management**: create, edit (name, emoji, description, cover), reorder, archive; who can post (everyone / staff only).
- ⬜ **Space access rules** (uses Phase 4): e.g. a paid-only space, or one unlocked at Level 5.
- ⬜ **First-post approval** (optional setting): new members' first post waits for staff approval.
- ⬜ **Flagged words list**: matching posts/comments are held for review.

## Phase 4 — Access rules engine

One shared system used by spaces, courses, events and challenges.

- ⬜ **Rule types**: role, tier (free/paid plans), minimum level, minimum time in the community (days since joining), onboarding complete. Rules can be combined (all must match).
- ⬜ **Locked state UI**: locked items stay visible with a clear reason, e.g. "Unlocks in 12 days", "Reach Level 5", "Paid members only — Upgrade".
- ⬜ **Enforced on the API** (locked content is never sent to the browser).
- ⬜ **Manual tier assignment** for testing until Stripe is connected in Phase 9.
  - *Accept:* the same course shows as locked to a 10-day-old member and unlocked to a 40-day-old one with a 30-day rule.

## Phase 5 — Events

- ⬜ **Events CRUD**: title, description, cover, start/end, timezone, location or live link, category, capacity; draft/published; instructors manage their own.
- ⬜ **RSVP** and attendee list (export CSV); "Add to calendar" (Google / .ics).
- ⬜ **Access rules** per event (e.g. paid members only).
- ⬜ **Recording link** added after the event (manual; can later be attached to a course by hand).
- ⬜ **Member-facing**: real Upcoming events card, list and calendar views, category chips (replaces the mock data).

## Phase 6 — Points, levels & badges

- ⬜ **Point rules**: admin sets points per action (post, comment, received like, event attended, lesson completed, challenge finished…), with daily caps to avoid farming.
- ⬜ **Levels**: names and thresholds (e.g. Rookie → Rising → Viral → Legend), editable by admins.
- ⬜ **Real leaderboard**: 7 days / 30 days / all time (replaces the mock data).
- ⬜ **Badges CRUD**: name, icon/emoji, colour, description.
- ⬜ **Manual awarding**: e.g. Ambassador, Member of the month, with an optional note; shown on profiles and next to names.
- ⬜ **Automatic badges**: rules such as "first post", "10 wins posted", "30-day streak", "course graduate".

## Phase 7 — Courses

- ⬜ **Course builder**: course → modules → lessons (video, text, attachments); drag to reorder; draft/published.
- ⬜ **Instructor ownership**: instructors create and edit only their own courses; admins can edit all.
- ⬜ **Access rules** (tier, level, time in community) per course, with optional per-module drip release.
- ⬜ **Member experience**: course catalogue, lesson player, progress tracking, "continue where you left off".
- ⬜ **Completion**: points and an optional automatic badge.
- ⬜ **Course stats**: enrolments, completion rate, drop-off per lesson (instructors see their own).

## Phase 8 — Challenges

- ⬜ **Challenges CRUD**: title, rules, start/end dates, daily or one-time check-ins, prizes, access rules.
- ⬜ **Participation**: join, submit check-ins (text/image/link), progress and streaks.
- ⬜ **Challenge leaderboard** and winners chosen manually or by points.
- ⬜ **Points and badges** for completion (from Phase 6).

## Phase 9 — Monetization (Stripe) · Super Admin only

- ⬜ **Connect Stripe**: keys on Railway, webhook endpoint, test mode first.
- ⬜ **Plans / tiers**: create plans (monthly/yearly prices) synced with Stripe products and prices.
- ⬜ **Paywalls**: choose which spaces, courses, events and challenges each plan unlocks (uses Phase 4 rules).
- ⬜ **Checkout and billing**: upgrade flow, Stripe Customer Portal (change card, cancel), receipts.
- ⬜ **Webhooks**: subscription created/updated/cancelled/payment failed keep each member's tier in sync.
  - *Accept:* a test card upgrade unlocks paid content within seconds; cancelling at period end removes it on that date.
- ⬜ **Coupons**: percentage/amount off, duration, expiry, usage limit, limited to certain plans (Stripe promotion codes).
- ⬜ **Revenue stats**: monthly recurring revenue, active subscribers, churn, coupon usage, free→paid conversion.

## Phase 10 — Stats dashboard

- ⬜ **Members**: sign-ups over time, daily/weekly/monthly active members, retention by sign-up month, approval/onboarding funnel.
- ⬜ **Engagement**: posts, comments and reactions per day and per space; top contributors; best posting times.
- ⬜ **Content**: course and event performance, challenge participation.
- ⬜ **Revenue** (Super Admin): links to Phase 9 stats.
- ⬜ **Export** any table as CSV.

---

## Backlog (member-facing, from the earlier feature list)

- ⬜ Notifications (mentions, replies, level-ups, new events/challenges) and email digests
- ⬜ Announcement broadcast to all members or a segment; scheduled posts
- ⬜ Global search (⌘K): posts, comments, members, events, courses
- ⬜ Direct messages (collab deals)
- ⬜ Bookmarks page (posts, comments, events, lessons)
- ⬜ Creator profiles: niche, platforms, follower range, level and badges; member directory with filters
- ⬜ "Share from Creator Space": attach a video, script or stats card to a post
- ⬜ Post types (Win, Question, Feedback request, Collab)
- ⬜ Right-column cards: this week's challenge, your rank
- ⬜ Space chips overflow fix (arrows, wrapping or "More")
- ⬜ Copy-link opens and scrolls to the post
- ⬜ Course quizzes and completion certificates

## Open questions

1. **Super Admins**: who are they (the founders)? Can there be several?
2. **Community guide format**: read-only steps, or a short quiz members must pass?
3. **Order of gates**: approval first, then the guide? Or the guide while waiting for approval?
4. **Moderator suspensions**: maximum length (e.g. 7 days)?
5. **Instructors**: can they see the members enrolled in their courses (names/emails), or only numbers?
6. **Stripe**: account details, currency, test-mode keys, and whether existing subscribers need migrating.
