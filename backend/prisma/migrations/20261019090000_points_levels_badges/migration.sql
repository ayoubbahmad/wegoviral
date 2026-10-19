-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "access_rules" ADD COLUMN     "minLevel" INTEGER;

-- CreateTable
CREATE TABLE "point_rules" (
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "dailyCap" INTEGER,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "point_rules_pkey" PRIMARY KEY ("action")
);

-- CreateTable
CREATE TABLE "point_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels" (
    "level" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "minPoints" INTEGER NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("level")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#f59e0b',
    "description" TEXT NOT NULL DEFAULT '',
    "autoRule" JSONB,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_badges" (
    "badgeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "awardedById" TEXT,
    "note" TEXT,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_badges_pkey" PRIMARY KEY ("badgeId","userId")
);

-- CreateIndex
CREATE INDEX "point_events_createdAt_idx" ON "point_events"("createdAt");

-- CreateIndex
CREATE INDEX "point_events_userId_action_idx" ON "point_events"("userId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "point_events_userId_action_sourceId_key" ON "point_events"("userId", "action", "sourceId");

-- AddForeignKey
ALTER TABLE "point_events" ADD CONSTRAINT "point_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_badges" ADD CONSTRAINT "member_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_badges" ADD CONSTRAINT "member_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_badges" ADD CONSTRAINT "member_badges_awardedById_fkey" FOREIGN KEY ("awardedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Default point rules (penalties start switched off)
INSERT INTO "point_rules" ("action", "points", "dailyCap", "enabled", "updatedAt") VALUES
  ('POST_PUBLISHED', 5, 25, true, CURRENT_TIMESTAMP),
  ('COMMENT_ADDED', 2, 20, true, CURRENT_TIMESTAMP),
  ('LIKE_RECEIVED', 1, 50, true, CURRENT_TIMESTAMP),
  ('EVENT_JOINED', 3, 9, true, CURRENT_TIMESTAMP),
  ('POST_REVIEWED', 2, 20, true, CURRENT_TIMESTAMP),
  ('GUIDE_ACCEPTED', 10, NULL, true, CURRENT_TIMESTAMP),
  ('POST_REMOVED_BY_TEAM', -10, NULL, false, CURRENT_TIMESTAMP),
  ('VOUCHED_POST_REMOVED', -5, NULL, false, CURRENT_TIMESTAMP),
  ('WARNING_RECEIVED', -20, NULL, false, CURRENT_TIMESTAMP);

-- Default levels (thresholds double, like the ALX example)
INSERT INTO "levels" ("level", "name", "minPoints") VALUES
  (1, 'Rookie', 0), (2, 'Starter', 10), (3, 'Rising', 25), (4, 'Creator', 50), (5, 'Trending', 100),
  (6, 'Influencer', 200), (7, 'Viral', 400), (8, 'Icon', 800), (9, 'Legend', 1600);

-- Starter badges: automatic milestones and two manual ones
INSERT INTO "badges" ("id", "name", "emoji", "color", "description", "autoRule") VALUES
  ('first-post', 'First post', '✍️', '#3b82f6', 'Published a first post', '{"type":"POSTS","threshold":1}'),
  ('regular', 'Regular', '📣', '#8b5cf6', 'Published 10 posts', '{"type":"POSTS","threshold":10}'),
  ('conversationalist', 'Conversationalist', '💬', '#06b6d4', 'Wrote 50 comments', '{"type":"COMMENTS","threshold":50}'),
  ('crowd-favorite', 'Crowd favorite', '❤️', '#ef4444', 'Received 100 likes', '{"type":"LIKES_RECEIVED","threshold":100}'),
  ('event-goer', 'Event goer', '🎟️', '#10b981', 'Joined 5 events', '{"type":"EVENTS_JOINED","threshold":5}'),
  ('rising-star', 'Rising star', '⭐', '#f59e0b', 'Reached 500 points', '{"type":"POINTS","threshold":500}'),
  ('ambassador', 'Ambassador', '🏅', '#f97316', 'Represents WeGoViral', NULL),
  ('member-of-the-month', 'Member of the month', '🏆', '#eab308', 'Chosen by the team', NULL);
