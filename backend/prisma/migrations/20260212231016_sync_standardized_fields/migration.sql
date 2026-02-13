/*
  Warnings:

  - Added the required column `externalUrl` to the `Competitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Competitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "commentReplyEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "commentReplyMessage" TEXT,
ADD COLUMN     "instagramPostId" TEXT,
ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastRunAt" TIMESTAMP(3),
ADD COLUMN     "runCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN     "externalUrl" TEXT NOT NULL,
ADD COLUMN     "originUrl" TEXT,
ADD COLUMN     "platform" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hook" ADD COLUMN     "sourceMetadata" JSONB,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ScriptTemplate" ADD COLUMN     "sourceMetadata" JSONB,
ADD COLUMN     "sourceUrl" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Script" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "excerpt" TEXT,
    "wordCount" INTEGER DEFAULT 0,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Script_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitorToWatchlist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompetitorToWatchlist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_name_key" ON "Watchlist"("userId", "name");

-- CreateIndex
CREATE INDEX "_CompetitorToWatchlist_B_index" ON "_CompetitorToWatchlist"("B");

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ScriptTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Script" ADD CONSTRAINT "Script_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorToWatchlist" ADD CONSTRAINT "_CompetitorToWatchlist_A_fkey" FOREIGN KEY ("A") REFERENCES "Competitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorToWatchlist" ADD CONSTRAINT "_CompetitorToWatchlist_B_fkey" FOREIGN KEY ("B") REFERENCES "Watchlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
