/**
 * The first set of help center articles (Phase 11), written from the shipped
 * features. `yarn help:seed` adds the ones that don't exist yet; articles the
 * team has edited in the app are never overwritten.
 */
import { HelpSpace, UserRole } from '@prisma/client';

export interface SeedArticle {
  slug: string;
  space: HelpSpace;
  audience?: UserRole;
  category: string;
  title: string;
  summary: string;
  body: string;
}

export const HELP_ARTICLES: SeedArticle[] = [
  // ─── Community: getting started ────────────────────────────────────────────
  {
    slug: 'joining-wegoviral',
    space: 'COMMUNITY',
    category: 'Getting started',
    title: 'How joining works',
    summary: 'From the sign-up form to full member: approval, the guide and your first posts.',
    body: `Joining WeGoViral takes a few short steps, so everyone here is a real creator who knows the house rules.

## The steps
1. **Sign-up form**: your name, phone number, what you create and where. Only the team sees your phone and email.
2. **Approval**: the team reviews your request. While you wait, you can already read the community guide.
3. **Community guide**: read it and tick "I've read and accept". When the guide changes, you'll be asked to accept the new version.
4. **Quiz** (only if the team turned it on): a few questions about the guide. You can retry.
5. **Your first posts**: your first few posts are checked before they go live. See [Your first posts](/community/help/your-first-posts).

## Joined through a friend?
If someone in the community sent you their invite link, you're approved straight away. They're noted as the person who invited you.

## Special members
Guests, instructors and partners can be marked as special members by the team. They skip approval, the guide and the first-post review.`,
  },
  {
    slug: 'community-guide',
    space: 'COMMUNITY',
    category: 'Getting started',
    title: 'The community guide',
    summary: 'Why you accept it, and what happens when it changes.',
    body: `The community guide is our house rules and how we work together. Accepting it is logged with its version and the date.

- You can read it while your request is waiting for approval.
- Until you accept it, you can read the community but not post, comment or react.
- When the team publishes a new version, everyone is asked to accept it again. Nothing else changes in the meantime.`,
  },
  {
    slug: 'your-first-posts',
    space: 'COMMUNITY',
    category: 'Getting started',
    title: 'Your first posts are reviewed',
    summary: 'Why your first posts wait for a quick check, and what you see meanwhile.',
    body: `To keep the timeline great, the first few posts (usually 3) of every new member are checked before they appear.

- Your post shows **Waiting for review** at the top of your timeline. Only you see it.
- Once it's approved, it goes live at the top of the timeline.
- If it isn't approved, you'll see the reviewer's note so you know what to change.
- After enough approved posts, your posts go live straight away.

Reviewers are the team and trusted members: people who finished their own review, have been here for 30+ days and aren't restricted.`,
  },
  {
    slug: 'invite-creators',
    space: 'COMMUNITY',
    category: 'Getting started',
    title: 'Invite other creators',
    summary: 'Your personal invite link, and what it means to vouch for someone.',
    body: `Every approved member has a personal invite link in the **Invite creators** card on the Timeline.

- People who join with your link are **approved automatically**.
- You're shown as the person who invited them, so invite creators you'd vouch for.
- The card shows how many people joined through you.`,
  },

  // ─── Community: posting ────────────────────────────────────────────────────
  {
    slug: 'posting-and-spaces',
    space: 'COMMUNITY',
    category: 'Posting',
    title: 'Posting and spaces',
    summary: 'Write a post with a cover, images or a poll, in the right space.',
    body: `Click **Create post** on the Timeline to share a win, ask a question or start a discussion.

## What a post can have
- A title and text
- A cover image and up to 8 images (5 MB each)
- A poll with several options

## Spaces
Every post lives in a space (Wins, Questions, Introduce yourself…). Use the chips under the Timeline header to see one space only. Some spaces are only for the team, and some open at a level, a tier or after some days in the community: they show a lock and the reason.

## Editing and deleting
You can edit or delete your own posts and comments. When the team edits a post, it's marked "edited by the team".`,
  },
  {
    slug: 'likes-comments-polls',
    space: 'COMMUNITY',
    category: 'Posting',
    title: 'Likes, comments and polls',
    summary: 'How to react, reply and vote.',
    body: `- **Like** a post with the heart. Likes on your posts earn you points (not your own likes).
- **Comment** under any post. Some words are held for the team to check before your comment appears.
- **Vote** in polls once; the results show after you vote.
- **Save** posts with the bookmark to find them later.`,
  },
  {
    slug: 'reporting-content',
    space: 'COMMUNITY',
    category: 'Posting',
    title: 'Reporting a post or comment',
    summary: 'Flag spam, harassment and anything against the guide.',
    body: `Open the **…** menu on a post or comment and choose **Report**. Pick a reason (spam, harassment, hate, adult content, misinformation, self-promotion or something else) and add a note if it helps.

- You can report each item once, and not your own content.
- The team sees reports grouped by post and decides what to do. Reporting is anonymous to the author.
- Even muted members can report.`,
  },
  {
    slug: 'warnings-and-restrictions',
    space: 'COMMUNITY',
    category: 'Posting',
    title: 'Warnings, mutes and suspensions',
    summary: 'What each one means and how long it lasts.',
    body: `When something goes against the guide, the team can:

- **Warn** you: you'll see the message once, next time you open the app.
- **Mute** you: you can read everything but not post, comment or react, until the date shown.
- **Suspend** you: you can't use the community until the date shown.
- **Ban** you: your access is removed.

The reason and the end date are always shown to you. Restrictions end on their own at that date.`,
  },

  // ─── Community: learning & events ──────────────────────────────────────────
  {
    slug: 'events',
    space: 'COMMUNITY',
    category: 'Events, courses & challenges',
    title: 'Events',
    summary: 'Find live sessions, RSVP and add them to your calendar.',
    body: `Community → **Events** lists live sessions, workshops and meetups. Switch between **cards** and **calendar** at the top right, and filter by category.

- Click **I'm going** to RSVP. The live link appears once you're going.
- Add it to **Google Calendar** or download an **.ics** file.
- Times are shown in your time zone.
- After the event, a **Watch the recording** button may appear.
- Some events have limited seats, or open at a level or tier.`,
  },
  {
    slug: 'courses',
    space: 'COMMUNITY',
    category: 'Events, courses & challenges',
    title: 'Taking a course',
    summary: 'Start a course, track your progress and earn your graduate badge.',
    body: `Community → **Courses** has trainings and playbooks from the community's instructors.

- Open a course and click **Start the course**. You'll always find **Continue where you left off** at the top of the Courses page.
- Watch the video or read the lesson, download the resources, then click **Mark complete & continue**.
- Some modules open a few days after you start (the outline shows when).
- Each lesson gives you points, finishing the course gives more and the 🎓 **Course graduate** badge.
- Locked courses show what you need to open them, e.g. a level.`,
  },
  {
    slug: 'challenges',
    space: 'COMMUNITY',
    category: 'Events, courses & challenges',
    title: 'Challenges, check-ins and streaks',
    summary: 'Join a challenge, check in every day and keep your streak alive.',
    body: `Community → **Challenges** lists what's happening now, what's coming up and past challenges.

## Taking part
1. Open a challenge and click **Join the challenge**.
2. Each day, **check in** with what you did, plus an image or link if you like. One-time challenges need a single submission.
3. Your 🔥 **streak** grows with each day in a row. Miss a day and it starts again (your best streak is kept).

Days follow the challenge's time zone, shown at the bottom of the challenge.

## Finishing and winning
- Reach the number of check-ins shown to **finish**: you get points and the 🔥 Challenge finisher badge.
- When it ends, the team picks the **winners** (often the top of the challenge leaderboard). Winners get extra points and the 🏆 Challenge winner badge.`,
  },

  // ─── Community: points ─────────────────────────────────────────────────────
  {
    slug: 'points-levels-badges',
    space: 'COMMUNITY',
    category: 'Points & badges',
    title: 'Points, levels and badges',
    summary: 'How you earn points, what levels unlock, and how to get badges.',
    body: `You earn points for taking part: posting, commenting, getting likes, joining events, completing lessons and checking in to challenges. Some actions have a daily limit, and taking an action back (deleting a post, unliking) takes its points back too.

The exact numbers are in **Leaderboard → How do points work?**

## Levels
Your level comes from your total points, from Rookie up to Legend. Some spaces, events, courses and challenges open at a level, and show how many points you still need.

## Badges
Up to three of your latest badges show next to your name. Some come automatically (first post, course graduate, challenge finisher…), others are given by the team (like Ambassador or Member of the month).`,
  },
  {
    slug: 'leaderboard',
    space: 'COMMUNITY',
    category: 'Points & badges',
    title: 'The leaderboard',
    summary: 'Last 7 days, last 30 days and all time.',
    body: `Community → **Leaderboard** ranks members by the points they earned in the last 7 days, the last 30 days or all time. Your card at the side shows your level, your progress to the next one and your rank in the period.

Members with the same points share a rank.`,
  },

  // ─── Community: instructors ────────────────────────────────────────────────
  {
    slug: 'creating-a-course',
    space: 'COMMUNITY',
    audience: 'INSTRUCTOR',
    category: 'For instructors',
    title: 'Creating a course',
    summary: 'Build modules and lessons, add resources, release modules over time and publish.',
    body: `Go to Community → **Courses** → **New course**. It starts as a draft only you and the admins can see.

## Content tab
- Add **modules** (chapters), then **lessons** in each.
- A lesson is a **video** (YouTube, Vimeo, Loom or a video file link) or **text**, with notes and resources (files up to 50 MB, or links). Files stay private to members who can open the course.
- **Drag** modules and lessons to reorder them, also between modules.
- Set **Opens … days after a member starts** on a module to release it over time.

## Details & access
Title, description, cover, an optional badge for finishing, and who can take the course (level, days in the community; tiers are set by Super Admins).

## Publish
Set the status to **Published** (a course needs at least one lesson). **Archived** hides it from the catalogue but keeps it for members who started.

## Stats
The **Stats** tab shows who started and finished, the completion rate and how many completed each lesson.`,
  },
  {
    slug: 'hosting-events',
    space: 'COMMUNITY',
    audience: 'INSTRUCTOR',
    category: 'For instructors',
    title: 'Hosting an event',
    summary: 'Create, publish and run an event, and see who is coming.',
    body: `Click **New event** on the Events page.

- Enter the times in your own time zone: members see them in theirs.
- Add the live link: it's only shown to members who are going.
- Set a capacity if seats are limited, and who can attend.
- Save as a draft, then **Publish** when ready.
- From the event, see the **attendees** and export them as CSV.
- After the event, add the **recording link**.`,
  },

  // ─── Creator Space ─────────────────────────────────────────────────────────
  {
    slug: 'creator-space',
    space: 'CREATOR',
    category: 'Getting started',
    title: 'What is the Creator Space?',
    summary: 'Your personal tools for planning, writing and tracking your content.',
    body: `The Creator Space is yours alone: nothing here is shared with the community. Switch to it from the menu on the logo at the top of the sidebar.

It brings together tools to plan your content, write scripts, organise projects and follow your numbers. Some tools are still being connected to your social accounts; until then they show sample data.`,
  },
  {
    slug: 'scripts-and-projects',
    space: 'CREATOR',
    category: 'Tools',
    title: 'Scripts and projects',
    summary: 'Write scripts from hooks and templates, and group your work into projects.',
    body: `- **Scripts**: write video scripts, starting from hooks and templates in the **Library**.
- **Projects**: group videos and scripts for a campaign or series, and track where each piece is.
- **Library**: saved hooks and script templates to reuse.`,
  },
  {
    slug: 'performance-and-followers',
    space: 'CREATOR',
    category: 'Tools',
    title: 'Performance, followers and competitors',
    summary: 'Follow how your content does and what others in your niche post.',
    body: `- **Performance**: views and engagement per post, and your best times to post.
- **Followers**: how your audience grows.
- **Competitors**: keep an eye on creators in your niche.
- **Automations**: Instagram and Facebook automations are coming; the screens show what they'll do.

Connect your accounts in **Settings** as they become available.`,
  },

  // ─── Admin: everyone on the team ───────────────────────────────────────────
  {
    slug: 'admin-space',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Getting started',
    title: 'The Admin space and team roles',
    summary: 'What each role can do, and where to find things.',
    body: `The Admin space is for the team. Open it from the menu on the logo. You only see the pages your role allows.

## Roles
- **Moderator**: handles reports and held content, approves new members, mutes or suspends for up to 7 days, runs challenges, sees members, stats and the activity log.
- **Instructor**: creates courses and events, and manages their own.
- **Admin**: everything moderators do, plus bans, roles (up to moderator), spaces, onboarding, invite links, points and badges, and the help center.
- **Super Admin**: everything, including appointing admins and deciding what each tier unlocks.

You can only act on members ranked below you, and nobody can change their own role.

## Overview
**Overview** shows what needs attention: pending approvals, posts waiting for review, open reports and held content.`,
  },
  {
    slug: 'approving-members',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Members',
    title: 'Approving new members',
    summary: 'Read sign-up answers and approve or reject requests.',
    body: `Admin → **Approvals** lists people waiting, with their sign-up answers (niche, platforms, follower range), who invited them and their contact details.

- **Approve** to let them in, or **reject** with an optional message they'll see.
- Every decision goes to the activity log.
- Members who joined through a member's invite link are approved automatically. Staff invite links can also approve automatically.`,
  },
  {
    slug: 'member-panel',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Members',
    title: 'The member panel',
    summary: 'Everything about a member, and the actions you can take.',
    body: `Click a member in Admin → **Members** to open their panel: activity counts, joining status (guide version accepted, probation, who invited them), points and badges, and their history.

Depending on your role you can change their role, mark them as a special member, warn, mute, suspend or ban them, change their tier, give badges and adjust points.`,
  },
  {
    slug: 'restricting-members',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Members',
    title: 'Warning, muting and suspending',
    summary: 'Pick the lightest step that works, with a clear reason.',
    body: `From the member panel:

1. **Warn** first: the member sees your message once.
2. **Mute** if it continues: they can still read, but not post or react.
3. **Suspend** for serious or repeated issues: they can't use the community.
4. **Ban** (admins only) when someone shouldn't come back.

Moderators can mute or suspend for up to **7 days**; admins can choose any length or no end date. Always write the reason: the member sees it, and it's kept in the log.`,
  },
  {
    slug: 'handling-reports',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Moderation',
    title: 'Handling reports and held content',
    summary: 'Dismiss, remove, and act on the author in one step.',
    body: `Admin → **Moderation** groups open reports by post or comment, with every reason and note.

- **Dismiss** if it's fine: the reports close and the content stays.
- **Remove** the content, and optionally warn, mute or suspend the author at the same time.
- **Held by filter** shows posts and comments stopped by the flagged-words filter: release or remove them.
- **Recently deleted** lets you restore something removed by mistake.
- The **filter** tab is where admins manage the flagged words.

All of it is recorded in the activity log.`,
  },
  {
    slug: 'reviewing-posts',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Moderation',
    title: "Reviewing new members' posts",
    summary: 'Approve or refuse first posts, with a note for the author.',
    body: `Community → **Review posts** lists posts from new members waiting for a check, oldest first.

- **Approve** to put the post live at the top of the timeline.
- **Refuse** with a short, kind note: the author sees it and can try again.
- Your name is saved with the post. If a post you approved is removed later, it shows in your history.

Trusted members can review too.`,
  },
  {
    slug: 'running-challenges',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Content',
    title: 'Running a challenge',
    summary: 'Create a challenge, keep check-ins clean and pick the winners.',
    body: `Click **New challenge** on Community → Challenges.

- Choose **daily** check-ins (with how many are needed to finish) or a **one-time** submission.
- Add the rules, the prizes, a cover and who can take part. Save as a draft, then publish.
- Remove check-ins that break the rules from the feed: the member loses those points, and it's logged.
- When it ends, open the challenge and **pick the winners**: take the top of the leaderboard or choose by hand, in order. You can change or clear them later.`,
  },
  {
    slug: 'stats',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Insights',
    title: 'Reading the stats',
    summary: 'Members, engagement and content over 30 days, 90 days or 12 months.',
    body: `Admin → **Stats** has three tabs (four for Super Admins):

- **Members**: active today/week/month, sign-ups and active members over time, the joining funnel and retention by sign-up month.
- **Engagement**: posts, comments and likes over time, by space, top contributors and the best times to post.
- **Content**: how courses, events and challenges perform.

"Active" means the member posted, commented, liked, voted, RSVPed, completed a lesson or checked in. Times follow your time zone. Every table has a **CSV** button.`,
  },
  {
    slug: 'activity-log',
    space: 'ADMIN',
    audience: 'MODERATOR',
    category: 'Insights',
    title: 'The activity log',
    summary: 'Who did what, and when.',
    body: `Admin → **Activity log** records every team action: approvals, restrictions, role changes, deleted or restored content, settings, events, courses, challenges, badges and more. Filter it by type.`,
  },

  // ─── Admin: admins ─────────────────────────────────────────────────────────
  {
    slug: 'spaces',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Community setup',
    title: 'Managing spaces',
    summary: 'Create, reorder, archive and lock spaces.',
    body: `Admin → **Spaces**: create spaces with an emoji, a description and a cover, drag them into order, make some **team-only**, or archive the ones you don't need.

Open a space to set **who can open it**: a minimum role, days in the community or a level. Super Admins can also limit it to tiers. Members who don't match see the space with a lock and the reason.`,
  },
  {
    slug: 'onboarding-settings',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Community setup',
    title: 'Onboarding, the guide and the quiz',
    summary: 'Turn approval, the guide and the quiz on or off, and publish a new guide.',
    body: `Admin → **Onboarding**:

- Switch on or off: **require approval**, **require accepting the guide**, **require the quiz**.
- Set how many first posts are **reviewed** (default 3).
- Edit the **community guide** as sections (text, image or video). **Publishing** creates a new version that everyone has to accept again, so publish when it really changes.
- Write the **quiz** questions and the pass mark.

The **flagged words** that hold posts and comments for review are in Admin → Moderation.`,
  },
  {
    slug: 'invite-links',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Community setup',
    title: 'Staff invite links',
    summary: 'Links for campaigns, with an expiry and a maximum number of uses.',
    body: `Admin → **Invite links** creates links such as "Instagram followers, 7 days, first 100".

- Choose whether people who use it are **approved automatically** and/or become **special members**.
- Set an **expiry date** and a **maximum number of uses**.
- Turn a link off at any time.`,
  },
  {
    slug: 'points-and-badges-admin',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Community setup',
    title: 'Points, levels and badges',
    summary: 'Tune point rules and caps, rename levels, and create badges.',
    body: `Admin → **Points & badges**:

- **Point rules**: points per action and daily caps. Penalties (negative points) are off until you switch them on. Changes apply to new actions only.
- **Levels**: names and thresholds. The first starts at 0 points.
- **Badges**: emoji, colour and description. Automatic badges are given at a milestone, and to everyone who already qualifies when you create one. Others are given by hand from the member panel, with an optional note.

You can also **adjust a member's points** from their panel, with a reason.`,
  },
  {
    slug: 'roles',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Members',
    title: 'Changing roles',
    summary: 'Promote instructors and moderators.',
    body: `From the member panel, change a member's role. Admins can set Member, Instructor or Moderator; only Super Admins can appoint admins and other Super Admins. The last Super Admin can't be demoted, and nobody can change their own role.`,
  },
  {
    slug: 'editing-help',
    space: 'ADMIN',
    audience: 'ADMIN',
    category: 'Community setup',
    title: 'Editing the help center',
    summary: 'Write, publish and order help articles for each space and audience.',
    body: `Admin → **Help articles**: pick a space, then create or edit articles.

- **Audience**: the lowest role that sees the article (e.g. Moderator = moderators, admins and Super Admins).
- **Section**: the heading it's listed under.
- The body supports simple formatting: \`## Heading\`, lists with \`-\` or \`1.\`, \`**bold**\` and \`[links](https://…)\`.
- Drafts are only visible to admins. Use the arrows to change the order.
- Pick the language at the top of the editor to write the French or Arabic version; a field left empty shows the English text.`,
  },

  // ─── Admin: Super Admins ───────────────────────────────────────────────────
  {
    slug: 'tiers-and-access',
    space: 'ADMIN',
    audience: 'SUPER_ADMIN',
    category: 'Membership',
    title: 'Tiers and what they unlock',
    summary: 'Create tiers, assign members and limit content to tiers.',
    body: `Admin → **Tiers** (Super Admins only): create tiers like Free and Pro, pick the default tier, and rename or delete them.

- Limit **spaces, events, courses and challenges** to some tiers from their access settings. Only Super Admins can change tier conditions.
- Until payments are connected, assign tiers by hand in the member panel. With Stripe (coming later), paid plans will set them automatically.`,
  },
];
