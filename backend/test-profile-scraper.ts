import { scrapeProfileFeed } from './src/lib/scraper';
import path from 'path';

async function testProfileScraper() {
  const profiles = [
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/@MrBeast', // logic uses local dump if present
    },
    {
      platform: 'TikTok',
      url: 'https://www.tiktok.com/@mrbeast', // logic uses local dump if present
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/mrbeast', // logic uses local dump if present
    },
  ];

  // Parse CLI args for platform filtering
  const args = process.argv.slice(2);
  const platformArg = args
    .find((arg) => arg.startsWith('--platform='))
    ?.split('=')[1]
    ?.toLowerCase();

  for (const profile of profiles) {
    if (platformArg && profile.platform.toLowerCase() !== platformArg) {
      continue;
    }

    console.log(`\n--- Testing ${profile.platform} Profile Scraper ---`);
    try {
      console.log(`Target URL: ${profile.url}`);
      const videos = await scrapeProfileFeed(profile.url, 200);
      console.log(`Found ${videos.length} videos:`);
      videos.forEach((v, i) => {
        console.log(
          `[${i + 1}] ${v.title} (${v.views || 'N/A'})\n    URL: ${v.url}\n    Thumb: ${v.thumbnail ? 'Yes' : 'No'}`,
        );
      });
    } catch (error) {
      console.error(`Error scraping ${profile.platform}:`, error);
    }
  }
}

testProfileScraper().catch(console.error);
