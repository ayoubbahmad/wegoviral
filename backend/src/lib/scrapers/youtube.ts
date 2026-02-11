import { Page } from 'playwright';
import { ScrapedVideo } from './types';

/**
 * YouTube Shorts Scraper
 *
 * Target: YouTube Channel / Shorts page
 * Selectors derived from local HTML dump and snippets provided by user
 */
export const scrapeYouTube = async (
  page: Page,
  limit: number,
): Promise<ScrapedVideo[]> => {
  // Listen to console logs from the page context for debugging
  page.on('console', (msg) => {
    if (msg.type() === 'log') console.log('PAGE LOG:', msg.text());
  });

  const scrapedVideos = await page.$$eval(
    'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, .shortsLockupViewModelHost',
    (els: any[], limit: number) => {
      console.log(`PAGE LOG: Found ${els.length} potential shorts containers.`);
      const results: any[] = [];
      const seenUrls = new Set<string>();
      let count = 0;

      for (const el of els) {
        if (count >= limit) break;

        // 1. Find the link to extract URL
        const anchor = el.querySelector(
          'a.reel-item-endpoint, a.shortsLockupViewModelHostEndpoint, a#video-title-link, a#thumbnail',
        ) as any;
        const href = anchor?.getAttribute('href');

        if (!href || !href.includes('/shorts/')) continue;

        // Deduplicate based on URL
        const fullUrl = href.startsWith('http')
          ? href
          : `https://www.youtube.com${href}`;
        if (seenUrls.has(fullUrl)) continue;
        seenUrls.add(fullUrl);

        // 2. Thumbnail
        // Check multiple attributes and locations
        const img = el.querySelector('img, .ytCoreImageHost') as any;
        let thumbUrl =
          img?.getAttribute('src') ||
          img?.getAttribute('data-src') ||
          img?.getAttribute('data-thumb') ||
          img?.getAttribute('srcset')?.split(' ')[0];

        // Fallback: search for background-image in styles
        if (!thumbUrl) {
          const style = el.getAttribute('style') || '';
          const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (match) thumbUrl = match[1];
        }

        // 3. Title
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

        // 4. Views (Metadata)
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

        // Handle formats like "343,906 views", "1.2M views", "19k views"
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

  return scrapedVideos;
};
