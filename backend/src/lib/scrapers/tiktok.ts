import { Page } from 'playwright';
import { ScrapedVideo, ScraperMetadata, BaseScraper } from './types';

export class TikTokScraper implements BaseScraper {
  async scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]> {
    // Small wait for dynamic content (like alt tags) to populate
    await page.waitForTimeout(2000);

    const videos = await page.evaluate((limit) => {
      const posts = Array.from(
        document.querySelectorAll('[data-e2e="user-post-item"]'),
      );
      return posts.slice(0, limit).map((post) => {
        const anchor = post.querySelector('a') as HTMLAnchorElement;
        const img = post.querySelector('img') as HTMLImageElement;
        const views =
          post.querySelector('[data-e2e="video-views"]')?.textContent || '0';

        // TikTok often hides the description in the img[alt] tag
        // Fallback order: data-e2e desc > img alt > aria-label
        let description =
          post.querySelector('[data-e2e="user-post-item-desc"]')?.textContent ||
          img?.alt ||
          post.getAttribute('aria-label') ||
          '';

        // Clean up common suffixes
        description = description
          .split(' créé par ')[0]
          .split(' created by ')[0]
          .split(' Regarder en plein écran')[0]
          .trim();

        return {
          url: anchor?.href || '',
          thumbnail: img?.src || '',
          title: description,
          views: views,
          description: description,
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

      const title =
        document
          .querySelector('[data-e2e="user-subtitle"]')
          ?.textContent?.trim() || document.title;
      const handle =
        document
          .querySelector('[data-e2e="user-title"]')
          ?.textContent?.trim()
          .replace('@', '') ||
        url.split('@')[1]?.split('/')[0] ||
        '';
      const bio =
        document.querySelector('[data-e2e="user-bio"]')?.textContent?.trim() ||
        getMeta('description') ||
        '';
      const avatar =
        document
          .querySelector('[data-e2e="user-avatar"] img')
          ?.getAttribute('src') ||
        getMeta('image') ||
        '';

      const followers =
        document
          .querySelector('[data-e2e="followers-count"]')
          ?.textContent?.trim() || '0';
      const following =
        document
          .querySelector('[data-e2e="following-count"]')
          ?.textContent?.trim() || '0';
      const likes =
        document
          .querySelector('[data-e2e="likes-count"]')
          ?.textContent?.trim() || '0';

      return {
        title,
        description: bio,
        thumbnail: avatar,
        handle,
        url,
        followers,
        following,
        likes,
        comments: '0',
      };
    }, url);
  }
}

export const tiktokScraper = new TikTokScraper();
