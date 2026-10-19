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
- ✅ **Branch workflow**: one branch per item, PR to `main` with a checklist template. Vercel posts a preview URL per PR (uses the production backend).
  - Railway PR environments stay **off**: with a shared database, a PR's migration would hit production before merge. Backend changes are tested locally instead.
- ✅ **Automated checks on each PR** (GitHub Actions): frontend typecheck, lint of changed files, build; backend typecheck, build, and "migrations match the schema".
  - *Verified:* CI passed on `main` after the merge.
- ✅ **API test suite** in the repo (`yarn test:api`, 25 tests for auth and the feed), run locally before merging; cleans up after itself.
- ✅ **Demo data script** (`yarn demo:seed` / `yarn demo:clear`): 6 members, 11 posts with covers, images, a poll, likes and comments. Clearing leaves real data untouched. Events and courses get added to it in their own phases.

## Before launch (do not skip)

- ⬜ **Separate development database**: new Supabase project for development and testing, Railway `staging` environment, Vercel previews pointing to it, and local `backend/.env` switched to it (remove the duplicate `DATABASE_URL`).
  - *Accept:* creating a post on staging or locally doesn't show up in production, and the reverse.
- ⬜ **Run the API test suite in CI** against staging (needs the separate database).
- ⬜ **Clear demo/test data** from production (`yarn demo:clear`).

## Phase 1 — Roles, Admin space & members

Shipped; **acceptance pending** (Ayoub). Covered by 17 automated admin tests.

- ✅ **Roles**: `SUPER_ADMIN` and `INSTRUCTOR` added; existing admins became Super Admins.
  - *Accept:* the permission table above holds for every endpoint (automated checks per role).
- ✅ **Permission system**: one list in `backend/src/lib/permissions.ts`; `/auth/me` returns each user's permissions and the frontend's `useCan()` hides what they can't use. Role and status are re-read on every request, so changes apply immediately.
- ✅ **Admin space**: 🛡️ Admin in the space switcher (staff only), Overview / Members / Activity log, route guard.
  - *Accept:* members never see the entry; typing `/admin` as a member redirects away.
- ✅ **Members list**: search (name, username, email), filters (role, status), sorting, pagination; filters are kept in the URL. *Tier and join-date filters come with Phase 4/9.*
- ✅ **Member profile panel**: details, join date, posts/comments/likes, role, status and history. Points, level and badges since Phase 6.
- ✅ **Change roles**, following the permission table and safety rules (no self-changes, only manage lower ranks, last Super Admin protected).
  - *Accept:* an Admin can't create another Admin; a Super Admin can; nobody can demote themselves.
- ✅ **Mute / suspend / ban** with a reason and duration, enforced by the API. Moderators: mute or suspend for up to **7 days**; only admins ban, lift bans or restrict indefinitely. Suspended/banned members see a notice with the reason; muted members see a banner and can only read.
  - *Accept:* a muted member can read but every post/comment/react call returns 403 with a clear message; the restriction lifts automatically when it expires.
- ✅ **Activity log**: role changes, restrictions, and staff deleting/pinning content, with actor and time; filter by type.
- ✅ **Overview page (basic)**: members, new and active this week, posts and comments this week, team breakdown, restricted members, newest members. *Pending approvals and open reports arrive with Phases 2 and 3.*

## Phase 2 — New member onboarding

The journey (agreed 2026-10-17):

```
Sign up → Sign-up form → Pending approval → Approved → Probation → Full member
          name, phone,   can already read   reminded if  first 3 posts   courses/spaces unlock
          what & where   the guide and      rules aren't reviewed before by level or time (Phase 4)
          they create    accept the rules   accepted yet they go live
```

### 2a — Joining

Shipped; **acceptance pending** (Ayoub). 15 automated onboarding tests (57 in total).

- ✅ **Community settings**: toggles for "require approval", "require accepting the guide" and "require passing the quiz"; number of reviewed posts during probation (default 3).
- ✅ **Sign-up form**: full name, phone (**required**), what they create (niche) and where (platforms + handles, follower range). Shown to staff in the approval queue; phone and email are visible to staff only.
- ✅ **Pending state**: until approved, a member sees a "your request is being reviewed" screen and can read the community guide, but not the community.
- ✅ **Approval queue** (Admin → Approvals): sign-up answers, referrer, approve or reject with an optional message; every decision is logged.
- ✅ **Community guide**: staff write the rules and policy as ordered sections (text, image or video), with a version number.
- ✅ **Rules acceptance, logged**: "I've read and accept" is stored with the guide version and date. Members who are approved without having accepted are reminded and can't interact until they do; when the guide changes (new version), everyone is asked to accept again.
  - *Accept:* the member panel shows when and which version each member accepted.
