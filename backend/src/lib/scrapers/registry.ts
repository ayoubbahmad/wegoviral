import { BaseScraper } from './types';
import { youtubeScraper } from './youtube';
import { tiktokScraper } from './tiktok';
import { instagramScraper } from './instagram';

export class ScraperRegistry {
  private static instance: ScraperRegistry;
  private scrapers: Map<string, BaseScraper> = new Map();

  private constructor() {
    this.scrapers.set('youtube', youtubeScraper);
    this.scrapers.set('tiktok', tiktokScraper);
    this.scrapers.set('instagram', instagramScraper);
  }

  static getInstance(): ScraperRegistry {
    if (!ScraperRegistry.instance) {
      ScraperRegistry.instance = new ScraperRegistry();
    }
    return ScraperRegistry.instance;
  }

  getScraper(url: string): BaseScraper {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('youtube')) return this.scrapers.get('youtube')!;
    if (lowercaseUrl.includes('tiktok')) return this.scrapers.get('tiktok')!;
    if (lowercaseUrl.includes('instagram'))
      return this.scrapers.get('instagram')!;

    // Default to Instagram or throw
    return this.scrapers.get('instagram')!;
  }

  getPlatform(url: string): string {
    const lowercaseUrl = url.toLowerCase();
    if (lowercaseUrl.includes('youtube.com')) return 'youtube';
    if (lowercaseUrl.includes('tiktok.com')) return 'tiktok';
    if (lowercaseUrl.includes('instagram.com')) return 'instagram';
    return 'instagram';
  }
}

export const scraperRegistry = ScraperRegistry.getInstance();
