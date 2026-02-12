import fs from 'fs';
import { browserEngine } from './scrapers/browser-engine';
import { scraperRegistry } from './scrapers/registry';
import { ScrapedVideo, ScraperMetadata } from './scrapers/types';

/**
 * Main entry point for scraping a profile feed (e.g., MrBeast Shorts)
 */
export async function scrapeProfileFeed(
  url: string,
  limit = 10,
): Promise<ScrapedVideo[]> {
  const page = await browserEngine.createPage();
  try {
    if (url.startsWith('file://')) {
      const filePath = url.replace('file://', '');
      let html = fs.readFileSync(filePath, 'utf-8');
      // Performance optimization: Strip scripts from large HTML dumps
      html = html.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '',
      );
      await page.setContent(html);
    } else {
      const waitCondition =
        url.includes('instagram.com') || url.includes('tiktok.com')
          ? 'networkidle'
          : 'domcontentloaded';
      await page.goto(url, { waitUntil: waitCondition, timeout: 60000 });
    }

    const scraper = scraperRegistry.getScraper(url);
    const results = await scraper.scrapeFeed(page, limit);
    return results;
  } catch (error) {
    console.error(`[Scraper] Error scraping feed for ${url}:`, error);
    return [];
  } finally {
    // Note: We don't close the browser instance here, just the page
    // The engine keeps the browser alive for reuse
    await page.close();
  }
}

/**
 * Main entry point for scraping single URL metadata
 */
export async function scrapeUrl(url: string): Promise<ScraperMetadata> {
  console.log(`[Scraper] Scraping metadata for: ${url}`);

  const page = await browserEngine.createPage();
  try {
    const waitCondition =
      url.includes('instagram.com') || url.includes('tiktok.com')
        ? 'networkidle'
        : 'domcontentloaded';
    await page.goto(url, { waitUntil: waitCondition, timeout: 60000 });

    const scraper = scraperRegistry.getScraper(url);
    return await scraper.scrapeMetadata(page, url);
  } catch (error) {
    console.error(`[Scraper] Error scraping metadata for ${url}:`, error);
    throw error;
  } finally {
    await page.close();
  }
}

// Export shared types for convenience
export * from './scrapers/types';
