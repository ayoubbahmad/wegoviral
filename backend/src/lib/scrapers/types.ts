import { Page } from 'playwright';

export interface ScrapedVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  views?: string | number;
  likes?: string | number;
  comments?: string | number;
  postedAt?: string | Date;
}

export interface ScraperMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  likes?: string | number;
  comments?: string | number;
  url: string;
}

export interface ScraperOptions {
  headless?: boolean;
  limit?: number;
}

export interface BaseScraper {
  scrapeFeed(page: Page, limit: number): Promise<ScrapedVideo[]>;
  scrapeMetadata(page: Page, url: string): Promise<ScraperMetadata>;
}
