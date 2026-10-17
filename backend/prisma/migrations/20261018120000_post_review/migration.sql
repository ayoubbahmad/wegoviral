-- CreateEnum
CREATE TYPE "PostReviewStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "probationCompletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "community_posts" ADD COLUMN     "reviewNote" TEXT,
ADD COLUMN     "reviewStatus" "PostReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT;

-- CreateIndex
CREATE INDEX "community_posts_reviewStatus_createdAt_idx" ON "community_posts"("reviewStatus", "createdAt");

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Members who are already approved never go through probation
UPDATE "UserProfile" SET "probationCompletedAt" = CURRENT_TIMESTAMP WHERE "joinStatus" = 'APPROVED';
