-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventLocationType" AS ENUM ('ONLINE', 'IN_PERSON');

-- CreateTable
CREATE TABLE "community_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "coverUrl" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "locationType" "EventLocationType" NOT NULL DEFAULT 'ONLINE',
    "location" TEXT,
    "link" TEXT,
    "category" TEXT,
    "capacity" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "recordingUrl" TEXT,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "community_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateIndex
CREATE INDEX "community_events_status_startsAt_idx" ON "community_events"("status", "startsAt");

-- AddForeignKey
ALTER TABLE "community_events" ADD CONSTRAINT "community_events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "community_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

