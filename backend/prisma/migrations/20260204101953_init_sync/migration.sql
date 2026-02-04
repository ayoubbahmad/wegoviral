/*
  Warnings:

  - You are about to drop the column `clerkId` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passwordHash` to the `UserProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserProfile_clerkId_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "clerkId",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ScriptTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hookId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScriptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPost" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "thumbnailUrl" TEXT,
    "caption" TEXT,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "metrics" JSONB NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "hookId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "segment" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follower_socialAccountId_handle_key" ON "Follower"("socialAccountId", "handle");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_email_key" ON "UserProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_username_key" ON "UserProfile"("username");

-- AddForeignKey
ALTER TABLE "ScriptTemplate" ADD CONSTRAINT "ScriptTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptTemplate" ADD CONSTRAINT "ScriptTemplate_hookId_fkey" FOREIGN KEY ("hookId") REFERENCES "Hook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_hookId_fkey" FOREIGN KEY ("hookId") REFERENCES "Hook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "SocialAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Follower"("id") ON DELETE CASCADE ON UPDATE CASCADE;
