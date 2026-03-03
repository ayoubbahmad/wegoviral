/*
  Warnings:

  - A unique constraint covering the columns `[competitorId,externalUrl]` on the table `CompetitorPost` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('GENERAL', 'CASE_STUDY', 'CONTENT_SERIES', 'COLLABORATIVE');

-- AlterTable
ALTER TABLE "Competitor" ADD COLUMN     "creatorId" TEXT;

-- AlterTable
ALTER TABLE "CompetitorPost" ADD COLUMN     "externalUrl" TEXT;

-- CreateTable
CREATE TABLE "Creator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'GENERAL',
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "metadata" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "status" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_name_key" ON "Creator"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitorPost_competitorId_externalUrl_key" ON "CompetitorPost"("competitorId", "externalUrl");

-- AddForeignKey
ALTER TABLE "Competitor" ADD CONSTRAINT "Competitor_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creator" ADD CONSTRAINT "Creator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectItem" ADD CONSTRAINT "ProjectItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
