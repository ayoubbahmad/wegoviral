-- CreateEnum
CREATE TYPE "JoinStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "joinStatus" "JoinStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "quizPassedVersion" INTEGER,
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "referredById" TEXT,
ADD COLUMN     "rulesAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "rulesAcceptedVersion" INTEGER,
ADD COLUMN     "specialMember" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "community_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "requireApproval" BOOLEAN NOT NULL DEFAULT true,
    "requireRules" BOOLEAN NOT NULL DEFAULT true,
    "requireQuiz" BOOLEAN NOT NULL DEFAULT false,
    "quizPassPercent" INTEGER NOT NULL DEFAULT 80,
    "probationPostCount" INTEGER NOT NULL DEFAULT 3,
    "guideVersion" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "platforms" JSONB NOT NULL,
    "followerRange" TEXT,
    "about" TEXT,
    "inviteId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNote" TEXT,

    CONSTRAINT "member_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guide_sections" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guide_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctIndex" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rules_acceptances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rules_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite_links" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "autoApprove" BOOLEAN NOT NULL DEFAULT true,
    "specialMember" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "revokedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_applications_userId_key" ON "member_applications"("userId");

-- CreateIndex
CREATE INDEX "member_applications_submittedAt_idx" ON "member_applications"("submittedAt");

-- CreateIndex
CREATE INDEX "rules_acceptances_userId_acceptedAt_idx" ON "rules_acceptances"("userId", "acceptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "invite_links_code_key" ON "invite_links"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_referralCode_key" ON "UserProfile"("referralCode");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_applications" ADD CONSTRAINT "member_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_applications" ADD CONSTRAINT "member_applications_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_applications" ADD CONSTRAINT "member_applications_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "invite_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rules_acceptances" ADD CONSTRAINT "rules_acceptances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_links" ADD CONSTRAINT "invite_links_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Everyone who joined before onboarding existed is already approved
UPDATE "UserProfile" SET "joinStatus" = 'APPROVED';

-- Default joining rules
INSERT INTO "community_settings" ("id", "updatedAt") VALUES ('default', CURRENT_TIMESTAMP);
