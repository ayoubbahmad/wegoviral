-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'MUTED', 'SUSPENDED', 'BANNED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'INSTRUCTOR';
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "statusReason" TEXT,
ADD COLUMN     "statusUntil" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "admin_activity" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "targetLabel" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_activity_createdAt_idx" ON "admin_activity"("createdAt");

-- CreateIndex
CREATE INDEX "admin_activity_actorId_createdAt_idx" ON "admin_activity"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_activity_targetType_targetId_idx" ON "admin_activity"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "admin_activity" ADD CONSTRAINT "admin_activity_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

