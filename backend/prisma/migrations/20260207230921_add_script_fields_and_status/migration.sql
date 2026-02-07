-- AlterTable
ALTER TABLE "ScriptTemplate" ADD COLUMN     "excerpt" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Draft',
ADD COLUMN     "wordCount" INTEGER DEFAULT 0;
