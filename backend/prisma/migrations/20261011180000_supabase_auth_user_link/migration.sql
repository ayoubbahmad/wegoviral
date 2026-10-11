-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN "authUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_authUserId_key" ON "UserProfile"("authUserId");
