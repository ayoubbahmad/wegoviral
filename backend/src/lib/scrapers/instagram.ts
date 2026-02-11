import { Page } from 'playwright';
import { ScrapedVideo } from './types';

export const scrapeInstagram = async (
  page: Page,
  limit: number,
): Promise<ScrapedVideo[]> => {
  console.log('Instagram scraping paused to avoid blocking.');
  return [];
};
