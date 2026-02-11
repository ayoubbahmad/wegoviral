import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(StealthPlugin());

async function debug() {
  const dumpPath = path.join(__dirname, 'scrapes/youtube_shorts.html');
  let htmlContent = fs.readFileSync(dumpPath, 'utf-8');

  console.log(`Loaded HTML content: ${htmlContent.length} bytes`);

  // Strip script tags to avoid parser issues with huge JS blocks
  const cleanHtml = htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  );
  console.log(`Cleaned HTML content: ${cleanHtml.length} bytes`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(cleanHtml);

  const stats = await page.evaluate(() => {
    const richItems = document.querySelectorAll('ytd-rich-item-renderer');
    const lockupHosts = document.querySelectorAll('.shortsLockupViewModelHost');
    const shortsLinks = document.querySelectorAll('a[href*="/shorts/"]');

    return {
      richItemsCount: richItems.length,
      lockupHostsCount: lockupHosts.length,
      shortsLinksCount: shortsLinks.length,
      totalTags: document.querySelectorAll('*').length,
    };
  });

  console.log('Detailed Debug Stats (Cleaned):', stats);

  await browser.close();
}

debug().catch(console.error);
