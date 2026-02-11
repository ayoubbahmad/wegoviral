import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(StealthPlugin());

async function debug() {
  const dumpPath = path.join(__dirname, 'scrapes/youtube_shorts.html');
  let htmlContent = fs.readFileSync(dumpPath, 'utf-8');

  // Remove potential BOM or leading comments if they interfere
  htmlContent = htmlContent.replace(/^<!--.*?-->\s*/s, '');

  console.log(`Loaded HTML content: ${htmlContent.length} bytes`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Try to set content with explicit wait
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  const stats = await page.evaluate(() => {
    const richItems = document.querySelectorAll('ytd-rich-item-renderer');
    const shortsLinks = Array.from(
      document.querySelectorAll('a[href*="/shorts/"]'),
    );

    // Log parents of the first link
    let parentChain = '';
    if (shortsLinks.length > 0) {
      let el = shortsLinks[0] as HTMLElement;
      const parents = [];
      for (let i = 0; i < 10; i++) {
        if (el.parentElement) {
          let desc = el.parentElement.tagName.toLowerCase();
          if (el.parentElement.id) desc += '#' + el.parentElement.id;
          if (el.parentElement.className)
            desc += '.' + el.parentElement.className.replace(/\s+/g, '.');
          parents.push(desc);
          el = el.parentElement;
        }
      }
      parentChain = parents.join(' < ');
    }

    return {
      richItemsCount: richItems.length,
      shortsLinksCount: shortsLinks.length,
      firstLinkParentChain: parentChain,
    };
  });

  console.log('Debug Stats:', stats);

  await browser.close();
}

debug().catch(console.error);
