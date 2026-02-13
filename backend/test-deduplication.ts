import { competitorsService } from './src/features/competitors/service';
import { prisma } from './src/lib/prisma';

async function testDeduplication() {
  const userId = 'e82b7d9f-940a-4614-a6d0-61ca2279ebcb'; // Use an existing user ID

  // 1. Find or create a competitor
  let competitor = await prisma.competitor.findFirst({
    where: { userId },
  });

  if (!competitor) {
    console.log('No competitor found, creating test one...');
    competitor = await competitorsService.createCompetitor(userId, {
      handle: 'test_creator',
      name: 'Test Creator',
      platform: 'tiktok',
      externalUrl: 'https://www.tiktok.com/@mrbeast',
    });
  }

  if (!competitor) throw new Error('Failed to obtain competitor');

  const comp = competitor;
  console.log(`Using competitor: ${comp.handle} (${comp.id})`);

  // 2. Sync once
  console.log('Syncing videos (Run 1)...');
  const posts1 = await competitorsService.syncCompetitorVideos(comp.id, userId);
  console.log(`Run 1 synchronized ${posts1.length} videos.`);

  // 3. Sync again immediately
  console.log('Syncing videos (Run 2 - should be 0 new)...');
  const posts2 = await competitorsService.syncCompetitorVideos(comp.id, userId);

  const totalPosts = await prisma.competitorPost.count({
    where: { competitorId: comp.id },
  });

  console.log(`Total posts in DB for this competitor: ${totalPosts}`);

  // 4. Verify unique constraint
  try {
    const firstPost = await prisma.competitorPost.findFirst({
      where: { competitorId: comp.id },
    });
    if (firstPost && firstPost.externalUrl) {
      console.log(
        `Attempting manual duplicate insertion for ${firstPost.externalUrl}...`,
      );
      await prisma.competitorPost.create({
        data: {
          competitorId: comp.id,
          externalUrl: firstPost.externalUrl,
          thumbnailUrl: 'dup',
          captionExcerpt: 'dup',
          postedAt: new Date(),
          metrics: {},
        },
      });
      console.error(
        '❌ Error: Manual duplicate insertion SUCCEEDED. Unique constraint is NOT working!',
      );
    } else {
      console.log('No posts found with externalUrl to test duplicates.');
    }
  } catch (e: any) {
    if (e.code === 'P2002') {
      console.log(
        '✅ Success: Duplicate insertion failed with P2002 (Unique constraint violation).',
      );
    } else {
      console.error(
        '❌ Error: Unexpected error during duplicate insertion:',
        e,
      );
    }
  }
}

testDeduplication()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
