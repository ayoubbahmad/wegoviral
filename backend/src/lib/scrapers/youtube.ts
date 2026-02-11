import { Page } from 'playwright';
import { ScrapedVideo, ScraperMetadata, BaseScraper } from './types';

export class YouTubeScraper implements BaseScraper {
  /**
   * Scrapes the Shorts feed of a YouTube channel
   */
  async scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]> {
    page.on('console', (msg) => {
      if (msg.type() === 'log') console.log('YOUTUBE LOG:', msg.text());
    });

    const videos = await page.$$eval(
      'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, .shortsLockupViewModelHost',
      (els: any[], limit: number) => {
        const results: any[] = [];
        const seenUrls = new Set<string>();
        let count = 0;

        for (const el of els) {
          if (count >= limit) break;

          const anchor = el.querySelector(
            'a.reel-item-endpoint, a.shortsLockupViewModelHostEndpoint, a#video-title-link, a#thumbnail',
          ) as any;
          const href = anchor?.getAttribute('href');

          if (!href || !href.includes('/shorts/')) continue;

          const fullUrl = href.startsWith('http')
            ? href
            : `https://www.youtube.com${href}`;
          if (seenUrls.has(fullUrl)) continue;
          seenUrls.add(fullUrl);

          const img = el.querySelector('img, .ytCoreImageHost') as any;
          let thumbUrl =
            img?.getAttribute('src') ||
            img?.getAttribute('data-src') ||
            img?.getAttribute('data-thumb') ||
            img?.getAttribute('srcset')?.split(' ')[0];

          if (!thumbUrl) {
            const style = el.getAttribute('style') || '';
            const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match) thumbUrl = match[1];
          }

          let title =
            el
              .querySelector(
                '.shortsLockupViewModelHostMetadataTitle span[role="text"]',
              )
              ?.textContent?.trim() ||
            el.querySelector('#video-title')?.textContent?.trim() ||
            el.querySelector('span#video-title')?.textContent?.trim() ||
            anchor?.getAttribute('title');

          if (!title) {
            const h3 = el.querySelector('h3');
            if (h3) title = h3.textContent?.trim();
          }

          let viewsText =
            el
              .querySelector(
                '.shortsLockupViewModelHostMetadataSubhead span[role="text"]',
              )
              ?.textContent?.trim() ||
            el.querySelector('#metadata-line')?.textContent?.trim() ||
            '';

          if (!viewsText || !viewsText.toLowerCase().includes('views')) {
            const allElements = Array.from(
              el.querySelectorAll('span, div'),
            ) as any[];
            const viewSpan = allElements.find((s: any) =>
              s.textContent?.toLowerCase().includes('views'),
            );
            if (viewSpan) viewsText = viewSpan.textContent?.trim() || '';
          }

          const viewsMatch = viewsText.match(/([\d.,]+[KMB]?)\s+views/i);

          results.push({
            url: fullUrl,
            thumbnail: thumbUrl || undefined,
            title: title?.replace(/\s+/g, ' ') || 'YouTube Short',
            views: viewsMatch ? viewsMatch[1].replace(/,/g, '') : undefined,
            description: viewsText,
          });
          count++;
        }
        return results;
      },
      limit,
    );

    return videos;
  }

  /**
   * Scrapes metadata for a single YouTube URL
   */
  async scrapeMetadata(page: Page, url: string): Promise<ScraperMetadata> {
    return await page.evaluate((url) => {
      const getMeta = (name: string) =>
        document
          .querySelector(`meta[name="${name}"]`)
          ?.getAttribute('content') ||
        document
          .querySelector(`meta[property="${name}"]`)
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

export const youtubeScraper = new YouTubeScraper();
