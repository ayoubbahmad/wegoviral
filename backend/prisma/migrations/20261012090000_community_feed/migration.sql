-- Drop the unmanaged community draft tables that were created outside Prisma
DROP TABLE IF EXISTS "reactions", "comments", "posts", "spaces", "memberships", "membership_tiers", "notifications", "profiles" CASCADE;
DROP TYPE IF EXISTS "MembershipStatus", "NotificationType", "ProfileStatus", "ReactionType", "Role";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MEMBER', 'MODERATOR', 'ADMIN');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "community_spaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "adminOnly" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "coverUrl" TEXT,
    "images" TEXT[],
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_likes" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_post_likes_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "community_bookmarks" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_bookmarks_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "community_poll_options" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "community_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_poll_votes" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_poll_votes_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "community_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "community_posts_deletedAt_pinned_createdAt_idx" ON "community_posts"("deletedAt", "pinned", "createdAt");

-- CreateIndex
CREATE INDEX "community_posts_spaceId_deletedAt_pinned_createdAt_idx" ON "community_posts"("spaceId", "deletedAt", "pinned", "createdAt");

-- CreateIndex
CREATE INDEX "community_bookmarks_userId_createdAt_idx" ON "community_bookmarks"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "community_poll_options_postId_idx" ON "community_poll_options"("postId");

-- CreateIndex
CREATE INDEX "community_comments_postId_createdAt_idx" ON "community_comments"("postId", "createdAt");

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "community_spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_likes" ADD CONSTRAINT "community_post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_bookmarks" ADD CONSTRAINT "community_bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_bookmarks" ADD CONSTRAINT "community_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_poll_options" ADD CONSTRAINT "community_poll_options_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_poll_votes" ADD CONSTRAINT "community_poll_votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_poll_votes" ADD CONSTRAINT "community_poll_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_poll_votes" ADD CONSTRAINT "community_poll_votes_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "community_poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Seed the default spaces
INSERT INTO "community_spaces" ("id", "name", "emoji", "description", "adminOnly", "position") VALUES
  ('announcements', 'Announcements', '📣', 'News and updates from the WeGoViral team.', true, 0),
  ('introductions', 'Introduce Yourself', '👋', 'New here? Tell us who you are, what you create and where.', false, 1),
  ('wins', 'Wins', '🏆', 'Share your milestones, viral moments and small victories.', false, 2),
  ('feedback', 'Feedback', '🎬', 'Post a hook, script or video and get honest feedback.', false, 3),
  ('collabs', 'Collabs', '🤝', 'Find creators to collaborate with.', false, 4),
  ('questions', 'Questions', '💬', 'Ask anything about growth, editing, tools or monetization.', false, 5),
  ('hooks', 'Hooks & Scripts', '✍️', 'Share hooks that worked and workshop your scripts together.', false, 6),
  ('editing', 'Editing', '🎞️', 'Editing workflows, transitions, captions and software tips.', false, 7),
  ('monetization', 'Monetization', '💰', 'Brand deals, creator funds, products and pricing your work.', false, 8),
  ('challenges', 'Challenges', '🔥', 'Join community challenges and post your progress.', false, 9),
  ('gear', 'Tools & Gear', '🎙️', 'Cameras, mics, lighting, apps — what are you using?', false, 10),
  ('offtopic', 'Off-topic', '☕', 'Everything else. Take a break and hang out.', false, 11);