- ✅ **Quiz (optional, off by default)**: a few multiple-choice questions after the guide with a pass mark; retries allowed. Correct answers never leave the server.
- ✅ **Exemptions / special members**: staff can mark someone as a special member (instructor, guest, successful creator…) who skips approval, the guide and probation. Badges can be given to them since Phase 6.
- ✅ **Invite links (staff)**: a link that can auto-approve and/or grant special-member exemptions, with an expiry date and maximum uses, e.g. "Instagram followers, 7 days, first 100".
- ✅ **Referral links (members)**: every approved member has a personal link; new members who join through it are **approved automatically**, marked "referred by @member", and the referrer is recorded as responsible for them.
- ⬜ **Welcome**: once a member can interact, prompt a first post in Introduce Yourself.

### 2b — Probation & post review

Shipped; **acceptance pending** (Ayoub). 11 automated review tests (68 in total).

- ✅ **Reviewed first posts**: a new member's posts wait for review until N of them (default 3) have been approved; the author sees "waiting for review" (or the reviewer's note if refused). Members who joined before review existed, special members and staff skip it. Approved posts go live at the top of the feed.
- ✅ **Review queue** (Community → Review posts): staff and trusted members approve or reject waiting posts (with a note for the author); the reviewer's name is stored with the post. The admin overview shows how many are waiting.
- ✅ **Peer reviewers**: staff, plus trusted members (finished their own probation, in the community for 30+ days, not restricted). Never their own posts.
- ✅ **Responsibility trail**: a referrer's and reviewer's history shows when someone they vouched for, or a post they approved, was removed or restricted. *Recorded; point penalties are available since Phase 6 (off by default). Losing review/referral rights stays manual.*

## Phase 3 — Moderation & spaces

Shipped; **acceptance pending** (Ayoub). 17 automated moderation tests (85 in total).

- ✅ **Report button** on posts and comments (reason + optional note), once per member per item; members can't report their own content. Still available to muted members.
- ✅ **Moderation queue** (Admin → Moderation): open reports grouped per post/comment with reasons and reporters; "Nothing wrong" (dismiss) or remove, optionally also **warning**, muting or suspending the author (moderators' 7-day limit applies). Resolutions are kept and logged.
- ✅ **Warnings**: the member sees the warning the next time they open the app and confirms they read it. Staff can also send one from the member panel.
- ✅ **Editing**: authors edit their own posts and comments; staff can edit anyone's, shown as "edited by the team" and logged. (Images and polls aren't editable.)
- ✅ **Recently deleted**: posts and comments deleted in the last 30 days, with who deleted them; staff can restore them.
- ✅ **Spaces management** (Admin → Spaces): create, edit (name, emoji, description, cover image link), reorder, archive and bring back; "only the team can post" switch. Archived spaces disappear from the feed filters and close to new posts; their posts stay.
- ⬜ **Space access rules** (uses Phase 4): e.g. a paid-only space, or one unlocked at Level 5.
- ✅ **Flagged words list** (Admin → Moderation → Word filter): matching posts and comments are held for the team only (not peer reviewers); whole words, case and accents ignored; staff aren't filtered.

## Phase 4 — Access rules engine

One shared system used by spaces now, and by courses, events and challenges in their phases.

Shipped; **acceptance pending** (Ayoub). 10 automated access tests.

- ✅ **Rule types**: minimum role, tiers, minimum days in the community (counted from sign-up). Conditions combine (all must match); staff always have access. Minimum level was added with Phase 6. *"Onboarding complete" is already enforced for everyone by Phase 2.*
- ✅ **Locked state UI**: locked spaces stay in the chips with a 🔒; opening one explains why, e.g. "Unlocks in 12 days (on …)", "For Pro members", "Only for instructors and the team".
- ✅ **Enforced on the API**: posts in a locked space are never sent (filtered from the feed, Top posts and the review queue; likes, comments, votes and reports answer "not found"); posting there is refused. Authors keep access to their own posts.
- ✅ **Tiers & manual assignment** (Super Admin): Admin → Tiers (create, rename, default, delete); tier picker in the member panel until Stripe (Phase 9). Only Super Admins decide which tiers can open something; admins set role and time conditions in Admin → Spaces.
  - *Accept:* the same space shows as locked to a 10-day-old member and unlocked to a 40-day-old one with a 30-day rule. *(Automated test passes.)*

## Phase 5 — Events

Shipped; **acceptance pending** (Ayoub). 12 automated event tests.

