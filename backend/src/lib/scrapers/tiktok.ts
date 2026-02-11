import { Page } from 'playwright';
import { ScrapedVideo, ScraperMetadata, BaseScraper } from './types';

export class TikTokScraper implements BaseScraper {
  async scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]> {
    const videos = await page.evaluate((limit) => {
      const posts = Array.from(
        document.querySelectorAll('[data-e2e="user-post-item"]'),
      );
      return posts.slice(0, limit).map((post) => {
        const anchor = post.querySelector('a') as HTMLAnchorElement;
        const img = post.querySelector('img') as HTMLImageElement;
        const desc =
          post.querySelector('[data-e2e="user-post-item-desc"]')?.textContent ||
          '';
        const views =
          post.querySelector('[data-e2e="video-views"]')?.textContent || '0';

        return {
          url: anchor?.href || '',
          thumbnail: img?.src || '',
          title: desc,
          views: views,
          description: desc,
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
        handle: url.split('@')[1]?.split('/')[0] || '',
        url,
        likes: '0',
        comments: '0',
      };
    }, url);
  }
}

export const tiktokScraper = new TikTokScraper();
