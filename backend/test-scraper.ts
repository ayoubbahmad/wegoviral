import { scrapeUrl } from './src/lib/scraper';
import fs from 'fs';
import path from 'path';

/**
 * Usage:
 * npx ts-node test-scraper.ts [platform1] [platform2] ...
 * Example:
 * npx ts-node test-scraper.ts instagram tiktok
 *
 * If no arguments are provided, all platforms are tested.
 * Local samples are prioritized over live URLs for speed and stability.
 */

async function test() {
  const args = process.argv.slice(2).map((a) => a.toLowerCase());

  const platforms = [
    {
      name: 'instagram',
      local: path.join(__dirname, 'samples/instagram_sample.html'),
      url: 'https://www.instagram.com/reel/DUbdY-0kkTw/',
    },
    {
      name: 'tiktok',
      local: path.join(__dirname, 'samples/tiktok_sample.html'),
      url: 'https://www.tiktok.com/@mrbeast/video/7600180137346256158',
    },
    {
      name: 'youtube_video',
      local: path.join(__dirname, 'samples/youtube_video_sample.html'),
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      name: 'youtube_short',
      local: path.join(__dirname, 'samples/youtube_short_sample.html'),
      url: 'https://www.youtube.com/shorts/-CUeKoiSPDY',
    },
  ];

  // Filter based on arguments if provided
  const targetPlatforms =
    args.length > 0
      ? platforms.filter((p) => args.some((arg) => p.name.includes(arg)))
      : platforms;

  if (targetPlatforms.length === 0 && args.length > 0) {
    console.error(
      `Error: No platforms matched "${args.join(', ')}". \nAvailable platforms: instagram, tiktok, youtube_video, youtube_short`,
    );
    return;
  }

  for (const platform of targetPlatforms) {
    console.log(`\n--- Testing ${platform.name.toUpperCase()} ---`);

    if (fs.existsSync(platform.local)) {
      console.log(`Testing Local Sample: ${platform.local}`);
      const result = await scrapeUrl(`file://${platform.local}`);
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      console.log(`Local sample not found. Testing Live URL: ${platform.url}`);
      const result = await scrapeUrl(platform.url);
      console.log('Result:', JSON.stringify(result, null, 2));
    }
  }
}

test().catch(console.error);
