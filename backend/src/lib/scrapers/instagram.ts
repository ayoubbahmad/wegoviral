import { Page } from 'playwright';
import { ScrapedVideo, ScraperMetadata, BaseScraper } from './types';

export class InstagramScraper implements BaseScraper {
  async scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]> {
    // Basic Instagram extraction logic
    const videos = await page.evaluate((limit) => {
      const posts = Array.from(
        document.querySelectorAll(
          'article a[href*="/reels/"], article a[href*="/p/"]',
        ),
      );
      return posts.slice(0, limit).map((anchor: any) => {
        const img = anchor.querySelector('img');
        return {
          url: anchor.href,
          thumbnail: img?.src || '',
          title: 'Instagram Post',
          views: '0',
          description: '',
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

      return {
        title: document.title,
        description: getMeta('description') || '',
        thumbnail: getMeta('image') || '',
        handle: url.split('instagram.com/')[1]?.split('/')[0] || '',
        url,
        likes: '0',
        comments: '0',
      };
    }, url);
  }
}

export const instagramScraper = new InstagramScraper();
