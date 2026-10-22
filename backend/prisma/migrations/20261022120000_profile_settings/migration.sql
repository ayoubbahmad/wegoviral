-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "deletionRequestedAt" TIMESTAMP(3),
ADD COLUMN     "niche" TEXT,
ADD COLUMN     "preferences" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "showBadges" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showOnLeaderboard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showSocialLinks" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "socialLinks" JSONB NOT NULL DEFAULT '[]';