- ✅ **Events CRUD**: title, description, cover, start/end (entered in the host's time zone, shown in each member's), online or in person, live link, category, capacity, draft/published/cancelled. Moderators and above manage every event; instructors create and manage their own.
- ✅ **RSVP** with capacity; the live link only shows to members who are going (and the host/staff). Attendee list for the host and staff, with CSV export. "Add to calendar": Google Calendar and .ics.
- ✅ **Access rules** per event (Phase 4): locked events show the basics and why; RSVPs are refused. Hosts set role/time conditions; tiers stay with Super Admins.
- ✅ **Recording link** added after the event ("Watch the recording"); turning it into a course stays manual.
- ✅ **Member-facing**: category chips + **cards / calendar switch** (calendar: month navigation, today highlighted, past days and past/cancelled events greyed, drafts dashed); upcoming/past in cards view; shareable event links (`?event=…`); the feed's Upcoming events card uses real data. Mock events removed; demo data includes events.

## Phase 6 — Points, levels & badges

Shipped; **acceptance pending** (Ayoub). 16 automated gamification tests.

- ✅ **Point rules** (Admin → Points & badges): points per action with optional daily caps. Defaults: post +5 (25/day), comment +2 (20/day), like received +1 (50/day), event RSVP +3 (9/day), reviewing a new member's post +2 (20/day), accepting the guide +10 once. Every action is one ledger row, so it never scores twice and is taken back when undone (deleted post or comment, unlike, cancelled RSVP). *Lessons and challenges add their rules in Phases 7 and 8.*
- ✅ **Penalties (off by default)**: post removed by the team −10, a post you approved in review being removed −5, warning −20. Admins switch them on in the point rules; restoring a post undoes them. *This is the optional consequence for the Phase 2b responsibility trail.*
- ✅ **Levels**: 9 named levels (Rookie 0 → Starter 10 → Rising 25 → Creator 50 → Trending 100 → Influencer 200 → Viral 400 → Icon 800 → Legend 1600), editable by admins.
- ✅ **Level locks**: spaces and events can require a minimum level (completes the Phase 4 rule types); locked members see "Reach Level N (Name): X more points to go".
- ✅ **Real leaderboard**: 7 days / 30 days / all time (periods count points earned in that time), top 3 podium, your level card with progress, the level ladder, and a "How do points work?" explainer. Mock data removed.
- ✅ **Badges CRUD**: name, emoji, colour, description; archive/restore. Up to 3 recent badges show next to names in posts, comments and the leaderboard.
- ✅ **Manual awarding** from the member panel (with an optional team-only note), plus manual point adjustments with a reason; both go to the activity log.
- ✅ **Automatic badges**: milestones on posts, comments, likes received, events joined or total points (seeded: First post, Regular, Conversationalist, Crowd favorite, Event-goer, Rising star; manual: Ambassador, Member of the month). New automatic badges go to everyone who already qualifies. *Streaks and "course graduate" come with Phases 7–8.*
- ✅ **Backfill**: `yarn points:backfill` credited activity from before points existed (keeping the original dates; safe to re-run).

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

## Phase 11 — Help center & documentation (last)

In-app documentation of how WeGoViral works, written for each audience (requested 2026-10-18).

- ⬜ **Help in every space**: a "Help" entry in the sidebar of each space (Community, Creator Space, Admin) opens the docs for *that* space only.
- ⬜ **Role-aware articles**: each article has a space and an audience (everyone, instructors, moderators, admins, Super Admins); members only see what applies to their role, staff also see the staff guides (e.g. how to handle reports).
- ⬜ **First set of articles** written from the shipped features: joining and the guide, posting and review, reporting, spaces, events, courses, points and badges, Creator Space tools; staff guides for every admin page.
- ⬜ **Search** across the articles you can see, and links from relevant screens ("How does review work?").
- ⬜ **Editable by admins** (create, edit, reorder, publish), so the docs stay current without a code change.
  - *Accept:* a member in the Community space sees only member-level Community articles; a moderator also sees the moderation guides; in the Creator Space, only Creator Space articles show.

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
2. ~~Community guide format~~ — rules and policy, plus an optional quiz (off by default).
3. ~~Order of gates~~ — sign-up form → approval (guide readable while waiting, acceptance logged) → probation.
4. **Moderator suspensions**: maximum length? *Set to 7 days for now (`MODERATOR_MAX_RESTRICTION_DAYS`).*
5. **Instructors**: can they see the members enrolled in their courses (names/emails), or only numbers?
6. **Stripe**: account details, currency, test-mode keys, and whether existing subscribers need migrating.
