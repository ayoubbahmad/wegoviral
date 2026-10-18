-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "tierId" TEXT;

-- CreateTable
CREATE TABLE "membership_tiers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_rules" (
    "id" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "minRole" "UserRole",
    "tierIds" TEXT[],
    "minDays" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_rules_resourceType_resourceId_key" ON "access_rules"("resourceType", "resourceId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "membership_tiers"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Everyone starts on the free tier
INSERT INTO "membership_tiers" ("id", "name", "description", "position", "isDefault")
VALUES ('free', 'Free', 'Every member', 0, true);
