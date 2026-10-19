-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CheckInType" AS ENUM ('DAILY', 'ONE_TIME');

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "rules" TEXT NOT NULL DEFAULT '',
    "prizes" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "checkInType" "CheckInType" NOT NULL DEFAULT 'DAILY',
    "requiredCheckIns" INTEGER,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "completionBadgeId" TEXT,
    "winnerBadgeId" TEXT,
    "winnersPickedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participants" (
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkInCount" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "bestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastCheckInAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "winnerRank" INTEGER,

    CONSTRAINT "challenge_participants_pkey" PRIMARY KEY ("challengeId","userId")
);

-- CreateTable
CREATE TABLE "challenge_check_ins" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "deletedById" TEXT,

    CONSTRAINT "challenge_check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "challenges_status_startsAt_idx" ON "challenges"("status", "startsAt");

-- CreateIndex
CREATE INDEX "challenge_participants_challengeId_checkInCount_idx" ON "challenge_participants"("challengeId", "checkInCount");

-- CreateIndex
CREATE INDEX "challenge_check_ins_challengeId_createdAt_idx" ON "challenge_check_ins"("challengeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_check_ins_challengeId_userId_day_key" ON "challenge_check_ins"("challengeId", "userId", "day");

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_completionBadgeId_fkey" FOREIGN KEY ("completionBadgeId") REFERENCES "badges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_winnerBadgeId_fkey" FOREIGN KEY ("winnerBadgeId") REFERENCES "badges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_check_ins" ADD CONSTRAINT "challenge_check_ins_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_check_ins" ADD CONSTRAINT "challenge_check_ins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Points for challenges, and badges for finishing and winning
INSERT INTO "point_rules" ("action", "points", "dailyCap", "enabled", "updatedAt") VALUES
  ('CHALLENGE_CHECKIN', 3, 9, true, NOW()),
  ('CHALLENGE_COMPLETED', 30, NULL, true, NOW()),
  ('CHALLENGE_WON', 100, NULL, true, NOW())
ON CONFLICT ("action") DO NOTHING;

INSERT INTO "badges" ("id", "name", "emoji", "color", "description", "autoRule") VALUES
  ('challenge-finisher', 'Challenge finisher', '🔥', '#ef4444', 'Finished a challenge', '{"type":"CHALLENGES_COMPLETED","threshold":1}'),
  ('challenge-winner', 'Challenge winner', '🏆', '#eab308', 'Won a community challenge', '{"type":"CHALLENGES_WON","threshold":1}')
ON CONFLICT ("id") DO NOTHING;
