import { Page } from 'playwright';
import { ScrapedVideo, ScraperMetadata, BaseScraper } from './types';

export class InstagramScraper implements BaseScraper {
  async scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]> {
    // 1. Detect login wall
    const isLoginWall = await page.evaluate(() => {
      return (
        !!document.querySelector('input[name="username"]') ||
        document.title.toLowerCase().includes('login') ||
        !!document.querySelector('form[id="loginForm"]')
      );
    });

    if (isLoginWall) {
      console.warn('[InstagramScraper] Blocked by login wall.');
      return [];
    }

    // 2. Human-like scroll to trigger Reels grid loading
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || totalHeight >= 1000) {
            clearInterval(timer);
            resolve(true);
          }
        }, 100);
      });
    });

    // 3. Wait a bit for grid to stabilize
    await page.waitForTimeout(2000);

    const videos = await page.evaluate((limit) => {
      // Find all reel links
      const reelLinks = Array.from(
        document.querySelectorAll('a[href*="/reel/"]'),
      );

      return reelLinks.slice(0, limit).map((anchor) => {
        const a = anchor as HTMLAnchorElement;
        // Thumbnail is usually in a background-image div inside the anchor
        const bgDiv = a.querySelector(
          'div[style*="background-image"]',
        ) as HTMLElement | null;
        let thumbnail = '';
        if (bgDiv) {
          const match = bgDiv.style.backgroundImage.match(
            /url\(['"]?(.*?)['"]?\)/,
          );
          thumbnail = match ? match[1] : '';
        }

        // Instagram Reels grid has two overlay sections:
        // _aaj_ contains the permanent view count overlay
        // _aaj- contains the hover-triggered likes/comments overlay (ul)
        const viewsElement = a.querySelector('div[class*="_aaj_"] span');
        const views = viewsElement?.textContent?.trim() || '0';

        const metricsList = a.querySelectorAll('ul li');
        let likes = '0';
        let comments = '0';
        if (metricsList.length >= 2) {
          likes = metricsList[0].textContent?.trim() || '0';
          comments = metricsList[1].textContent?.trim() || '0';
        } else if (metricsList.length === 1) {
          likes = metricsList[0].textContent?.trim() || '0';
        }

        return {
          url: a.href,
          thumbnail,
          title: 'Instagram Reel',
          views,
          likes,
          comments,
          description: `Views: ${views}, Likes: ${likes}, Comments: ${comments}`,
        };
      });
    }, limit);

    return videos;
  }

  async scrapeMetadata(page: Page, url: string): Promise<ScraperMetadata> {
    return await page.evaluate((url) => {
      const getMeta = (name: string) =>
        document
          .querySelector(`meta[name="${name}"]`)
          ?.getAttribute('content') ||
        document
          .querySelector(`meta[property="og:${name}"]`)
          ?.getAttribute('content');

      const title = document.title;
      const description = getMeta('description') || '';
      const thumbnail = getMeta('image') || '';

      // Extract handle from URL or meta
      let handle = url.split('instagram.com/')[1]?.split('/')[0] || '';
      if (handle === 'reels' || handle === 'p') {
        // Fallback for direct reel links
        const ogUrl = getMeta('url');
        if (ogUrl)
          handle = ogUrl.split('instagram.com/')[1]?.split('/')[0] || handle;
      }

      return {
        title,
        description,
        thumbnail,
        handle,
        url,
        likes: '0', // These will be enriched by individual post scrapes if needed
        comments: '0',
      };
    }, url);
  }
}

export const instagramScraper = new InstagramScraper();
