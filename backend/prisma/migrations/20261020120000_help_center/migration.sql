-- CreateEnum
CREATE TYPE "HelpSpace" AS ENUM ('COMMUNITY', 'CREATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "help_articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "space" "HelpSpace" NOT NULL,
    "audience" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "help_articles_slug_key" ON "help_articles"("slug");

-- CreateIndex
CREATE INDEX "help_articles_space_published_position_idx" ON "help_articles"("space", "published", "position");

-- AddForeignKey
ALTER TABLE "help_articles" ADD CONSTRAINT "help_articles_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

